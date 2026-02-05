const express = require("express");
const orderController = require("../controller/order");
const router = express.Router();

// Create Order
router.post("/createOrder", orderController.createOrder);
router.get("/getAllOrders", orderController.getAllOrders);
router.get("/getOrderById/", orderController.getOrderById);
router.get("/getUserOrders/", orderController.getUserOrders);
router.put("/updateOrderStatus/", orderController.updateOrderStatus);
router.put("/updatePaymentStatus/", orderController.updatePaymentStatus);
router.put("/updateTracking/", orderController.updateTracking);
router.put("/cancelOrder/", orderController.cancelOrder);
router.get("/order/statistics", orderController.getOrderStatistics);

module.exports = router;
