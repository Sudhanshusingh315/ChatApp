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
});

export const User = mongoose.model('user', userSchema);