import axios from "axios";

// login
export async function userLogin(data) {
    return await axios({
        method: "post",
        url: "/api/auth/login",
        data,
    });
}
// signup

export async function userSignup(data) {
    return await axios({
        method: "post",
        url: "/api/auth/signup",
        data: {
            email,
            password,
        },
    });
}
