
import { Router } from "express";
import { getAllMessages, saveMessages } from "../controllers/messagesController.js";
import { createGroup } from "../controllers/groupController.js";


const messageRoutes = Router();


messageRoutes.get("/:senderId/:recipientId",getAllMessages);

messageRoutes.post("/save/messagesBetween/:senderId/:recipientId",saveMessages);

messageRoutes.post('/:adminId/createGroup',createGroup);



export default messageRoutes; 