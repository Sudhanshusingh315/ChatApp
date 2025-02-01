import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    },
    userName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    color: {
        type: Number,
        require: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    groups:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"groupChat"
        }
    ],
    lastSeen:{
        type:Number
    }
});

export const User = mongoose.model("user", userSchema);
