const cartModel = require("../models/cart");
const productModel = require("../models/product");

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variationId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let price;
    let availableStock;

    if (variationId) {
      const variation = product.variations.id(variationId);
      if (!variation) {
        return res.status(404).json({
          success: false,
          message: "Variation not found",
        });
      }

      price = variation.price;
      availableStock = variation.stock;
    } else {
      price = product.price;
      availableStock = product.stock;
    }

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = await cartModel.create({ userId, items: [],couponCode: null, discount: 0 });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        String(item.variationId || "") === String(variationId || "")
    );

    if (existingItem) {
      if (existingItem.quantity + quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        variationId: variationId || null,
        quantity,
        price,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getCart = async (req, res) => {
  try {
    const userId  = req.user._id;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart) {
      const cartCreated = await cartModel.create({ userId, items: [], couponCode: null, discount: 0 });
      return res.status(200).json({
        success: true,
        data: cartCreated,
      });
    }


    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variationId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        String(item.variationId || "") === String(variationId || "")
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let availableStock;

    if (variationId) {
      const variation = product.variations.id(variationId);
      if (!variation) {
        return res.status(404).json({
          success: false,
          message: "Variation not found",
        });
      }
      availableStock = variation.stock;
    } else {
      availableStock = product.stock;
    }

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variationId } = req.body;

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          String(item.variationId || "") === String(variationId || "")
        )
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOneAndUpdate(
      { userId },
      { items: [], couponCode: null, discount: 0 },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};
