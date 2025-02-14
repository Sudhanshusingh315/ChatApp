import { Types } from "mongoose";
import { Chat } from "../models/chatModel.js";
import {
    getAllMessagesGroup,
    getAllMessagesOneOnOne,
    updateMessagesOneOneOneFilter,
} from "../aggregation/aggregation.pipeline.js";
import { chatTypes } from "../constants.config.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

// get the messages
// post and save the messages
// todo: update the messages
// todo: reaction to the particular message

// todo: implement pagination on this
// tood: add validatoin to all the apis

export const getAllMessages = async (req, res) => {
    console.log("getAllMessages being called");
    try {
        // todo: one optimization that i can do here is to add another additional fiter to the updateter function and will only update less documents.

        let { senderId, recipientId } = req.params;
        if (!senderId || !recipientId) {
            throw new Error("No sender and recipient was found");
        } else {
            await Chat.updateMany(
                {
                    ...updateMessagesOneOneOneFilter(senderId, recipientId),
                },
                {
                    $set: {
                        isSeen: true,
                    },
                }
            );
            const getMessages = await Chat.aggregate(
                getAllMessagesOneOnOne(senderId, recipientId)
            );

            if (getMessages) {
                return res.status(200).json({
                    success: true,
                    data: getMessages,
                });
            }
        }
    } catch (err) {
        console.log("err", { err });
        return res.status(404).json({
            success: false,
            error: { err },
            message: "No messages were found",
        });
    }
};

export const saveMessages = async (req, res) => {
    try {
        console.log("hitting the api");
        const { senderId, recipientId } = req.params;
        const { message, messageType, createdAt, updatedAt } = req.body;

        if (!senderId || !recipientId || !message) {
            throw new Error("Messages can't be saved, something happened");
        } else {
            let saveMessage;

            // todo: switch statement for implementing different messages

            saveMessage = await Chat.create({
                senderId: Types.ObjectId.createFromHexString(senderId),
                recipientId: Types.ObjectId.createFromHexString(recipientId),
                messageType,
                message: message,
                ...(createdAt && { createdAt }),
                ...(updatedAt && { updatedAt }),
            });
            console.log("savedMessage", saveMessage);
            if (saveMessages) {
                return res.status(201).json({
                    success: true,
                    data: {
                        senderId,
                        recipientId,
                        message: "Message saved successfully",
                    },
                });
            } else {
                throw new Error("Unbale to save messages at the moment");
            }
        }
    } catch (err) {
        console.log("err", err);
        return res.status(406).json({
            success: false,
            error: err,
        });
    }
};

export const saveMessagesWithSocketIo = async (messageData) => {
    try {
        const {
            message,
            messageType,
            createdAt,
            updatedAt,
            senderId,
            recipientId,
            isGroup,
            groupName,
            groupParticipantIds,
            chatType,
            roomId,
            imageWithText,
            pdfWithText,
            contactAsAMessage,
        } = messageData;

        let saveMessage;

        // todo: switch statement for implementing different messages
        switch (chatType) {
            case chatTypes.OneOnOne:
                saveMessage = await Chat.create({
                    senderId: Types.ObjectId.createFromHexString(senderId),
                    recipientId:
                        Types.ObjectId.createFromHexString(recipientId),
                    messageType,
                    ...(message && { message }),
                    ...(createdAt && { createdAt }),
                    ...(updatedAt && { updatedAt }),
                    ...(imageWithText && { imageWithText }),
                    ...(pdfWithText && { pdfWithText }),
                    ...(contactAsAMessage && { contactAsAMessage }),
                });

                break;
            case chatTypes.groupChat:
                saveMessage = await Chat.create({
                    ...(senderId && { senderId }),
                    ...(messageType && { messageType }),
                    ...(message && { message }),
                    ...(isGroup && { isGroup }),
                    ...(groupName && { groupName }),
                    ...(groupParticipantIds && {
                        groupRecipientIds: groupParticipantIds,
                    }),
                    ...(roomId && { roomId }),
                    ...(pdfWithText && { pdfWithText }),
                    ...(imageWithText && { imageWithText }),
                });

            default:
                break;
        }
        if (saveMessages) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const getAllGroupMessages = async (req, res) => {
    try {
        console.log("group messages api");
        const { roomId } = req.params;

        if (!roomId) {
            throw new Error("No room id was found");
        }
        console.log("group room id is ", roomId);
        const getMessages = await Chat.aggregate(getAllMessagesGroup(roomId));

        if (getMessages) {
            return res.status(200).json({
                success: true,
                data: getMessages,
            });
        }
    } catch (err) {
        console.log("err", { err });
        return res.status(404).json({
            success: false,
            error: err.message,
            message: "No messages were found",
        });
    }
};

export const lastActive = async ({ userId, lastActive }) => {
    try {
        if (userId) {
            console.log("userId of the disconnected is", userId);
            const id = new mongoose.Types.ObjectId(userId);
            console.log("new Id is", id);
            console.log(`blob ${id} lastactive ${lastActive}`);
            const user = await User.updateOne(
                {
                    _id: id,
                },
                {
                    lastSeen: lastActive,
                }
            );

            console.log(user);
        }
    } catch (err) {
        console.log("err", err);
    }
};
