import express from "express";
import cors from "cors";
import mongoose, { connect } from "mongoose";
import { configFile } from "./constants.config.js";
import authRoutes from "./routes/authRoute.js";
import { app, io, server } from "./socket.io.js";
import contactRoutes from "./routes/contactRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import "./crons/crons.services.js";
app.use(cors());
app.use(express.json());

// All routes;
// todo: add the express validotor to all my apis
app.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        message: "Server up and running",
    });
});

// Auth routes
app.use("/api/auth", authRoutes);

// contact routes
app.use("/api/searchContact", contactRoutes);

// message routes
app.use("/api/messages", messageRoutes);

main().catch((err) => console.log(err));
async function main() {
    const connection = await mongoose.connect(
        configFile?.mongodbConnectionString
    );
    await connection.connection.db
        .collection("users")
        .createIndex({ email: "text" });

    console.log("mongoose connected");
}

server.listen(parseInt(configFile?.PORT), () => {
    console.log(`Port is running on ${parseInt(configFile.PORT)}`);
});
