import { Server } from "socket.io";
import express from "express";
import http from "http";
import { saveMessagesWithSocketIo } from "./controllers/messagesController.js";

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
    socket.on("sendMessage",(emittedInfo) => {

        const { message, senderId, recipientId, messageType,createdAt,updatedAt } = emittedInfo;

        const id = getSocketId(recipientId)
        //save the message to the db regardless if of the recipient online or not.
        // remove async if error

        /*
        // todo: implement this functionality because this is important.
        1) if the user is online  
            i) they have the chat opened -> emit with the socket and no "un-read messages".
            ii) or they don't -> if chat isn't opened then emit the socket and save the data into local storage.
        2) if they are offline we are anyway saving the data, but save it with unread messages.

        */

        // if ther receiver is online only then emit the message; otherwise save it to the database.
        if(id){
            io?.to(id)?.emit("recieveMessages",emittedInfo);
            
            // if the user is online means the socket is emitting 
        }
        else{

        }
        saveMessagesWithSocketIo(emittedInfo)

    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
