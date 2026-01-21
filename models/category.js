const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    managerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;