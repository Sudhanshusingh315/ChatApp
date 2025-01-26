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


// signup

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
