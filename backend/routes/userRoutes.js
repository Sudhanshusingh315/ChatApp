const express = require("express");
const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser); // need to import this
router.get("/", allUser);
module.exports = router;
