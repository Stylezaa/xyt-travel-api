// Library
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    cover: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    content: {
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

module.exports = Activity = mongoose.model("activity", ActivitySchema); //Export Model
