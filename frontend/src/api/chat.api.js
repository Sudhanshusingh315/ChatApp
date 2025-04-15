import axios from "axios";
import { configEnv } from "../constants/contants";

export const createGroup = async (
    participants,
    groupName,
    groupImage,
    groupAboutSection,
    adminId
) => {
    const data = {
        groupName, // name of the group
        groupAboutSection,
        participants, // array of participants,
        adminId,
        groupImage,
    };
    console.log("group data", data);

    const createdGroup = await axios({
        url: `${configEnv.BASE_URL}/api/messages/${adminId}/createGroup`,
        method: "post",
        data,
    });

    return createdGroup?.data;
};

export const sendScheduledAt = async (data) => {
    const result = await axios({
        url: `${configEnv.BASE_URL}/api/messages/scheduled-message`,
        method: "post",
        data,
    });
    console.log("scheduled message", result);
};
