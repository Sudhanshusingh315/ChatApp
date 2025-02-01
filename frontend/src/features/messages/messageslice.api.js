import axios from "axios";

// get Initial messages 
export async function getInitMessagesThunk({senderId,recipientId,token}) {
    return await axios({
        method: "get",
        url: `/api/messages/${senderId}/${recipientId}`,
        headers:{"Authorization":`Bearer ${token}`}
    },
);
}


// get Initial messages group
export async function getInitMessagesGroupThunk({roomId,token}) {
    console.log(`getInitMessagesGroupThunk has roomid ${roomId} and token ${token}`)
    return await axios({
        method: "get",
        url: `/api/messages/${roomId}/group/getGroupMessages`,
        headers:{"Authorization":`Bearer ${token}`}
    },
);
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
