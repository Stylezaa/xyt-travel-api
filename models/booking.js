const mongoose = require("mongoose");
const { Schema } = mongoose;
// Model
const Package = require("../models/package");

const BookingSchema = new Schema(
  {
    booking_number: {
      type: String,
      require: true,
    },
    package_id: {
      type: Schema.Types.ObjectId,
      ref: Package,
      require: true,
    },
    adults: {
      type: Number,
      require: true,
    },
    children: {
      type: Number,
      require: true,
    },
    infants: {
      type: Number,
      require: true,
    },
    date_of_arrival: {
      type: Date,
      require: true,
    },
    arrival_airport: {
      type: String,
      require: true,
    },
    tour_type: {
      type: String,
      require: true,
    },
    special_requirement: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    full_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone_number: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    whatsapp: {
      type: String,
      require: true,
    },
    facebook: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
      default: "ລໍຖ້າການຊໍາລະເງິນ",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } //Open timestamps
);

module.exports = Booking = mongoose.model("Booking", BookingSchema); //Export Model
