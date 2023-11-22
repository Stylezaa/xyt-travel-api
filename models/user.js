const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
    },
    f_name: {
      type: String,
      require: true,
    },
    l_name: {
      type: String,
      require: true,
    },
    profile_img: {
      type: String,
      require: true,
      default: "profile-default.png",
    },
    phone_number: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
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

module.exports = User = mongoose.model("user", UserSchema); //Export Model
