const categoryModel = require("../models/category");

const addcategory = async (req) => {
    const newCategory = new categoryModel(req.body);
    if( req.file && req.file.filename){
        newCategory.image = req.file.filename
    }
    const result = await newCategory.save();
    return result;
};

const getCatgory = async (req) => {
    const { categoryId } = req.query;
    const result = await categoryModel.findById({ _id: categoryId });
    return result
};

const getAllCategories = async (req) => {
    const { managerId } = req.query;
    const result = await categoryModel.find({ managerId: managerId });
    return result
};

const updateCategory = async (req) => {
    const { categoryId } = req.body;
    const updatedData = req.body;
    if( req.file && req.file.filename){
        updatedData.image = req.file.filename
    };
    const result = await categoryModel.findByIdAndUpdate({ _id: categoryId },
        { $set: updatedData },
        { new: true }
    );
    return result
};

const deleteCategory = async (req) => {
    const { categoryId } = req.query;
    const result = await categoryModel.findByIdAndDelete({ _id: categoryId });
    return result
};

module.exports = {
    addcategory,
    getCatgory,
    getAllCategories,
    updateCategory,
    deleteCategory
};