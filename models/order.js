const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variationId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shippingAddress",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "PayPal", "COD", "Stripe", "Apple_Pay", "Google_Pay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionId: {
      type: String,
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out_for_Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    trackingNumber: {
      type: String,
    },
    shippingCarrier: {
      type: String,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    notes: {
      type: String,
    },
    statusHistory: [
      {
        status: {
          type: String,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Generate unique order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Add status to history before updating
orderSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.orderStatus || update.$set?.orderStatus) {
    const newStatus = update.orderStatus || update.$set.orderStatus;
    if (!update.$push) {
      update.$push = {};
    }
    update.$push.statusHistory = {
      status: newStatus,
      updatedAt: new Date(),
    };
  }
  next();
});

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
