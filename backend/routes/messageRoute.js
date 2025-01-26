
import { Router } from "express";
import { getAllMessages, saveMessages } from "../controllers/messagesController.js";


const messageRoutes = Router();


messageRoutes.get("/:senderId/:recipientId",getAllMessages);

messageRoutes.post("/save/messagesBetween/:senderId/:recipientId",saveMessages);
export default messageRoutes; 