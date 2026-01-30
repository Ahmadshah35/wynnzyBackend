const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const multer = require("multer");

const productStorage = multer.diskStorage({
  destination: "./public/product",
  filename: (req, file, cb) => {
    cb(null,Date.now() + "-" + file.originalname)
  },
});

const productUpload = multer({
  storage: productStorage
});
// Product
router.post("/createProduct",productUpload.array("images", 5), productController.createProduct);
router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductById", productController.getProductById);
router.put("/updateProduct",productUpload.array("images", 5), productController.updateProduct);
router.delete("/deleteProduct", productController.deleteProduct);

// Review Product
router.post("/addProductReview", productController.addProductReview);
router.get("/getProductReviews", productController.getProductReviews);

// Favorite Product
router.post("/toggleFavoriteProduct", productController.toggleFavoriteProduct);
router.get("/getFavoriteProducts", productController.getFavoriteProducts);


module.exports = router;