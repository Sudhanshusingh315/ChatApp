import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        messageType: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);


export const Chat = mongoose.model('chat',chatSchema);