import { messageTypes } from "../../constants/contants";
import "./styles.css";
export const ChatBox = ({
    info,
    isOnline,
    selectedChat,
    handleSelectChat,
    whoSentLastMessage,
    userInfo,
    showUnSeenNumberOfMessages,
}) => {
    return (
        <div
            key={info?._id}
            className="chat-inbox "
            onClick={(e) => {
                if (info?._id !== selectedChat?._id || !selectedChat) {
                    handleSelectChat(e, info);
                } else {
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
                            : isOnline(info?._id || info?.userId)
                            ? "online"
                            : "offline"
                    }
                >
                    {info?.firstName && info?.lastName
                        ? `${info?.firstName} ${info?.lastName} ${
                              info?._id === userInfo?.userId ? "(YOU)" : ""
                          } `
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
                <p
                    className={`
                        ${
                            showUnSeenNumberOfMessages(info)
                                ? "number-of-messages"
                                : ""
                        } 
                        `}
                >
                    {showUnSeenNumberOfMessages(info)
                        ? showUnSeenNumberOfMessages(info)
                        : ""}
                </p>
            </div>
        </div>
    );
};
