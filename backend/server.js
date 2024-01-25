const chats = require("./data/data.js");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors());
server.get("/api/chats", (req, res) => {
  res.send(chats.chats);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening at port ${port}`);
});
