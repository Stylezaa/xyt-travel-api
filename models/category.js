// Library
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    cate_name: {
      type: String,
      require: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } //Open timestamps
);

module.exports = Category = mongoose.model("category", CategorySchema); //Export Model
