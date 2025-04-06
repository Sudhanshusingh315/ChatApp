import { Server } from "socket.io";
import express from "express";
import http from "http";
import {
    deleteMessage,
    lastActive,
    saveMessagesWithSocketIo,
} from "./controllers/messagesController.js";
import { AddToMyContacts } from "./controllers/contactController.js";

const app = express();
const server = http.createServer(app);
const userSocketMap = {};

const io = new Server(server, {
    cors: "*",
});

export const getSocketId = (receiverId) => {
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
    // one-on-one chat
    socket.on("sendMessage", async (emittedInfo) => {
        console.log("emittedInfo", emittedInfo);

        const {
            message,
            senderId,
            recipientId,
            messageType,
            createdAt,
            updatedAt,
            chatType,
        } = emittedInfo;

        const contactUpdate = await AddToMyContacts(senderId, recipientId);

        const id = getSocketId(recipientId);
        if (id) {
            io?.to(id)?.emit("recieveMessages", emittedInfo);
        }

        saveMessagesWithSocketIo(emittedInfo);
    });

    // delete messages
    socket.on("deleteMessage", async (data) => {
        if (!data) return;
        let { _id, recipientId, senderId } = data;

        // make the api call for deleting the message,
        // stream the updated list here.
        const result = await deleteMessage(_id, recipientId, senderId);
        const id = getSocketId(recipientId);
        if (id) {
            console.log("sent the data, user is online", result);
            io?.to(id)?.emit("recieveDeleteMessages", result);
        }
    });
    // online users

    socket.on("joinRoom", (roomId) => {
        // create the group here
        console.log("roomId is", roomId);

        socket.join(roomId);

        console.log(`socket id ${socket?.id} joined room`);
    });
    socket.on("sendGroupMessages", (emittedInfo) => {
        const { roomId } = emittedInfo;
        console.log("emittedInfo is ", emittedInfo);
        io.to(roomId).emit("recieveMessages", emittedInfo);
        const value = saveMessagesWithSocketIo(emittedInfo);
        console.log("save message", value);
    });
    socket.on("disconnect", async () => {
        // update last seen
        delete userSocketMap[userId];
        const lastActiveObj = {
            userId,
            lastActive: new Date().getTime(),
        };
        await lastActive(lastActiveObj);

        io.emit("offline", Object.keys(userSocketMap));
    });
});

export { app, io, server };
