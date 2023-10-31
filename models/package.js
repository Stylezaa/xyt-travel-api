const mongoose = require("mongoose");
const { Schema } = mongoose;

const PackageSchema = new Schema(
  {
    cover: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    // TOUR
    duration_tour: {
      type: Number,
      require: true,
    },
    start_tour: {
      type: String,
      require: true,
    },
    end_tour: {
      type: String,
      require: true,
    },
    meals_tour: {
      type: String,
      require: true,
    },
    cities_tour: {
      type: Number,
      require: true,
    },
    min_tour: {
      type: Number,
      require: true,
    },
    max_tour: {
      type: Number,
      require: true,
    },
    // Overviews
    trip_overview: {
      type: String,
      require: true,
    },
    recommend_for: {
      type: Array,
      require: true,
    },
    // Itinerary
    itinerary: {
      type: Array,
      require: true,
    },
    // Pocket
    pocket_summary: {
      type: Array,
      require: true,
    },
    // Policy
    booking_policy: {
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

module.exports = Package = mongoose.model("package", PackageSchema); //Export Model
