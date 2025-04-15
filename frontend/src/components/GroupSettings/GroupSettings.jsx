import { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { configEnv } from "../../constants/contants";

export default function GroupSettings({ selectedChat }) {
    console.log("selected chat", selectedChat);
    const { _id } = selectedChat;
    const [groupInfo, setGroupInfo] = useState();
    useEffect(() => {
        if (!_id) return;
        (async () => {
            const {
                data: { data },
            } = await axios({
                url: `${configEnv.BASE_URL}/api/messages/gorupMessageDetails`,
                method: "post",
                data: {
                    groupId: _id,
                },
            });

            console.log("data", data);
            setGroupInfo(...data);
        })();
    }, [_id]);
    console.log("group data", groupInfo);
    return (
        <div className="group-setting-container">
            {/* image */}
            <div className="group-image-container">
                <img
                    src={
                        groupInfo?.profileImage ||
                        "https://images.unsplash.com/photo-1742472194048-13ebb038a5fc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt=""
                />
            </div>
            {/* name */}
            <h1 className="groupName">{groupInfo?.groupName}</h1>
            {/* group participants */}
            <div className="group-participants">
                {groupInfo?.participants?.map(
                    ({ id, firstName, lastName, profileImage }, index) => {
                        return (
                            <div
                                key={index}
                                className="flex justify-start items-center gap-2"
                            >
                                <img
                                    className="w-14 rounded-full aspect-square"
                                    src={profileImage}
                                    alt=""
                                />
                                <p>{firstName + lastName}</p>
                                {id === groupInfo?.admin?.id && (
                                    <p className="admin-badge">admin</p>
                                )}
                            </div>
                        );
                    }
                )}
            </div>
            {/* IMPORTANT: give controls to the admin to kick */}
        </div>
    );
}
