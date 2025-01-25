import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: "*",
});

const userSocketMap = {};
io.on("connection", (socket) => {
    const userId = socket?.handshake?.query?.userId;
    console.log("user connected with ", socket.id);

    // when ever somone is online
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(userSocketMap);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
