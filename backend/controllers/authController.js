import mongoose from "mongoose";
import { responseStatus } from "../constants.config.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/token.js";

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`email ${email} password ${password}`);
        if (!email || !password) {
            throw new Error("Email or Password");
        }
        const user = await User.create({ email, password });
        const token = generateToken({ email, password });

        return res.status(201).json({
            status: "success",
            userId: user.id,
            email,
            token: token,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            error: { err },
        });
    }
};

export const login = async (req, res) => {
    // todo: handle the validation of these parameters.
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate("groups");
        // todo: check if password is correct with bcrypt
        if (user) {
            const token = generateToken({ email });
            return res.status(201).json({
                status: responseStatus.SUCCESS,
                userId: user?.id,
                token,
                email,
                profileSetup: user?.profileSetup,
                profileImage: user?.profileImage,
                firstName: user?.firstName,
                lastName: user?.lastName,
                groups: user?.groups,
                lastSeen: user?.lastSeen,
            });
        } else {
            return res.status(401).json({
                status: responseStatus.FAIL,
                message: "User does not exists",
                email,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            status: responseStatus.FAIL,
            error: err,
        });
    }
};

export const profileSetup = async (req, res) => {
    console.log("hitting profile setup really well!");
    let { userId, firstName, lastName, profileImage } = req.body;

    // todo: validate this
    userId = new mongoose.Types.ObjectId(userId);
    try {
        let user = await User.findByIdAndUpdate(
            { _id: userId },
            {
                firstName: firstName,
                lastName: lastName,
                profileSetup: true,
                profileImage: profileImage,
            },
            {
                new: true,
            }
        );
        console.log("user", user);
        return res.status(201).json({
            success: true,
            update: user,
        });
    } catch (error) {
        console.log("Errors", error);
        return res.status(304).json({
            success: false,
            message: "something bad happened!!",
            error: error.message,
        });
    }
};
