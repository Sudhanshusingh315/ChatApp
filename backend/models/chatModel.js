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
        },
        messageType: {
            type: String,
            // todo: add support for pdf,images,voice,sticker
            enum: ["text", "imageWithText", "pdfWithText", "contactAsAMessage"],
            default: "text",
        },
        imageWithText: {
            type: Array,
            default: undefined,
        },
        contactAsAMessage: {
            type: Array,
            default: undefined,
        },
        pdfWithText: {
            type: Array,
            default: undefined,
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
        isGroup: {
            type: Boolean,
            default: false,
        },
        groupName: {
            type: String,
        },
        groupRecipientIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                default: undefined,
            },
        ],
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "groupChat",
        },
        isSeen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { currentTime: () => Date.now() },
    }
);

export const Chat = mongoose.model("chat", chatSchema);
