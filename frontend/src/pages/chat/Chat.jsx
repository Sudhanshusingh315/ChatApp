import { useContext, useEffect, useRef, useState } from "react";
import "./chat.css";
import { CiDark, CiShop } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosAttach } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { IoSendSharp } from "react-icons/io5";
// todo: refactor the code, and break this into small components.
import { SocketContext } from "../../context/SocketContex";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import reducer, {
    clearMessage,
    getInitMessages,
    getInitMessagesGroup,
} from "../../features/messages/messageSlice";
import CreateGroupModal from "../../components/Modals/groupModal/CreateGroupModal";
import { createGroup } from "../../api/chat.api";
import { chatTypes, messageTypes } from "../../constants/contants";
import { storage } from "../../utils/firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ImageWithText from "../../components/Modals/ImageWithText/ImageWithText";
export default function Chat() {
    const { socket } = useContext(SocketContext);
    const { userInfo } = useSelector((state) => state.auth);
    const { initMessages } = useSelector((state) => state.message);
    const [chatBox, setChatBox] = useState([]);
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
    const dispatch = useDispatch();
    const imageRef = useRef(null);
    // socket init
    console.log("messages", messages);
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
        (async function () {
            const { data } = await axios.get(
                `/api/searchContact/${userInfo?.userId}/myContact`,
                {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                }
            );
            console.log("data from groups", data);
            setChatBox((prev) => {
                return [
                    ...data?.data[0]?.contactDetails,
                    ...data?.data[0]?.myGroups,
                ];
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
    console.log("initMessages", initMessages);
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
    const sendMessage = (message) => {
        if (!message) return;
        // this will only run for images.
        let messageType,imageWithTextdata;
        if (message?.image) {
            messageType = messageTypes.IMAGEWITHTEXT;
            imageWithTextdata = message
            message = null;
        }
        // decide on the basics of chat application.
        const chatType = selectedChat?.chatType;
        let emitInfo = null;
        switch (chatType) {
            case chatTypes.OneOnOne:
                emitInfo = {
                    message,
                    ...(messageType && { messageType }),
                    ...(imageWithTextdata && {imageWithText:imageWithTextdata}),
                    senderId: userInfo?.userId,
                    recipientId: selectedChat?._id,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime(),
                    chatType: chatTypes.OneOnOne,
                };
                console.log("emitInfo when image included",emitInfo)
                socket?.emit("sendMessage", emitInfo);

                setMessages((prev) => {
                    return [...prev, emitInfo];
                });

                // add this message to your message box now
                break;
            case chatTypes.groupChat:
                emitInfo = {
                    roomId: selectedChat?._id,
                    message,
                    senderId: userInfo?.userId,
                    chatType: chatTypes.groupChat,
                    isGroup: true,
                    groupName: selectedChat?.groupName,
                    groupParticipantIds: selectedChat?.participants,
                };
                if (socket) {
                    socket.emit("sendGroupMessages", emitInfo);
                } else {
                    console.log("don't have socket");
                }

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
    console.log("fileImage", fileImages);
    const renderMessage = (messageType) => {
        switch (messageType) {
            case messageTypes.TEXT:
                break;

            case messageTypes.IMAGE:
                break;

            case messageTypes.PDF:
                break;
            case messageTypes.IMAGEWITHTEXT:
                break;

            case messageTypes.PDFWITHTEXT:
                break;

            default:
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
                    {chatBox?.map((info, index) => {
                        return (
                            <div
                                key={info?._id}
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
            {/* todo: break this into two components */}
            {selectedChat ? (
                <div
                    className="chat-container"
                    onClick={(e) => {
                        // e.stopPropagation();
                        console.log("i'm being clicked");
                        setOpenPopUp(false);
                    }}
                >
                    {/* header */}
                    <div className="chat-header-section text-accent bg-primary/10">
                        <img src={selectedChat?.profileImage} alt="" />
                        <div className="user-info">
                            <p className="chat-selected-user">
                                {selectedChat?.participants
                                    ? `${selectedChat?.groupName}`
                                    : `${selectedChat?.firstName} ${selectedChat?.lastName}`}
                            </p>
                            <span className="last-seen">
                                {selectedChat?.participants
                                    ? ""
                                    : isOnline(selectedChat?._id)
                                    ? "Online"
                                    : getLastSeenMessage(
                                          selectedChat?.lastSeen
                                      )}
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
                                        {/* call the renderMessage function here */}
                                        {message}
                                    </div>
                                );
                            }
                        )}

                        {/* todo: keep this for later */}
                        <div className="owner bg-secondary-400">
                            <img
                                className="message-image"
                                src="https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk="
                                alt=""
                            />
                            <p className="text-image">
                                Meowjdfkjsflkdsajfdsafalkdjfalkdsfjfdlkjsafkdsbv;jand;lkajf;kdajflkdafhdakjbva;jfdlkajfk
                            </p>
                        </div>
                    </div>

                    {/* message box input */}
                    <div className="send-chat-configuration bg-secondary-400">
                        <input
                            ref={imageRef}
                            type="file"
                            className="photo-video"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button
                            className="attachments"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenPopUp((prev) => !prev);
                            }}
                        >
                            <IoIosAttach />
                        </button>
                        {openPopUp && (
                            <div
                                className="attachment-popup"
                                id="attachment-popup"
                            >
                                <p
                                    className="li-media"
                                    mediatype="photo"
                                    onClick={(e) => {
                                        handleClick(e);
                                    }}
                                >
                                    Photos and Videos
                                </p>

                                <p className="li-pdf" mediatype="document">
                                    Documents
                                </p>
                                <p className="li-contact" mediatype="contact">
                                    Contact
                                </p>
                            </div>
                        )}
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

                    {/* modal for sending images with text */}

                    <ImageWithText
                        open={openImageWithTextModal}
                        image={fileImages}
                        onClose={handleCloseImageWithTextModal}
                        sendMessage={sendMessage}
                    />
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
