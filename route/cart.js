const express = require("express");
const cartController = require("../controller/cart");
const userAuth = require("../middleware/auth");
const router = express.Router();

router.post("/addToCart", userAuth, cartController.addToCart);
router.get("/getCart", userAuth, cartController.getCart);
router.put("/updateCartItemQuantity", userAuth, cartController.updateCartItemQuantity);
router.delete("/removeCartItem", userAuth, cartController.removeCartItem);
router.delete("/clearCart", userAuth, cartController.clearCart);
module.exports = router;
