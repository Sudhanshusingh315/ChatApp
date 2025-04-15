import { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { configEnv } from "../../../constants/contants";
export default function ScheduleMessagesList({
    open,
    onClose,
    userInfo,
    selectedChat,
}) {
    const [allScheduledMessages, setAllScheduledMessages] = useState(null);
    const [refresh, setRefresh] = useState(true);
    console.log();
    useEffect(() => {
        if (userInfo && selectedChat) {
            const data = {
                senderId: userInfo?.userId,
                recipientId: selectedChat?._id,
            };
            getScheduledMessages(data);
        }

        async function getScheduledMessages(data) {
            const response = await axios({
                url: `${configEnv.BASE_URL}/api/messages/get-scheduled-messages`,
                method: "post",
                data,
            });
            console.log("response", response);
            setAllScheduledMessages(response?.data?.data);
        }
    }, [userInfo, selectedChat, refresh]);

    return (
        open && (
            <div className="schedule-messages-list">
                <div className="schedule-messages-content">
                    <div className="schedule-messages-content-title">
                        All Scheduled Messages{" "}
                        <span
                            className="cursor-pointer"
                            onClick={() => {
                                setRefresh(!refresh);
                            }}
                        >
                            refresh
                        </span>
                        <span
                            className="mx-2 aspect-square p-2 cursor-pointer"
                            onClick={() => {
                                console.log("huhu");
                                onClose();
                            }}
                        >
                            x
                        </span>
                    </div>
                    <div className="schedule-content-pending">
                        {allScheduledMessages?.map((element, index) => {
                            return (
                                <div>
                                    <p>{element?.message}</p>
                                    <p>
                                        {new Date(
                                            element?.scheduledAt
                                        ).toLocaleString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    );
}
