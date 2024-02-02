// registerUser
const getToken = require("../config/authwithjwt");
const User = require("../Models/userModel");

// 1st route
const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400).send("Please Enter new all the fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User Already exist");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: getToken(user._id),
    });
  } else {
    res.send("Failed to create the user");
  }
};

const authUser = (req, res) => {
  const { email, password } = req.body;
};

module.exports = registerUser;
