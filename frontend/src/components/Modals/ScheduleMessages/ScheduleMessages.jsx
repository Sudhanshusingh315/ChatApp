import { useEffect, useRef, useState } from "react";
import "./styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PiTimer } from "react-icons/pi";
import { MdScheduleSend } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { messageTypes, scheduleStatus } from "../../../constants/contants";
import { sendScheduledAt } from "../../../api/chat.api";

export default function ScheduleMessages({
    open,
    onClose,
    selectedChat,
    userInfo,
}) {
    const [scheduledMessage, setScheduledMessage] = useState("");
    const [dateTimeStamp, setDateTimeStamp] = useState(new Date());
    const [formatTime, setFormatTime] = useState("Selete the date from icon");
    const timeRef = useRef(null);

    console.log("scheduledMessage", scheduledMessage);
    const handleDateClick = (e) => {
        e.stopPropagation();
        timeRef.current.onInputClick();
    };
    const handleDateClickFormat = (date) => {
        if (date < new Date()) {
            return setFormatTime("Invalid date, past date");
        }
        setFormatTime(
            new Date(date).toLocaleDateString("en-US", {
                day: "numeric",
                weekend: "long",
                year: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            })
        );
        setDateTimeStamp(date);
    };
    const handleSendScheduleMessage = () => {
        // write it's own api
        // todo: throw an error here.
        if (!scheduledMessage) return;
        const data = {
            message: scheduledMessage,
            scheduledAt: dateTimeStamp.getTime(),
            created_at: new Date().getTime(),
            senderId: userInfo?.userId,
            recipientId: selectedChat?._id,
            messageType: messageTypes.TEXT,
            status: scheduleStatus.PENDING,
        };

        const result = sendScheduledAt(data);

        setDateTimeStamp("");
        setFormatTime("Selete the date from icon");
        onClose();
    };

    const handleCancleSchedule = (e) => {
        e.stopPropagation();
        setDateTimeStamp("");
        setFormatTime("Selete the date from icon");
        onClose();
    };

    return (
        open && (
            <div className="schedule-container">
                <div className="schedule-content">
                    <button className="go-back" onClick={handleCancleSchedule}>
                        <RxCross2 />
                    </button>
                    <textarea
                        placeholder="Enter your scheduled message here"
                        onChange={(e) => {
                            setScheduledMessage(e.target.value);
                        }}
                    />
                    <div>
                        <PiTimer
                            onClick={(e) => {
                                handleDateClick(e);
                            }}
                            className="date-pick-icon"
                        />
                        <p className="picked-date">
                            {JSON.stringify(formatTime)}
                        </p>
                        <button
                            className="send-schedule"
                            style={{
                                cursor:
                                    new Date(dateTimeStamp).getTime() <
                                    new Date().getTime()
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                            onClick={handleSendScheduleMessage}
                        >
                            <MdScheduleSend />
                        </button>
                    </div>
                    <DatePicker
                        showTimeSelect
                        className="hidden"
                        ref={timeRef}
                        selected={dateTimeStamp}
                        onChange={(date) => {
                            handleDateClickFormat(date);
                        }}
                    />
                </div>
            </div>
        )
    );
}
