import { messageTypes } from "../../constants/contants";
import "./styles.css";
export const ChatBox = ({
    info,
    isOnline,
    selectedChat,
    handleSelectChat,
    whoSentLastMessage,
}) => {
    return (
        <div
            key={info?._id}
            className="chat-inbox "
            onClick={(e) => {
                if (info?._id !== selectedChat?._id || !selectedChat) {
                    console.log(
                        `info ${info?._id} selected chat ${selectedChat?._id}`
                    );
                    handleSelectChat(e, info);
                } else {
                    console.log("initial messages are already loaded");
                }
            }}
        >
            <img
                className="chat-profile"
                src={info?.profileImage}
                alt="profile image"
            />
            {/* todo: replace with firstname and last name */}
            <div className="chat-info">
                <p
                    className="name"
                    status={
                        info?.groupName
                            ? ""
                            : isOnline(info?._id)
                            ? "online"
                            : "offline"
                    }
                >
                    {info?.firstName && info?.lastName
                        ? `${info?.firstName} ${info?.lastName}`
                        : `${info?.groupName}`}
                </p>
                <p className="last-message">
                    {/* todo:last message, either send or recieve here. */}
                    {whoSentLastMessage(info?._id)}
                </p>
            </div>
            <div className="chat-date">
                <p className="chat-data text-accent/80 ">
                    {/* todo: last message, either sent or revieve here */}
                    1/1/1970
                </p>
                <p className="number-of-messages bg-secondary-400">
                    +9
                    {/* {showUnSeenNumberOfMessages(info)} */}
                </p>
            </div>
        </div>
    );
};
