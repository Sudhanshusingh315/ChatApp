import axios from "axios";
import { configEnv } from "../../constants/contants";

// login
export async function userLogin(data) {
    return await axios({
        method: "post",
        url: `${configEnv.BASE_URL}/api/auth/login`,
        data,
    });
}
// signup

// todo: this might not work, ask why?

export async function userSignup(data) {
    return await axios({
        method: "post",
        url: `${configEnv.BASE_URL}/api/auth/signup`,
        data: {
            email,
            password,
        },
    });
}

export async function userProfileSetup(data) {
    return await axios({
        method: "post",
        url: `${configEnv.BASE_URL}/api/auth/profileSetup`,
        data: data,
    });
}
