import mongoose from "mongoose";

const scheduledMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    scheduledAt: {
        type: Number,
        required: true,
        index: true, // Improves query speed for scheduled messages
    },
    status: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
    },
    created_at: {
        type: Number,
    },
    messageType: {
        type: String,
        default: "text",
    },
});

export const ScheduledMessage = mongoose.model(
    "ScheduledMessage",
    scheduledMessageSchema
);
