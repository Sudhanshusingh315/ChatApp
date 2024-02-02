// Requires
const express = require("express");
const mongoose = require("mongoose");
const serverRouter = require("./routes/userRoutes.js");
const cors = require("cors"); // this prevents from cors
const server = express();
// to fix cors error
server.use(cors());

// Connectino Of Mongoose
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://LeaderOfMeow:qwezxc%21%21%40%21@cluster0.obaetrj.mongodb.net/"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}
main();

// Routes
server.use(express.json()); // this is just a body parser
server.use("/api/user", serverRouter);

// Server Port and listening

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening at port ${port}`);
});
