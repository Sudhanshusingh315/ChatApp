import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const userSocketMap = {};

const io = new Server(server, {
    cors: "*",
});

const getSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    const userId = socket?.handshake?.query?.userId;
    console.log("user connected with ", socket.id);

    // when ever somone is online
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(userSocketMap);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // listening for messages;
    socket.on("sendMessage", (emittedInfo) => {

        const { message, senderId, recipientId } = emittedInfo;

        console.log(`recipientId ${recipientId} senderId is ${senderId}`)
        


        const id = getSocketId(recipientId)

        // if ther receiver is online only then emit the message; otherwise save it to the database.
        if(id){
            io?.to(id)?.emit("recieveMessages",emittedInfo);
            
        }

    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
