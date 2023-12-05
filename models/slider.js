const mongoose = require("mongoose");
const { Schema } = mongoose;

const SliderSchema = new Schema(
  {
    images: {
      type: Array,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true } //Open timestamps
);

const Slider = mongoose.model("slider", SliderSchema); //Export Model

module.exports = Slider;
