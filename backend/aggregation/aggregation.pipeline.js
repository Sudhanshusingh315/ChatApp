import { Types } from "mongoose";
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
                as: "contactDetails",
            },
        },
        {
            $project: {
                contactDetails: 1,
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
