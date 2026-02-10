const express = require("express");
const shippingAddressController = require("../controller/shippingAddress");
const userAuth = require("../middleware/auth");
const router = express.Router();

router.post("/createShippingAddress",userAuth, shippingAddressController.createShippingAddress);
router.get("/getUserShippingAddresses",userAuth, shippingAddressController.getUserShippingAddresses);
router.get("/getShippingAddressById",userAuth, shippingAddressController.getShippingAddressById);
router.put("/updateShippingAddress",userAuth, shippingAddressController.updateShippingAddress);
router.delete("/deleteShippingAddress",userAuth, shippingAddressController.deleteShippingAddress);

module.exports = router;
