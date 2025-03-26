import { Schema, Types } from "mongoose";
import { Chat } from "../models/chatModel.js";
import {
    getAllMediaAggreationPipeline,
    getAllMessagesGroup,
    getAllMessagesOneOnOne,
    getGroupInfoPipeline,
    updateMessagesOneOneOneFilter,
} from "../aggregation/aggregation.pipeline.js";
import { chatTypes } from "../constants.config.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import { ScheduledMessage } from "../models/schedule.js";
import { GroupChat } from "../models/groupModel.js";

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

export const deleteMessage = async (chatId, senderId, recipientId) => {
    chatId = new mongoose.Types.ObjectId(chatId);
    let result;
    await Chat.findByIdAndDelete(chatId);
    result = await Chat.aggregate([
        {
            $match: updateMessagesOneOneOneFilter(senderId, recipientId),
        },
    ]);
    return result;
};

export const scheduledMessage = async (req, res) => {
    const {
        message,
        senderId,
        recipientId,
        scheduledAt,
        status,
        created_at,
        messageType,
    } = req.body;

    try {
        const scheduledMessage = await ScheduledMessage.create({
            message,
            senderId,
            recipientId,
            scheduledAt,
            status,
            created_at,
            messageType,
        });
        console.log("req body", req.body);

        if (!scheduledMessage) {
            return res.status(404).json({
                success: false,
                message: "Couldn't save message, try again later!",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: {
                scheduledMessage,
            },
        });
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: err.message,
        });
    }
};

export const getAllMediaBetweenTwoPeople = async (req, res) => {
    const { senderId, recipientId } = req.body;
    try {
        if (!senderId || !recipientId) {
            throw new Error("data in invalid");
        }

        const allMedia = await Chat.aggregate(
            getAllMediaAggreationPipeline(senderId, recipientId)
        );

        return res.status(201).json({
            success: true,
            message: "all media fetched",
            data: allMedia,
        });
    } catch (error) {
        console.log("error", error);

        return res.status(401).json({
            success: false,
            message: "Something happened, try again",
        });
    }
};

export const getGroupDetails = async (req, res) => {
    let { groupId } = req.body;
    try {
        if (!groupId) {
            throw new Error("incorrect group details");
        }
        const groupInfo = await GroupChat.aggregate(
            getGroupInfoPipeline(groupId)
        );
        if (!groupInfo) {
            throw new Error("Something went wrong");
        }
        return res.status(201).json({
            success: true,
            message: "Group info fetched successfully",
            data: groupInfo,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
