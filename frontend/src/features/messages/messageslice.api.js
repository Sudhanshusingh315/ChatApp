import axios from "axios";
import { configEnv } from "../../constants/contants";

// get Initial messages
export async function getInitMessagesThunk({ senderId, recipientId, token }) {
    return await axios({
        method: "get",
        url: `${configEnv.BASE_URL}/api/messages/${senderId}/${recipientId}`,
        headers: { Authorization: `Bearer ${token}` },
    });
}

// get Initial messages group
export async function getInitMessagesGroupThunk({ roomId, token }) {
    console.log(
        `getInitMessagesGroupThunk has roomid ${roomId} and token ${token}`
    );
    return await axios({
        method: "get",
        url: `${configEnv.BASE_URL}/api/messages/${roomId}/group/getGroupMessages`,
        headers: { Authorization: `Bearer ${token}` },
    });
}

// export async function userSignup(data) {
//     return await axios({
//         method: "post",
//         url: "/api/auth/signup",
//         data: {
//             email,
//             password,
//         },
//     });
// }
