const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default: "https://i.imgur.com/V4RclNb.png",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userModel);
