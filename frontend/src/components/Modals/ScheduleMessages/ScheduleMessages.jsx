import { useRef, useState } from "react";
import "./styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PiTimer } from "react-icons/pi";
import { MdScheduleSend } from "react-icons/md";

export default function ScheduleMessages({ open, onClose }) {
    const [scheduledMessage, setScheduledMessage] = useState("");
    const [dateTimeStamp, setDateTimeStamp] = useState(new Date());
    const [formatTime, setFormatTime] = useState("");
    const timeRef = useRef(null);
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
    };
    return (
        open && (
            <div className="schedule-container">
                <div className="schedule-content" onClick={onClose}>
                    <textarea placeholder="Enter your scheduled message here" />
                    <div>
                        <PiTimer
                            onClick={(e) => {
                                handleDateClick(e);
                            }}
                            className="date-pick-icon"
                        />
                        <p>{JSON.stringify(formatTime)}</p>
                        <button className="send-schedule">
                            <MdScheduleSend />
                        </button>
                    </div>
                    <DatePicker
                        className="hidden"
                        ref={timeRef}
                        selected={dateTimeStamp}
                        onChange={(e) => {
                            handleDateClickFormat(e, date);
                        }}
                    />
                </div>
            </div>
        )
    );
}
