import { useContext, useEffect, useRef, useState } from "react";
import "./chat.css";
import { CiDark, CiShop } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosAttach } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
// todo: refactor the code, and break this into small components.
import { SocketContext } from "../../context/SocketContex";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    clearMessage,
    getInitMessages,
} from "../../features/messages/messageSlice";
export default function Chat() {
    const { socket } = useContext(SocketContext);
    const { userInfo } = useSelector((state) => state.auth);
    const { initMessages } = useSelector((state) => state.message);
    const [chatBox, setChatBox] = useState([]);
    const [messageBox, setMessageBox] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();

    // socket init
    useEffect(() => {
        if (socket || !socket?.connected) {
            socket?.connect();
            socket?.on("getOnlineUsers", (users) => {});
            socket?.on("recieveMessages", (message) => {
                setMessages((prev) => {
                    return [...prev, message];
                });
            });
        }

        return () => {
            if (socket) {
                socket.off("getOnlineUsers");
                socket.disconnect();
            }
        };
    }, [socket]);

    // todo: put the get contact somewhere else.
    useEffect(() => {
        (async function () {
            const { data } = await axios.get(
                `/api/searchContact/${userInfo?.userId}/myContact`,
                {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                }
            );
            setChatBox((prev) => {
                return [...data?.data[0]?.contactDetails];
            });
        })();
    }, []);

    useEffect(() => {
        if (initMessages) {
            setMessages((prev) => {
                return [...prev, ...initMessages];
            });
        }
    }, [initMessages]);

    // select the chat
    const handleSelectChat = async (e, info) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedChat(info);
        if (info?._id !== selectedChat?._id || !selectedChat) {
            dispatch(clearMessage());
            setMessages([]);
            const initMessages = {
                senderId: userInfo?.userId,
                recipientId: info?._id,
                token: userInfo?.token,
            };
            await dispatch(getInitMessages(initMessages));
        }
        // get all past message
    };

    // send the message
    const sendMessage = (message) => {
        if (!message) return;
        const emitInfo = {
            message,
            senderId: userInfo?.userId,
            recipientId: selectedChat?._id,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        };
        socket?.emit("sendMessage", emitInfo);

        setMessages((prev) => {
            return [...prev, emitInfo];
        });

        // add this message to your message box now
        setMessageBox("");
    };

    return (
        <div className="chat-wrapper">
            <div className="sidebar">
                <div className="chat-action bg-primary/10">
                    <div className="user-chat--info">
                        <img
                            className="user-profile"
                            src={userInfo?.profileImage}
                            alt="user-profile-image"
                        />
                        <p className="themes">
                            <CiDark />
                        </p>
                        <p className="stories">
                            <CiShop />
                        </p>
                        <p className="settings">
                            <CiSettings />
                        </p>
                    </div>
                    <div className="chat-search">
                        {/* todo : add the search icon and make that respnosive as well */}
                        {/* todo : add the focu:visible class */}
                        <input
                            type="text"
                            className="bg-secondary-400/85 hover:outline-primary hover:outline-4 hover:outline-double"
                            placeholder="search contacts"
                        />
                    </div>
                    <div className="messages-category">
                        <p className="bg-secondary-400/85 text-primary">All</p>
                        <p className="bg-secondary-400/85 text-primary">
                            Unread
                        </p>
                        <p className="bg-secondary-400/85 text-primary">
                            Favorites
                        </p>
                        <p className="bg-secondary-400/85 text-primary">
                            Groups
                        </p>
                    </div>
                </div>
                <div className="chat-inboxes text-accent">
                    {/* todo: needs a shimer effect IMPORTANT */}
                    {chatBox?.map((info, index) => {
                        return (
                            <div
                                key={info?.email}
                                className="chat-inbox "
                                onClick={(e) => {
                                    if (
                                        info?._id !== selectedChat?._id ||
                                        !selectedChat
                                    ) {
                                        console.log(
                                            `info ${info?._id} selected chat ${selectedChat?._id}`
                                        );
                                        handleSelectChat(e, info);
                                    } else {
                                        console.log(
                                            "initial messages are already loaded"
                                        );
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
                                    <p className="name">{`${info?.firstName} ${info?.lastName}`}</p>
                                    <p className="last-message">
                                        {/* todo:last message, either send or recieve here. */}
                                        Happy makar sankaranti kjfalkd
                                    </p>
                                </div>
                                <div className="chat-date">
                                    <p className="chat-data text-accent/80 ">
                                        {/* todo: last message, either sent or revieve here */}
                                        1/1/1970
                                    </p>
                                    <p className="number-of-messages bg-secondary-400">
                                        +9
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* todo: whole component needs a refactor IMPORTANT*/}
                    {/* todo : remove this piece of code */}
                    {/* <div className="chat-inbox">
                        <img
                            className="chat-profile"
                            src="https://i.pravatar.cc/300"
                            alt="profile image"
                        />
                        <div className="chat-info">
                            <p className="name">Santosh kumar</p>
                            <p className="last-message">
                                Happy makar sankaranti
                                kjlkdajfjdlkajflkdajflkjfdsalfjkdfalkd
                            </p>
                        </div>
                        <div className="chat-date">
                            <p className="chat-data text-accent/80 ">
                                1/1/1970
                            </p>
                            <p className="number-of-messages bg-secondary-400">
                                9
                            </p>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* chat conponent */}
            {/* todo: break this into two components */}
            {selectedChat ? (
                <div className="chat-container">
                    {/* header */}
                    <div className="chat-header-section text-accent bg-primary/10">
                        <img src={selectedChat?.profileImage} alt="" />
                        <div className="user-info">
                            <p className="chat-selected-user">{`${selectedChat?.firstName} ${selectedChat?.lastName}`}</p>
                            <span className="last-seen">
                                last Seen Yesterday at 7:20 PM
                            </span>
                        </div>
                        <p className="search-icon">
                            <CiSearch />
                        </p>
                        <p className="kebab-icon">
                            <CiMenuKebab />
                        </p>
                    </div>
                    {/* chat component */}
                    <div className="chat-talking-section text-accent">
                        {messages?.map(
                            ({ recipientId, senderId, message }, index) => {
                                return (
                                    <div
                                        // todo: can we do a better index than this?
                                        key={index}
                                        className={
                                            userInfo?.userId === senderId
                                                ? "owner bg-secondary-400"
                                                : "reciever bg-[#1E1D2B]"
                                        }
                                    >
                                        {message}
                                    </div>
                                );
                            }
                        )}

                        {/* tod0: keep this for later */}
                        {/* <div className="owner bg-secondary-400">
                            <img className="message-image"  src="https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=" alt="" />
                            <p className="text-image">Meowjdfkjsflkdsajfdsafalkdjfalkdsfjfdlkjsafkdsbv;jand;lkajf;kdajflkdafhdakjbva;jfdlkajfk</p>
                       </div> */}
                    </div>
                    {/* message box input */}
                    <div className="send-chat-configuration bg-secondary-400">
                        <p className="attachments">
                            <IoIosAttach />
                        </p>
                        <input
                            value={messageBox}
                            onChange={(e) => {
                                setMessageBox((prev) => e.target.value);
                            }}
                            type="text"
                            placeholder="Type a message here..."
                        />
                        <p
                            className="send-message"
                            onClick={() => {
                                sendMessage(messageBox);
                            }}
                        >
                            <IoSendSharp />
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-accent">
                    {/* todo: pressing escap make the component switch to default selectesate that is null */}
                    Mean while tab until i code this
                </div>
            )}
        </div>
    );
}
