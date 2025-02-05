import { useContext, useEffect, useRef, useState } from "react";
import "./chat.css";
import { CiDark, CiShop } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
// todo: refactor the code, and break this into small components.
import { SocketContext } from "../../context/SocketContex";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    clearMessage,
    getInitMessages,
    getInitMessagesGroup,
} from "../../features/messages/messageSlice";
import { createGroup } from "../../api/chat.api";
import { chatTypes, messageTypes } from "../../constants/contants";
import { storage } from "../../utils/firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChatBox } from "../../components/Chatbox/Chatbox";
import { Chatcontainer } from "../../components/Chatcontainer/Chatcontainer";
import ChatBoxSkeleton from "../../components/Skeletons/ChatboxSkeletons/ChatBoxSkeleton";
import ChatcontainerSkeleton from "../../components/Skeletons/ChatcontainerSkeletons/ChatcontainerSkeleton";
export default function Chat() {
    const { socket } = useContext(SocketContext);
    const { userInfo } = useSelector((state) => state.auth);
    const { initMessages, isChatLoading } = useSelector(
        (state) => state.message
    );
    const [chatBox, setChatBox] = useState([]);
    const [lastMessageInChatBox, setLastMessageInChatBox] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageBox, setMessageBox] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [groupCreationWindow, setGroupCreationWindow] = useState(false);
    const [groupCreation, setGroupCreation] = useState([]);
    const [groupCreationModalControl, setGroupCreationModalControl] =
        useState(false);
    // todo multiple files later
    const [fileImages, setFileImage] = useState("");
    const [groupName, setGroupName] = useState("");
    const [openPopUp, setOpenPopUp] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [openImageWithTextModal, setOpenImageWithTextModal] = useState(false);
    const [messageSeen, setMessageSeen] = useState([]);
    const [isChatBoxLoaded, setIsChatBoxLoaded] = useState(true);
    const dispatch = useDispatch();
    const imageRef = useRef(null);
    // socket init
    console.log("lastMessage in chat box", lastMessageInChatBox);
    useEffect(() => {
        if (!socket) return;
        if (socket || !socket.connected()) {
            socket.connect();
            socket.on("offline", (offlineUsers) => {
                console.log("offlineusres", offlineUsers);
                setOnlineUsers((prev) =>
                    prev.filter((id) => offlineUsers.includes(id))
                );
            });
            socket.on("recieveMessages", (emittedInfo) => {
                if (selectedChat?._id !== emittedInfo?.senderId) {
                    // setMessageSeen for the unseen message notification on the right side of the chat ui
                    setMessageSeen((prev) => {
                        const userIndex = prev.findIndex(
                            (item) => item?.senderId === emittedInfo?.senderId
                        );

                        if (userIndex !== -1) {
                            return prev.map((item, index) => {
                                return index === userIndex
                                    ? {
                                          ...item,
                                          unSeenMessage: item.unSeenMessage + 1,
                                      }
                                    : item;
                            });
                        } else {
                            return [
                                ...prev,
                                {
                                    senderId: emittedInfo?.senderId,
                                    unSeenMessage: 1,
                                },
                            ];
                        }
                    });
                }
                setMessages((prev) => {
                    return [...prev, emittedInfo];
                });
            });

            socket.on("getOnlineUsers", (onlineUsers) => {
                console.log("online users are", onlineUsers);
                setOnlineUsers([...new Set(onlineUsers)]);
            });
        }
        return () => {
            if (socket) {
                socket?.disconnect();
                socket.off("offline");
                socket.off("recieveMessages");
                socket.off("getOnlineUsers");
            }
        };
    }, [socket]);
    // todo: put the get contact somewhere else.
    useEffect(() => {
        setIsChatBoxLoaded(true);
        (async function () {
            const { data } = await axios.get(
                `/api/searchContact/${userInfo?.userId}/myContact`,
                {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                }
            );
            setIsChatBoxLoaded(false);
            console.log("data from groups", data);
            setChatBox((prev) => {
                return [
                    ...data?.data[0]?.contactDetails,
                    ...data?.data[0]?.myGroups,
                ];
            });
            setLastMessageInChatBox((prev) => {
                return [...data?.data[0].lastMessage];
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
        // e.stopPropagation();
        setSelectedChat(info);
        const chatType = info?.chatType;

        let initMessages = {};
        switch (chatType) {
            case chatTypes?.OneOnOne:
                if (info?._id !== selectedChat?._id || !selectedChat) {
                    dispatch(clearMessage());
                    setMessages([]);
                    initMessages = {
                        senderId: userInfo?.userId,
                        recipientId: info?._id,
                        token: userInfo?.token,
                    };
                    await dispatch(getInitMessages(initMessages));
                }
                break;
            case chatTypes?.groupChat:
                if (!selectedChat || info?._id !== selectedChat?._id) {
                    dispatch(clearMessage());
                    setMessages([]);
                    initMessages = {
                        roomId: info?._id,
                        token: userInfo?.token,
                    };
                    await dispatch(getInitMessagesGroup(initMessages));
                }
                break;
            default:
                break;
        }

        // handle with switch case.

        // get all past message
    };
    // send the message
    console.log("messages", messages);
    const sendMessage = (message) => {
        if (!message) return;

        // this will only run for images.
        let messageType, imageWithTextdata;
        if (message?.image) {
            messageType = messageTypes.IMAGEWITHTEXT;
            imageWithTextdata = message;
            message = null;
        }
        // decide on the basics of chat application.
        const chatType = selectedChat?.chatType;
        let emitInfo = null;
        switch (chatType) {
            case chatTypes.OneOnOne:
                emitInfo = {
                    ...(message && { message }),
                    ...(messageType
                        ? { messageType }
                        : { messageType: "text" }),
                    ...(imageWithTextdata && {
                        imageWithText: imageWithTextdata,
                    }),
                    senderId: userInfo?.userId,
                    recipientId: selectedChat?._id,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime(),
                    chatType: chatTypes.OneOnOne,
                };
                console.log("emitInfo when image included", emitInfo);
                socket?.emit("sendMessage", emitInfo);

                setMessages((prev) => {
                    return [...prev, emitInfo];
                });

                // add this message to your message box now
                break;
            case chatTypes.groupChat:
                emitInfo = {
                    roomId: selectedChat?._id,
                    ...(message && { message }),
                    ...(messageType && { messageType }),
                    ...(imageWithTextdata && { imageWithTextdata }),
                    senderId: userInfo?.userId,
                    chatType: chatTypes.groupChat,
                    isGroup: true,
                    groupName: selectedChat?.groupName,
                    groupParticipantIds: selectedChat?.participants,
                };
                socket.emit("sendGroupMessages", emitInfo);

                setMessages((prev) => {
                    return [...prev, emitInfo];
                });
                break;
            default:
                break;
        }
        setMessageBox("");
    };
    const handleGroupCreation = () => {
        console.log("group");
        setGroupCreationWindow((prev) => !prev);
        setGroupCreation([]);
    };
    const handleGroupParticipants = (info, index) => {
        console.log("info is", info);

        setGroupCreation((prev) => {
            if (
                groupCreation?.find(
                    (element) => element?.firstName === info?.firstName
                )
            ) {
                console.log("found it");
                return [...prev];
            } else {
                console.log("didn't find it");
                return [...prev, info];
            }
        });
    };

    const handleFormAGroup = async () => {
        const result = await createGroup(
            groupCreation,
            groupName,
            userInfo?.userId
        );
        setGroupName("");
        console.log("result ", result);
    };

    const handleCloseImageWithTextModal = () => {
        setOpenImageWithTextModal(false);
        setFileImage("");
    };

    const handleOpenImageWithTextModal = () => {
        setOpenImageWithTextModal(true);
    };
    const handleClick = (e) => {
        // e.stopPropagation();
        console.log("handleClick was called");
        if (imageRef?.current) {
            imageRef.current.value = "";
            console.log("clicked now and i have ref");
            imageRef.current.click();
        }
    };
    const handleFileChange = (e) => {
        // e.stopPropagation();
        if (!e.target?.files) return;
        const file = e.target?.files[0];
        setOpenPopUp(false);
        console.log("fileImage", file);
        const storageRef = ref(storage, `images/${file.name}`);
        console.log("storage ref is ", storageRef);

        uploadFileToFireBase(storageRef, file);
        handleOpenImageWithTextModal();
    };

    const renderMessage = (messageType, message, imageWithText) => {
        switch (messageType) {
            case messageTypes.TEXT:
                return message;
                break;

            case messageTypes.IMAGE:
                break;

            case messageTypes.PDF:
                break;
            case messageTypes.IMAGEWITHTEXT:
                return (
                    <>
                        <img
                            className="message-image"
                            src={imageWithText[0]?.image}
                            alt=""
                        />
                        <p className="text-image">{imageWithText[0]?.text}</p>
                    </>
                );
                break;

            case messageTypes.PDFWITHTEXT:
                break;

            default:
                return "Message more correctly setup";
                break;
        }
    };

    const isOnline = (id) => {
        return onlineUsers?.includes(id);
    };

    const uploadFileToFireBase = (storageRef, file) => {
        console.log("uploading file to fireBase");
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                console.log("bytesTransferred", snapshot.bytesTransferred);
                console.log("totlaBytes", snapshot.totalBytes);
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;
                    case "storage/canceled":
                        // User canceled the upload
                        break;

                    // ...

                    case "storage/unknown":
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            async () => {
                // Upload completed successfully, now we can get the download URL
                const fileImageFireBase = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                setFileImage(fileImageFireBase);
            }
        );
    };

    const getLastSeenMessage = (lastSeenTimestamp) => {
        const lastSeen = new Date(lastSeenTimestamp);
        const now = new Date();
        const diffMs = now - lastSeen;
        const diffMinutes = diffMs / (1000 * 60);
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        // Format time in AM/PM
        const formatTime = (date) => {
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
        };

        if (diffMinutes < 5) {
            return "Last seen recently";
        } else if (diffHours < 1) {
            return `Last seen at ${formatTime(lastSeen)}`;
        } else if (diffHours < 24) {
            return `Last seen yesterday at ${formatTime(lastSeen)}`;
        } else if (diffHours < 48) {
            return `Last seen yesterday at ${formatTime(lastSeen)}`;
        } else {
            return `Last seen on ${lastSeen.toDateString()}`; // Example: "Last seen on Fri Feb 02 2025"
        }
    };

    // todo: reuse this in it's own component
    const showUnSeenNumberOfMessages = (info) => {
        const indexOfUser = messageSeen?.findIndex(
            (sender) => sender?.senderId === info?._id
        );
        console.log("indexOfusers", indexOfUser);
        if (indexOfUser === -1) {
            return;
        } else {
            const value = messageSeen[indexOfUser]?.unSeenMessage;
            console.log(`number of messages are ${value}`);

            return value > 9 ? "+9" : value;
        }
    };
    function whoSentLastMessage(chatBoxUserId) {
        // console.log("chatBoxid is",chatBoxUserId);
        if (lastMessageInChatBox) {
            const found = lastMessageInChatBox.find((element) => {
                return element?._id === chatBoxUserId;
            });
            console.log("found", chatBoxUserId);
            if (found) {
                const { messageType, message, imageWithText } =
                    found?.lastMessage;

                switch (messageType) {
                    case messageTypes.TEXT:
                        return message;
                        break;
                    case messageTypes.IMAGEWITHTEXT:
                        return "Image with text";
                    default:
                        break;
                }
            }
        } else {
            console.log(
                "skipping becuase no last seen message array was found"
            );
        }
    }
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
                        <p className="settings" onClick={handleGroupCreation}>
                            <CiChat1 />
                        </p>
                    </div>
                    <div className="chat-search">
                        {/* todo : add the search icon and make that respnosive as well */}
                        {/* todo : add the focu:visible class */}
                        <input
                            type="text"
                            className="bg-secondary-400/85 hover:outline-primary hover:outline-4 hover:outline-double"
                            placeholder="search contacts globally"
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

                    {isChatBoxLoaded ? (
                        <ChatBoxSkeleton />
                    ) : (
                        chatBox?.map((info, index) => {
                            return (
                                <ChatBox
                                    key={index}
                                    info={info}
                                    selectedChat={selectedChat}
                                    isOnline={isOnline}
                                    handleSelectChat={handleSelectChat}
                                    lastMessageInChatBox={lastMessageInChatBox}
                                    whoSentLastMessage={whoSentLastMessage}
                                />
                            );
                        })
                    )}

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
                {/* group section */}
                <div
                    className="group-creation bg-primary-bg"
                    style={
                        groupCreationWindow
                            ? { transform: "translateX(0%)" }
                            : {}
                    }
                >
                    <p onClick={handleGroupCreation}>
                        <CiCirclePlus />
                    </p>
                    {/* search globaly throught the database */}
                    <div className="select-box">
                        {groupCreation.length >= 1 &&
                            groupCreation?.map((selectedContact, index) => {
                                // todo: the box you have selected, click on these again to remove them from the contact.
                                return (
                                    <div key={index}>
                                        {selectedContact?.firstName}
                                    </div>
                                );
                            })}
                        <input placeholder="search for people" type="text" />
                        <input
                            placeholder="Group name"
                            type="text"
                            onChange={(e) => {
                                setGroupName(e.target.value);
                            }}
                            value={groupName}
                        />
                        {/* todo: later this would become a modal, IMPORTANT */}
                        <button
                            onClick={() => {
                                handleFormAGroup();
                            }}
                            className="px-4 py-2 bg-pink-800 rounded-full "
                        >
                            Create group
                        </button>
                    </div>
                    {/* todo: create the modal for group creation */}
                    {/* <CreateGroupModal open={groupCreationModalControl} /> */}
                    {/* search or select through just your contacts */}
                    <div>
                        {chatBox?.map((contact, index) => {
                            return (
                                <div
                                    key={index}
                                    className="contact-select"
                                    onClick={() => {
                                        handleGroupParticipants(contact, index);
                                    }}
                                >
                                    {contact?.firstName}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* chat conponent */}
            {selectedChat ? (
                <Chatcontainer
                    setOpenPopUp={setOpenPopUp}
                    selectedChat={selectedChat}
                    isOnline={isOnline}
                    getLastSeenMessage={getLastSeenMessage}
                    messages={messages}
                    userInfo={userInfo}
                    renderMessage={renderMessage}
                    handleFileChange={handleFileChange}
                    handleClick={handleClick}
                    messageBox={messageBox}
                    setMessageBox={setMessageBox}
                    sendMessage={sendMessage}
                    fileImages={fileImages}
                    handleCloseImageWithTextModal={
                        handleCloseImageWithTextModal
                    }
                    ref={imageRef}
                    openImageWithTextModal={openImageWithTextModal}
                    openPopUp={openPopUp}
                    isChatLoading={isChatLoading}
                />
            ) : (
                <div className="text-accent">
                    {/* todo: pressing escap make the component switch to default selectesate that is null */}
                    Mean while tab until i code this
                </div>
            )}
        </div>
    );
}
