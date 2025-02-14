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

        /*
        1) does this recipient, is it in my contacts? 
            if not, add them to my contact. 
            don't do anything otherwise.
        */

        const contactUpdate = await AddToMyContacts(senderId, recipientId);

        /*
            //save the message to the db regardless if of the recipient online or not.
            // remove async if error

        // todo: implement this functionality because this is important.
        1) if the user is online  
            i) they have the chat opened -> emit with the socket and no "un-read messages".
            ii) or they don't -> if chat isn't opened then emit the socket and save the data into local storage.
        2) if they are offline we are anyway saving the data, but save it with unread messages.

        */
        // if ther receiver is online only then emit the message; otherwise save it to the database.

        const id = getSocketId(recipientId);
        if (id) {
            io?.to(id)?.emit("recieveMessages", emittedInfo);
        }

        saveMessagesWithSocketIo(emittedInfo);
    });

    // delete messages
    socket.on("deleteMessage", async (data) => {
        if (!data) return;
        let { _id, recipientId,senderId } = data;

        // make the api call for deleting the message,
        // stream the updated list here.
        const result = await deleteMessage(_id,recipientId,senderId);
        const id = getSocketId(recipientId);
        if (id) {
            console.log("sent the data, user is online",result);
            io?.to(id)?.emit("recieveDeleteMessages", result);
        }
    });
    // online users

    socket.on("joinRoom", (roomId) => {
        // create the group here
        console.log("roomId is", roomId);

        socket.join(roomId);

        console.log(`socket id ${socket?.id} joined room`);

        // todo: handle default case here.

        //     console.log(`socket id ${socket?.id} joined the room i.e ${roomId}`);
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
