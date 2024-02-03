const express = require("express");
const { registerUser, authUser } = require("../controllers/userController");
const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser); // need to import this

module.exports = router;
