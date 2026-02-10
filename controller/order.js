const orderModel = require("../models/order");
const productModel = require("../models/product");
const userModel = require("../models/user");
const mongoose = require("mongoose");


const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes,
    } = req.body;

    // 1️⃣ Validate user (WITH session)
    const user = await userModel.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let subtotal = 0;
    const orderItems = [];

    // 2️⃣ Process items
    for (const item of items) {
      const product = await productModel
        .findById(item.productId)
        .session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      let price;

      if (item.variationId) {
        const variation = product.variations.id(item.variationId);

        if (!variation) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({
            success: false,
            message: `Variation not found for ${product.productName}`,
          });
        }

        if (variation.stock < item.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.productName}`,
          });
        }

        price = variation.price;
        variation.stock -= item.quantity;
      } else {
        price = product.price;
      }

      product.sold += item.quantity;
      await product.save({ session });

      subtotal += price * item.quantity;

      orderItems.push({
        productId: product._id,
        variationId: item.variationId || null,
        quantity: item.quantity,
        price,
      });
    }

    // 3️⃣ Totals
    const discount = 0;
    const TAX_PERCENT = 2;
    const SHIPPING_FEE = 50;

    const taxAmount = (subtotal * TAX_PERCENT) / 100;
    const discountAmount = (subtotal * discount) / 100;

    const totalAmount =
      subtotal + taxAmount + SHIPPING_FEE - discountAmount;

    // 4️⃣ Create order (transaction-safe)
    const [order] = await orderModel.create(
      [
        {
          userId,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          subtotal,
          tax: TAX_PERCENT,
          shippingFee: SHIPPING_FEE,
          discount:discount,
          couponCode,
          totalAmount,
          notes,
          statusHistory: [
            {
              status: "Pending",
              updatedAt: new Date(),
              notes: "Order created",
            },
          ],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedOrder = await orderModel
      .findById(order._id)
      .populate("userId", "-password")
      .populate("items.productId")
      .populate("shippingAddress");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const {
      orderStatus,
      paymentStatus,
      userId,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
    } = req.query;
    
    const filter = {};
    
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (userId) filter.userId = userId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.phoneNumber": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const orders = await orderModel
    .find(filter)
      .populate("userId", "fullName email profileImage")
      .populate("items.productId", "productName brand images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

      const totalOrders = await orderModel.countDocuments(filter);
      
      res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }
    
    const order = await orderModel
      .findById(id)
      .populate("userId", "fullName email profileImage")
      .populate("items.productId", "productName brand images category");

      if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const { orderStatus, page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const filter = { userId };
    if (orderStatus) filter.orderStatus = orderStatus;

    const skip = (page - 1) * limit;

    const orders = await orderModel
      .find(filter)
      .populate("items.productId", "productName brand images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await orderModel.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { orderStatus, notes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Out_for_Delivery",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updateData = {
      orderStatus,
      $push: {
        statusHistory: {
          status: orderStatus,
          updatedAt: new Date(),
          notes: notes || "",
        },
      },
    };

    if (orderStatus === "Delivered") {
      updateData.deliveredAt = new Date();
    }

    if (orderStatus === "Cancelled") {
      updateData.cancelledAt = new Date();
      if (notes) updateData.cancellationReason = notes;
    }

    const order = await orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("userId", "fullName email")
      .populate("items.productId", "productName brand");
      
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Payment Status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { paymentStatus, transactionId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const validPaymentStatuses = ["Pending", "Paid", "Failed", "Refunded"];

    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const updateData = { paymentStatus };
    if (transactionId) updateData.transactionId = transactionId;
    
    const order = await orderModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .populate("userId", "fullName email");
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Tracking Information
const updateTracking = async (req, res) => {
  try {
    const { id } = req.query;
    const { trackingNumber, shippingCarrier, estimatedDeliveryDate } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const updateData = {};
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (shippingCarrier) updateData.shippingCarrier = shippingCarrier;
    if (estimatedDeliveryDate)
      updateData.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
    
    const order = await orderModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tracking information updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const { cancellationReason } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["Delivered", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      });
    }

    // Restore product stock
    for (let item of order.items) {
      const product = await productModel.findById(item.productId);
      if (product) {
        if (item.variationId) {
          const variation = product.variations.id(item.variationId);
          if (variation) {
            variation.stock += item.quantity;
          }
        }
        product.sold -= item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || "Cancelled by user";
    order.statusHistory.push({
      status: "Cancelled",
      updatedAt: new Date(),
      notes: cancellationReason || "Cancelled by user",
    });

    await order.save();
    
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Order Statistics
const getOrderStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const totalOrders = await orderModel.countDocuments(filter);
    const pendingOrders = await orderModel.countDocuments({
      ...filter,
      orderStatus: "Pending",
    });
    const confirmedOrders = await orderModel.countDocuments({
      ...filter,
      orderStatus: "Confirmed",
    });
    const processingOrders = await orderModel.countDocuments({
      ...filter,
      orderStatus: "Processing",
    });
    const shippedOrders = await orderModel.countDocuments({
      ...filter,
      orderStatus: "Shipped",
    });
    const deliveredOrders = await orderModel.countDocuments({
      ...filter,
      orderStatus: "Delivered",
    });
    const cancelledOrders = await orderModel.countDocuments({
      ...filter,
      orderStatus: "Cancelled",
    });
    
    // Calculate total revenue from delivered orders
    const revenueData = await orderModel.aggregate([
      {
        $match: {
          ...filter,
          orderStatus: "Delivered",
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

      res.status(200).json({
      success: true,
      message: "Order statistics fetched successfully",
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updatePaymentStatus,
  updateTracking,
  cancelOrder,
  getOrderStatistics,
};




// // Create Order
// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       items,
//       shippingAddress,
//       paymentMethod,
//       couponCode,
//       notes,
//       discount,
//     } = req.body;

//     // Validate user
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Validate products and calculate totals
//     let calculatedSubtotal = 0;
//     const orderItems = [];

//     for (let item of items) {
//       const product = await productModel.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product not found: ${item.productId}`,
//         });
//       }

//       let itemPrice = item.price;

//       // Check stock if variationId is provided
//       if (item.variationId) {
//         const variation = product.variations.id(item.variationId);
//         if (!variation) {
//           return res.status(404).json({
//             success: false,
//             message: `Variation not found for ${product.productName}`,
//           });
//         }
//         if (variation.stock < item.quantity) {
//           return res.status(400).json({
//             success: false,
//             message: `Insufficient stock for ${product.productName}`,
//           });
//         }
//         itemPrice = variation.price;
//       }

//       calculatedSubtotal += itemPrice * item.quantity;

//       orderItems.push({
//         productId: item.productId,
//         variationId: item.variationId || null,
//         quantity: item.quantity,
//         price: itemPrice,
//       });
//     }

//     // Calculate total amount
//     const taxPercent = 2;
//     const taxAmount = (calculatedSubtotal * taxPercent) / 100;
//     const shippingFee = 50;
//     const discountPercent = discount || 0;
//     const discountAmount = (calculatedSubtotal * discountPercent) / 100;
//     const totalAmount = calculatedSubtotal + taxAmount + shippingFee - discountAmount;

//     // Create order
//     const order = await orderModel.create({
//       userId,
//       items: orderItems,
//       shippingAddress,
//       paymentMethod,
//       subtotal: calculatedSubtotal,
//       tax: taxPercent,
//       shippingFee: shippingFee,
//       discount: discountPercent,
//       couponCode,
//       totalAmount: totalAmount,
//       notes,
//       statusHistory: [
//         {
//           status: "Pending",
//           updatedAt: new Date(),
//           notes: "Order created",
//         },
//       ],
//     });

//     // Update product stock and sold count
//     for (let item of items) {
//       const product = await productModel.findById(item.productId);
//       if (item.variationId) {
//         const variation = product.variations.id(item.variationId);
//         if (variation) {
//           variation.stock -= item.quantity;
//         }
//       }
//       product.sold += item.quantity;
//       await product.save();
//     }

//     const populatedOrder = await orderModel
//       .findById(order._id)
//       .populate("userId", "-password")
//       .populate("items.productId");

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: populatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
