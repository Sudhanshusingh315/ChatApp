import mongoose from "mongoose";

const GroupChatSchema = new mongoose.Schema(
    {
        groupName: { type: String, required: true },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // Group members
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        profileImage: {
            type: String,
        },  
        lastMessage: {
            messageId: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
            text: String,
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            timestamp: { type: Number, default: () => new Date().getTime() },
        },
        about: {
            text: String,
        },
    },
    {
        timestamps: {
            currentTime: () => Date.now(),
        },
    }
);

export const GroupChat = mongoose.model("groupChat", GroupChatSchema);
