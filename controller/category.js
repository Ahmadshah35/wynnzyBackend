const categoryFunction = require("../functions/category");

const addcategory = async (req, res) => {
    try {
        const category = await categoryFunction.addcategory(req);
        return res.status(200).json({
            success: true,
            message: "Category Added Successfully!",
            data: category
        })
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error.message,
        });
    }
};

const getCatgory = async (req, res) => {
    try {
        const category = await categoryFunction.getCatgory(req);
        return res.status(200).json({
            success: true,
            message: "Category Details By Id!",
            data: category
        })
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error.message,
        });
    }    
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryFunction.getAllCategories(req);
        if(categories.length === 0){
            return res.status(200).json({
            success: false,
            message: "No categories Found!"
        })
        } else {
            return res.status(200).json({
                success: true,
                message: "All Catgeories By Manager!",
                data: categories
            })
        }
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error.message,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await categoryFunction.updateCategory(req);
        return res.status(200).json({
            success: true,
            message: "Category Updated Successfully!",
            data: category
        })
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error.message,
        });
    }    
};

const deleteCategory = async (req, res) => {
    try {
        const category = await categoryFunction.deleteCategory(req);
        return res.status(200).json({
            success: true,
            message: "Category Deleted!"
        })
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error.message,
        });
    }    
};

module.exports = {
    addcategory,
    getCatgory,
    getAllCategories,
    updateCategory,
    deleteCategory
};