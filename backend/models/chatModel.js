import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        messageType: {
            type: String,
            // todo: add support for pdf,images,voice,sticker
            enum: ["text", "imageWithText"],
            default: "text",
        },
        imageWithText: {
            type: Array,
        },
        message: {
            type: String,
        },
        // todo: implement this, would be a fun one
        // todo: handle with enums
        reaction: {
            type: String,
        },
        createdAt: {
            type: Number,
            default: new Date().getTime(),
        },
        updatedAt: {
            type: Number,
            default: new Date().getTime(),
        },
    }
    // ,
    // {
    //     timestamps: { currentTime: () => Date.now() },
    // }
);

export const Chat = mongoose.model("chat", chatSchema);
