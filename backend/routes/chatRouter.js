const express = require("express");
const routes = express.Router();
const protect = require("../middleware/auth");
const { accessChat } = require("../controllers/chatController");

routes.post("/", protect, accessChat);
// routes.get("/", protect, fetchChat);
// routes.post("group", protect, createGroupChat);
// routes.put("/rename", protect, renameGroupChat);
// routes.put("/grouprename", protect, removeFromGroup);
// routes.put("/groupadd", protect, addToGroup);

module.exports = routes;
