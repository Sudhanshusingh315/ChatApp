import axios from "axios"

export const createGroup = async(participants,groupName,adminId) =>{
    const data = {
        groupName, // name of the group
        participants, // array of participants,
        adminId
    }
    const createdGroup = await axios({
        url:`/api/messages/${adminId}/createGroup`,
        method:'post',
        data
    });

    return createdGroup?.data;
}