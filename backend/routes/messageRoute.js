import { Router } from "express";
import {
    getAllGroupMessages,
    getAllMessages,
    saveMessages,
} from "../controllers/messagesController.js";
import { createGroup } from "../controllers/groupController.js";
import protectedMiddleware from "../middlewares/protected.js";

const messageRoutes = Router();

messageRoutes.get("/:senderId/:recipientId", getAllMessages);

messageRoutes.post(
    "/save/messagesBetween/:senderId/:recipientId",
    saveMessages
);

messageRoutes.post("/:adminId/createGroup", createGroup);

messageRoutes.get(
    "/:roomId/group/getGroupMessages",
    protectedMiddleware,
    getAllGroupMessages
);

export default messageRoutes;
