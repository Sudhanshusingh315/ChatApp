import { responseStatus } from "../constants.config.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/token.js";

export const signup = async (req, res) => {
    try {
        // todo: handle if the user is already registered here.
        // todo: hash the password befor storing it in the database.
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Email or Password");
        }
        const user = await User.create({ email, password });
        const token = generateToken({ email, password });
        return req.status(201).json({
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
        const user = await User.findOne({ email });
        // todo: check if password is correct with bcrypt
        if (user) {
            const token = generateToken({email});
            return res.status(201).json({
                status: responseStatus.SUCCESS,
                userId:user?.id,
                token,
                email,
                profileSetup:user?.profileSetup
            })
        }else{
            return res.status(401).json({
                status:responseStatus.FAIL,
                message:"User does not exists",
                email
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            status:responseStatus.FAIL,
            email,
            error:err
        })

    }
};
