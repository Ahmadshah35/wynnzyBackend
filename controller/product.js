const productModel = require("../models/product");
const reviewProductModel = require("../models/reviewProduct");
const userModel = require("../models/user");
const mongoose = require("mongoose");

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      productName,
      brand,
      category,
      petType,
      ageGroup,
      ingredients,
      nutritionalInfo,
      variations,
      description,
      discount,
      discountPrice,
      featured,
      status,
      adminId
    } = req.body;

    // Parse variations if sent as JSON string
    let parsedVariations = [];
    if (variations) {
      parsedVariations = typeof variations === 'string' ? JSON.parse(variations) : variations;
    }

    // Get all uploaded images
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const product = await productModel.create({
      adminId,
      productName,
      brand,
      images,
      category,
      petType,
      ageGroup,
      ingredients,
      nutritionalInfo,
      variations: parsedVariations,
      description,
      discount,
      discountPrice,
      featured,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      petType,
      ageGroup,
      brand,
      featured,
      status,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (petType) filter.petType = petType;
    if (ageGroup) filter.ageGroup = ageGroup;
    if (brand) filter.brand = brand;
    if (featured) filter.featured = featured;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter["variations.price"] = {};
      if (minPrice) filter["variations.price"].$gte = Number(minPrice);
      if (maxPrice) filter["variations.price"].$lte = Number(maxPrice);
    }

    const products = await productModel
      .find(filter)
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(200).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await productModel
      .findById(productId)
      .populate("adminId", "name email");

    if (!product) {
      return res.status(200).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { productId, variations } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(200).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Parse variations if sent as JSON string
    let parsedVariations = variations;
    if (variations && typeof variations === 'string') {
      parsedVariations = JSON.parse(variations);
    }

    // Prepare update data
    const updateData = { ...req.body };
    delete updateData.productId;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      updateData.images = newImages;
    }

    // Update variations if provided
    if (parsedVariations) {
      updateData.variations = parsedVariations;
    }

    const product = await productModel.findByIdAndUpdate(
      productId, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(200).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(200).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findByIdAndDelete(productId);

    if (!product) {
      return res.status(200).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Review to Product
const addProductReview = async (req, res) => {
  try {
    const { productId, userId, variationId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(200).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(200).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(200).json({
        success: false,
        message: "Product not found",
      });
    }

    // If variationId provided, check if it exists
    if (variationId) {
      const variationExists = product.variations.some(
        (v) => v._id.toString() === variationId
      );
      if (!variationExists) {
        return res.status(404).json({
          success: false,
          message: "Variation not found",
        });
      }
    }

    // Create review
    const review = await reviewProductModel.create({
      userId,
      productId,
      variationId: variationId || null,
      rating,
      comment,
    });

    // Update product rating and review count
    const reviews = await reviewProductModel.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / reviews.length;

    await productModel.findByIdAndUpdate(productId, {
      averageRating: averageRating.toFixed(1),
      reviewCount: reviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product Reviews
const getProductReviews = async (req, res) => {
  try {
    const {productId, variationId, userId, reviewId} = req.query;

    const filter = {};
    if(productId) {
      filter.productId = productId;
    }
    if (variationId) {
      filter.variationId = variationId;
    }

    if (userId) {
      filter.userId = userId;
    }
    if (reviewId) {
      filter._id = reviewId;
    }

    const reviews = await reviewProductModel
      .find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Favorite Product (Add/Remove)
const toggleFavoriteProduct = async (req, res) => {
  try {
    const { productId ,userId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(200).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(200).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product is already in favorites
    const isFavorite = user.favProducts.includes(productId);

    let updatedUser;
    let updatedProduct;
    let message;

    if (isFavorite) {
      // Remove userId from product's favoriteBy
      updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { $pull: { favoriteBy: userId } },
        { new: true }
      );
      // Remove from favorites
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $pull: { favProducts: productId } },
        { new: true }
      );
      message = "Product removed from favorites";
    } else {
      // Add userId to product's favoriteBy
      updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { $push: { favoriteBy: userId } },
        { new: true }
      );
      // Add to favorites
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $push: { favProducts: productId } },
        { new: true }
      ).populate("favProducts", "-__v");
      message = "Product added to favorites";
    }

    res.status(200).json({
      success: true,
      message: message,
      isFavorite: !isFavorite,
      favProducts: updatedUser.favProducts,
      favoriteCount: updatedProduct.favoriteBy.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFavoriteProducts = async (req, res) => {
  try {
    const {userId} = req.query; 

    const user = await userModel
      .findById(userId)
      .populate({
        path: "favProducts",
        select: "-__v",
      });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.favProducts.length,
      data: user.favProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
  toggleFavoriteProduct,
  getFavoriteProducts,
};
