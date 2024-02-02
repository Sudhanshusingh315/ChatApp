const express = require("express");
const Routerconstroller = require("../controllers/userController");
const router = express.Router();

router.post("/", Routerconstroller);
router.post("/login", authUser); // need to import this

module.exports = router;
