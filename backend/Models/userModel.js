const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default: "https://i.imgur.com/V4RclNb.png",
    },
  },
  { timestamps: true }
);
userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre("save", async function (next) {
  const saltRounds = 10;
  console.log(this.password);
  try {
    this.password = await bcrypt.hash(this.password, saltRounds);
  } catch (err) {
    console.log(err.message);
  }
  console.log(this.password);
  next();
});

const User = mongoose.model("User", userModel);

module.exports = User;
