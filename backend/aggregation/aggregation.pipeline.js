import mongoose, { Types } from "mongoose";
import { chatTypes, scheduleStatus } from "../constants.config.js";
// search all contacts

export const contactPipeline = (userId) => {
    return [
        {
            $match: {
                _id: Types.ObjectId.createFromHexString(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "contacts",
                foreignField: "_id",
                pipeline: [
                    {
                        $set: {
                            chatType: chatTypes?.OneOnOne,
                        },
                    },
                ],
                as: "contactDetails",
            },
        },
        {
            $lookup: {
                from: "groupchats",
                localField: "groups",
                foreignField: "_id",
                pipeline: [
                    {
                        $set: {
                            chatType: chatTypes?.groupChat,
                        },
                    },
                ],
                as: "myGroups",
            },
        },
        {
            $lookup: {
                from: "chats",
                let: {
                    userId: "$_id",
                    contactId: "$contacts",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: ["$senderId", "$$userId"] },
                                            {
                                                $in: [
                                                    "$recipientId",
                                                    "$$contactId",
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        $and: [
                                            {
                                                $in: [
                                                    "$senderId",
                                                    "$$contactId",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$recipientId",
                                                    "$$userId",
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                    {
                        $group: {
                            _id: {
                                $cond: [
                                    {
                                        $eq: ["$senderId", "$$userId"],
                                    },
                                    "$recipientId",
                                    "$senderId",
                                ],
                            },
                            lastMessage: { $first: "$$ROOT" },
                        },
                    },
                ],
                as: "lastMessage",
            },
        },
        {
            $project: {
                contactDetails: 1,
                myGroups: 1,
                lastMessage: 1,
                _id: 0,
            },
        },
    ];
};

export const getAllMessagesOneOnOne = (ownerId, recieverId) => {
    // pending
    // todo: add pagination on this
    let senderId = Types.ObjectId.createFromHexString(ownerId);
    let recipientId = Types.ObjectId.createFromHexString(recieverId);
    return [
        {
            $match: {
                senderId: { $in: [senderId, recipientId] },
                recipientId: { $in: [senderId, recipientId] },
            },
        },
    ];
};

export const getAllMessagesGroup = (roomId) => {
    // pending
    // todo: add pagination on this
    let roomIdObjectId = new mongoose.Types.ObjectId(roomId);
    return [
        {
            $match: {
                roomId: roomIdObjectId,
            },
        },
    ];
};

export const updateMessagesOneOneOneFilter = (senderId, recieverId) => {
    senderId = new mongoose.Types.ObjectId(senderId);
    recieverId = new mongoose.Types.ObjectId(recieverId);
    return {
        senderId: { $in: [senderId, recieverId] },
        recipientId: { $in: [senderId, recieverId] },
    };
};

export const getAllPendingScheduledMessages = () => {
    return [
        {
            $match: {
                // scheduledAt: { $lte: new Date().getTime() },
                scheduledAt: { $lte: 1742063400000 },
                status: scheduleStatus.PENDING,
            },
        },
    ];
};

export const getAllMediaAggreationPipeline = (
    senderId,
    recipientId,
    groupId
) => {
    senderId = new mongoose.Types.ObjectId(senderId);
    recipientId = new mongoose.Types.ObjectId(recipientId);

    return [
        {
            $match: {
                ...(senderId && { senderId: { $in: [senderId, recipientId] } }),
                ...(recipientId && {
                    recipientId: {
                        $in: [senderId, recipientId],
                    },
                }),
                ...(groupId && { roomId: groupId }),
                messageType: { $nin: ["text"] },
            },
        },
    ];
};

export const getGroupInfoPipeline = (groupId) => {
    let id = new mongoose.Types.ObjectId(groupId);
    return [
        {
            $match: {
                _id: id,
            },
        },
        // look up the admin
        {
            $lookup: {
                from: "users",
                localField: "admin",
                foreignField: "_id",
                pipeline: [
                    {
                        $set: {
                            id: "$_id",
                        },
                    },
                    {
                        $unset: ["_id", "__v"],
                    },
                ],
                as: "admin",
            },
        },
        {
            $set: {
                admin: { $first: "$admin" },
            },
        },
        // loop up the participants
        {
            $lookup: {
                from: "users",
                localField: "participants",
                foreignField: "_id",
                pipeline: [
                    {
                        $set: {
                            id: "$_id",
                        },
                    },
                    {
                        $unset: ["_id", "__v", "contacts", "groups"],
                    },
                ],
                as: "participants",
            },
        },
        {
            $unset: ["_id", "__v"],
        },
    ];
};

export const getScheduledMessagesBetweenTwoPeople = (senderId, recipientId) => {
    senderId = new mongoose.Types.ObjectId(senderId);
    recipientId = new mongoose.Types.ObjectId(recipientId);

    return [
        {
            $match: {
                senderId,
                recipientId,
                status: { $ne: "sent" },
            },
        },
    ];
};
