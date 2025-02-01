import mongoose, { Types } from "mongoose";
import { chatTypes } from "../constants.config.js";
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
                pipeline:[
                    {
                        $set:{
                            "chatType":chatTypes?.OneOnOne
                        }
                    }
                ],
                as: "contactDetails",
            },
        },
        {
            $lookup:{
                from:"groupchats",
                localField:"groups",
                foreignField:"_id",
                pipeline:[
                    {
                        $set:{
                            "chatType":chatTypes?.groupChat
                        }
                    }
                ],
                as:"myGroups"
            }
        },
        {
            $project: {
                contactDetails: 1,
                myGroups:1,
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
               "roomId": roomIdObjectId 
            },
        },
    ];
};