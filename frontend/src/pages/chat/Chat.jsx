import { useContext, useEffect, useRef, useState } from "react";
import "./chat.css";
import { CiDark, CiShop } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { BsCheck2, BsCheck2All, BsFillChatTextFill } from "react-icons/bs";
// todo: refactor the code, and break this into small components.
import { SocketContext } from "../../context/SocketContex";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    clearMessage,
    getInitMessages,
    getInitMessagesGroup,
} from "../../features/messages/messageSlice";
import {
    chatTypes,
    configEnv,
    fileFormats,
    messageTypes,
} from "../../constants/contants";
import { storage } from "../../utils/firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChatBox } from "../../components/Chatbox/Chatbox";
import { Chatcontainer } from "../../components/Chatcontainer/Chatcontainer";
import ChatBoxSkeleton from "../../components/Skeletons/ChatboxSkeletons/ChatBoxSkeleton";
import { useDebounce } from "../../hooks/useDebounce";
import { SearchContactAPI } from "../../api/search.api";
import SearchContact from "../../components/SearchContacts/SearchContact";
import DefaultChatContainer from "../../components/DefaultChatContainer/DefaultChatContainer";
import ThemeSection from "../../components/ThemeSection/ThemeSection";
import CreateGroupModal from "../../components/Modals/groupModal/CreateGroupModal";
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
    const [pdfFile, setPdfFile] = useState("");
    const [groupName, setGroupName] = useState("");
    const [openPopUp, setOpenPopUp] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [openImageWithTextModal, setOpenImageWithTextModal] = useState(false);
    const [messageUnSeen, setMessageUnSeen] = useState([]);
    const [messageSeen, setMessageSeen] = useState([]);
    const [isChatBoxLoaded, setIsChatBoxLoaded] = useState(true);
    const [searchContactGlobal, setSearchContactGlobal] = useState("");
    const [globalSearchResults, setGlobalSearchResults] = useState([]);
    const debouncedSearch = useDebounce(searchContactGlobal);
    const [showViewMedia, setShowViewMedia] = useState(false);
    const [showViewMediaContent, setShowViewMediaContent] = useState();
    const dispatch = useDispatch();
    const imageRef = useRef(null);
    const pdfRef = useRef(null);
    const [showThemeSection, setShowThemeSection] = useState(false);
    // socket init
    console.log("all chat", chatBox);
    console.log("online users", onlineUsers);
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
                console.log("recieveMessages", emittedInfo);
                if (selectedChat?._id !== emittedInfo?.senderId) {
                    // setMessageUnSeen for the unseen message notification on the right side of the chat ui

                    setMessageUnSeen((prev) => {
                        const userIndex = prev.findIndex(
                            (item) => item?.senderId === emittedInfo?.senderId
                        );

                        // found the element
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

                // show up the chat box, when an unknown users sends you a message.
                if (emittedInfo?.senderId) {
                    setChatBox((prev) => {
                        const foundContactId = prev?.find((element) => {
                            return (
                                element?._id === emittedInfo?.senderId ||
                                element?.userId === emittedInfo?.senderId
                            );
                        });
                        if (foundContactId) {
                            console.log("i have found the id");
                            console.log(foundContactId);
                            return prev;
                        }
                        return [...prev, emittedInfo];
                    });
                }

                // seen messages => chat is opened, set the isSeen to true

                setMessageSeen((prev) => {
                    // found the element
                    let messageIndex = prev.findIndex(
                        (chatInfo) =>
                            chatInfo?.messageId === emittedInfo?.createdAt
                    );
                    if (messageIndex !== -1) {
                        return prev.map((item, index) => {
                            return index === messageIndex
                                ? {
                                      ...item,
                                      isSeen: true,
                                  }
                                : item;
                        });
                    } else {
                        return [
                            ...prev,
                            {
                                messageId: emittedInfo?.createdAt,
                                isSeen: false,
                            },
                        ];
                    }
                });

                setMessageSeen((prev) => {
                    console.log(
                        `slectedChat ${selectedChat?._id} senderId ${emittedInfo?.senderId}`
                    );
                    if (selectedChat?._id === emittedInfo?.senderId) {
                        console.log("i'm the sender");
                        return prev?.map((element) => {
                            return element?.messageId === emittedInfo?.createdAt
                                ? {
                                      ...element,
                                      isSeen: true,
                                  }
                                : element;
                        });
                    }
                    return [
                        ...prev,
                        {
                            messageId: emittedInfo?.createdAt,
                            isSeen: false,
                        },
                    ];
                });
            });

            socket.on("getOnlineUsers", (onlineUsers) => {
                console.log("online users are", onlineUsers);
                setOnlineUsers([...new Set(onlineUsers)]);
            });
            socket.on("recieveDeleteMessages", (messages) => {
                console.log("delete messages array", messages);
                setMessages(messages);
            });

            socket.on("scheduledMessage", (updatedMessage) => {
                console.log("resulted array updated", updatedMessage);
                setMessages((prev) => {
                    return [...prev, ...updatedMessage];
                });
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
    console.log("messages", messages);
    console.log("isSeenMessage", messageSeen);
    useEffect(() => {
        setIsChatBoxLoaded(true);
        (async function () {
            const { data } = await axios.get(
                `${configEnv.BASE_URL}/api/searchContact/${userInfo?.userId}/myContact`,
                {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                }
            );
            setIsChatBoxLoaded(false);
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

    useEffect(() => {
        if (debouncedSearch) {
            (async function () {
                const { data } = await SearchContactAPI(debouncedSearch);
                if (data) {
                    setGlobalSearchResults([...data?.data]);
                }
            })();
        }
    }, [debouncedSearch]);
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
                        recipientId: info?._id || info?.senderId,
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
                console.log(
                    "can not get messgaes, since there is no chatType defined"
                );
                break;
        }

        // handle with switch case.

        // remove the user from the unseen messages state, since the message is now seen.
        setMessageUnSeen((prev) => {
            return prev?.filter((item, index) => {
                return item?.senderId !== info?._id;
            });
        });

        setMessageSeen([]);
    };
    // send the message
    console.log("chat Box", chatBox);
    console.log("unseen messages", messageUnSeen);
    console.log("messages", messages);
    const sendMessage = (message) => {
        console.log("message that was sent", message);
        if (!message) return;

        // this will only run for images.
        let messageType, imageWithTextdata, pdfWithTextdata, contactAsAMessage;
        if (message?.image) {
            messageType = messageTypes.IMAGEWITHTEXT;
            imageWithTextdata = message;
            message = null;
        } else if (message?.pdf) {
            messageType = messageTypes.PDFWITHTEXT;
            pdfWithTextdata = message?.pdf;
            message = null;
        } else if (message?.contact) {
            messageType = messageTypes.CONTACT;
            contactAsAMessage = message?.contact;
            message = null;
        }
        // decide on the basics of chat application.
        const chatType = selectedChat?.chatType;
        let emitInfo = {
            isSeen: false,
        };
        switch (chatType) {
            case chatTypes.OneOnOne:
                emitInfo = {
                    ...emitInfo,
                    ...(message && { message }),
                    ...(messageType
                        ? { messageType }
                        : { messageType: "text" }),
                    ...(imageWithTextdata && {
                        imageWithText: imageWithTextdata,
                    }),
                    ...(pdfWithTextdata && { pdfWithText: pdfWithTextdata }),
                    ...(contactAsAMessage && {
                        contactAsAMessage: contactAsAMessage,
                    }),
                    senderId: userInfo?.userId,
                    recipientId: selectedChat?._id,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime(),
                    chatType: chatTypes.OneOnOne,
                    ...userInfo,
                };
                console.log("emitInfo includs", emitInfo);

                socket?.emit("sendMessage", emitInfo);

                setMessages((prev) => {
                    return [...prev, emitInfo];
                });

                // add this message to your message box now
                break;
            case chatTypes.groupChat:
                emitInfo = {
                    ...emitInfo,

                    roomId: selectedChat?._id,
                    ...(message && { message }),
                    ...(messageType
                        ? { messageType }
                        : { messageType: "text" }),
                    ...(imageWithTextdata && { imageWithTextdata }),
                    senderId: userInfo?.userId,
                    chatType: chatTypes.groupChat,
                    isGroup: true,
                    groupName: selectedChat?.groupName,
                    groupParticipantIds: selectedChat?.participants,
                };
                console.log("message context", emitInfo);
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
                return [...prev];
            } else {
                return [...prev, info];
            }
        });
    };

    const handleFormAGroup = async () => {
        console.log("being clicked");
        setGroupCreationModalControl(true);
        setGroupCreationWindow(false);
        // const result = await createGroup(
        //     groupCreation,
        //     groupName,
        //     userInfo?.userId
        // );
        // setGroupName("");
        // console.log("result ", result);
    };

    const handleCloseImageWithTextModal = () => {
        setOpenImageWithTextModal(false);
        setFileImage("");
        setPdfFile("");
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
    const handleClickPdfFiles = (e) => {
        e.stopPropagation();
        if (pdfRef?.current) {
            pdfRef.current.click();
        }
    };
    const handleFileChange = (e) => {
        // e.stopPropagation();
        if (!e.target?.files) return;
        const file = e.target?.files[0];
        setOpenPopUp(false);
        const storageRef = ref(storage, `images/${file.name}`);
        console.log("storage ref is ", storageRef);

        uploadFileToFireBase(storageRef, file, fileFormats.IMAGE);
        handleOpenImageWithTextModal();
    };
    const handleFileChangePdf = (e) => {
        if (!e.target?.files) return;
        const file = e.target?.files[0];
        const storageRef = ref(storage, `pdfs/${file.name}`);
        console.log("storage ref is ", storageRef);

        uploadFileToFireBase(storageRef, file, fileFormats.PDF);
        handleOpenImageWithTextModal();
    };
    console.log("selectedChat", selectedChat);

    const handleOpenViewMediaControl = (content) => {
        setShowViewMedia(true);
        setShowViewMediaContent(content);
    };
    const handleCloseViewMediaControl = () => {
        setShowViewMedia(false);
    };

    const renderMessage = (
        messageType,
        message,
        imageWithText,
        pdfWithText,
        contactAsAMessage,
        isSeen
    ) => {
        switch (messageType) {
            case messageTypes.CONTACT:
                console.log(
                    `contact as a message ${JSON.stringify(contactAsAMessage)}`
                );
                return (
                    <>
                        <div className="contact-box">
                            <div className="sent-contact">
                                <img
                                    src={
                                        contactAsAMessage[0]?.profileImage ||
                                        contactAsAMessage?.profileImage
                                    }
                                    alt="contact"
                                />
                                <p className="font-semibold ">
                                    {Array.isArray(contactAsAMessage)
                                        ? `${contactAsAMessage[0]?.firstName} ${contactAsAMessage[0]?.lastName}`
                                        : `${contactAsAMessage?.firstName} ${contactAsAMessage?.lastName}`}
                                </p>
                            </div>
                            <div className="contact-action-buttons">
                                <button
                                    onClick={(e) => {
                                        const contact = Array.isArray(
                                            contactAsAMessage
                                        )
                                            ? contactAsAMessage[0]
                                            : contactAsAMessage;
                                        messageThisConatct(e, contact);
                                    }}
                                >
                                    Message
                                </button>
                                <button>Add to Group</button>
                            </div>
                        </div>
                    </>
                );
            case messageTypes.TEXT:
                return message;
            case messageTypes.IMAGE:
                break;
            case messageTypes.PDF:
                break;
            case messageTypes.IMAGEWITHTEXT:
                const content = Array.isArray(imageWithText)
                    ? imageWithText[0].image
                    : imageWithText?.image;
                return (
                    <div className="flex-col felx-1 flex-grow">
                        <img
                            onClick={(e) => {
                                e.stopPropagation;
                                handleOpenViewMediaControl(content);
                            }}
                            className="message-image"
                            src={
                                imageWithText[0]?.image || imageWithText?.image
                            }
                            alt=""
                        />
                        <div className="flex">
                            <p className="text-image">
                                {imageWithText[0]?.text || imageWithText.text}
                            </p>
                            <div className="self-end">
                                {isSeen ? (
                                    <BsCheck2All color="blue" />
                                ) : (
                                    <BsCheck2 />
                                )}
                            </div>
                        </div>
                    </div>
                );
                break;
            case messageTypes.PDFWITHTEXT:
                return (
                    <div className="felx-col flex-1 flex-grow">
                        <img
                            className="message-image"
                            src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                            alt=""
                        />
                        <div className="flex">
                            <p className="text-image">
                                {pdfWithText[0]?.text || pdfWithText?.text}
                            </p>
                            <div className="self-end">
                                <BsCheck2 />
                            </div>
                        </div>
                    </div>
                );
                break;
            case messageTypes.CONTACT:
                break;
            default:
                return "Message more correctly setup";
                break;
        }
    };

    const isOnline = (id) => {
        return onlineUsers?.includes(id);
    };

    const uploadFileToFireBase = (storageRef, file, fileFormat) => {
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

                switch (snapshot.state) {
                    case "paused":
                        break;
                    case "running":
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
                const fileFromFireBase = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                switch (fileFormat) {
                    case fileFormats.IMAGE:
                        console.log("insdie image file");
                        setFileImage(fileFromFireBase);
                        break;
                    case fileFormats.PDF:
                        console.log("inside pdf file");
                        console.log("pdf file image", fileFromFireBase);
                        setPdfFile(fileFromFireBase);
                        break;
                    default:
                        break;
                }
            }
        );
    };

    const getLastSeenMessage = (lastSeenTimestamp) => {
        const lastSeen = new Date(lastSeenTimestamp);
        const now = new Date();
        const diffMs = now - lastSeen;
        const diffMinutes = diffMs / (1000 * 60);
        const diffHours = diffMs / (1000 * 60 * 60);

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
        const indexOfUser = messageUnSeen?.findIndex(
            (sender) => sender?.senderId === info?._id
        );
        if (indexOfUser === -1) {
            return;
        } else {
            let value = messageUnSeen[indexOfUser]?.unSeenMessage;
            return value;
        }
    };
    function whoSentLastMessage(chatBoxUserId) {
        if (lastMessageInChatBox) {
            const found = lastMessageInChatBox.find((element) => {
                return element?._id === chatBoxUserId;
            });
            if (found) {
                const { messageType, message, imageWithText } =
                    found?.lastMessage;

                switch (messageType) {
                    case messageTypes.TEXT:
                        return message;
                    case messageTypes.IMAGEWITHTEXT:
                        return "Image with text";
                    case messageTypes.PDFWITHTEXT:
                        return "PDF with text";
                    case messageTypes.CONTACT:
                        return <>&#xbb; Shared a contact</>;
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

    function handleRemoveGroup(selectedContact) {
        setGroupCreation((prev) => {
            return prev.filter((element) => {
                return element?._id !== selectedContact?._id;
            });
        });
    }
    const handleSearchContactsGlobally = (e) => {
        const searchValue = e.target.value;
        setSearchContactGlobal((prev) => searchValue);
    };

    const messageThisConatct = (e, contact) => {
        const newContact = { ...contact, chatType: chatTypes.OneOnOne };
        const chatBoxOneOnOne = chatBox?.filter(
            (elements) => elements?.chatType != chatTypes.groupChat
        );
        console.log("chat box one on one", chatBoxOneOnOne);

        const foundTheConact = chatBoxOneOnOne?.find(
            (element) => element._id === newContact?._id
        );
        if (!foundTheConact) {
            setChatBox((prev) => {
                return [...prev, newContact];
            });

            // setSelectedChat(newContact);
            handleSelectChat(e, newContact);
            setGlobalSearchResults([]);
            setSearchContactGlobal("");
        } else {
            handleSelectChat(e, newContact);
            setGlobalSearchResults([]);
            setSearchContactGlobal("");
        }
    };

    const handleShowOnlyGroup = () => {
        setChatBox((prev) => {
            return prev.filter(
                ({ chatType }) => chatType === chatTypes.groupChat
            );
        });
    };

    const handleShowAllGroup = () => {
        setIsChatBoxLoaded(true);
        (async function () {
            const { data } = await axios.get(
                `${configEnv.BASE_URL}/api/searchContact/${userInfo?.userId}/myContact`,
                {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                }
            );
            setIsChatBoxLoaded(false);
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
    };
    return (
        <div className="chat-wrapper">
            <div
                className="sidebar"
                onClick={() => {
                    setGlobalSearchResults([]);
                    setSearchContactGlobal("");
                }}
            >
                <div className="chat-action">
                    <div className="user-chat--info">
                        <img
                            className="user-profile"
                            src={userInfo?.profileImage}
                            alt="user-profile-image"
                        />
                        <p
                            className="themes"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("click click");
                                setShowThemeSection(!showThemeSection);
                            }}
                        >
                            <CiDark />
                        </p>
                        <p className="stories">
                            <CiShop />
                        </p>
                        <p className="settings" onClick={handleGroupCreation}>
                            <CiChat1 />
                        </p>
                    </div>
                    {/* search contact */}
                    {/* todo : add the search icon and make that respnosive as well */}
                    {/* todo : add the focu:visible class */}
                    <SearchContact
                        handleSearchContactsGlobally={
                            handleSearchContactsGlobally
                        }
                        searchContactGlobal={searchContactGlobal}
                    />
                    {globalSearchResults.length >= 1 ? (
                        <div className="grid px-4 gap-1 globalSearchResults rounded-b-md py-3">
                            {globalSearchResults?.map((contact, index) => {
                                return (
                                    <p
                                        key={index}
                                        className="rounded-md px-2 py-3  text-primary-bg font-semibold globalSearchIndividualResults"
                                        onClick={(e) => {
                                            messageThisConatct(e, contact);
                                        }}
                                    >
                                        {contact?.firstName} {contact?.lastName}
                                    </p>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="messages-category">
                            <p className="" onClick={handleShowAllGroup}>
                                All
                            </p>
                            <p className="" onClick={handleShowOnlyGroup}>
                                Groups
                            </p>
                            <p className="">Favorites</p>
                        </div>
                    )}
                </div>
                <div className="chat-inboxes">
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
                                    userInfo={userInfo}
                                    showUnSeenNumberOfMessages={
                                        showUnSeenNumberOfMessages
                                    }
                                />
                            );
                        })
                    )}
                </div>
                {/* todo: make this a component of it's own */}
                {/* group section */}
                <div
                    className="group-creation "
                    style={
                        groupCreationWindow
                            ? { transform: "translateX(0%)" }
                            : {}
                    }
                >
                    <p onClick={handleGroupCreation} className="mb-4">
                        <CiCirclePlus />
                    </p>
                    {/* search globaly throught the database */}
                    <div className="select-box px-4">
                        {groupCreation?.length >= 1 &&
                            groupCreation?.map((selectedContact, index) => {
                                // todo: the box you have selected, click on these again to remove them from the contact.
                                return (
                                    <div
                                        key={index}
                                        className="bg-secondary-400 px-3 flex justify-center content-center font-semibold"
                                        onClick={() => {
                                            handleRemoveGroup(selectedContact);
                                        }}
                                    >
                                        {selectedContact?.firstName}
                                    </div>
                                );
                            })}
                        {/* <input placeholder="search for people" type="text" /> */}
                        {/* todo: later this would become a modal, IMPORTANT */}
                        <button
                            onClick={() => {
                                handleFormAGroup();
                            }}
                            className="create-group-button"
                        >
                            Create group
                        </button>
                    </div>
                    {/* todo: create the modal for group creation */}
                    {/* <CreateGroupModal open={groupCreationModalControl} /> */}
                    {/* search or select through just your contacts */}
                    <div className="mt-2 flex gap-2 flex-col px-4 ">
                        List of all the contacts you have
                        {chatBox?.map((contact, index) => {
                            return contact?.groupName ? (
                                ""
                            ) : (
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

                {/* this needs to for the theme switcher */}

                <ThemeSection
                    showThemeSection={showThemeSection}
                    setShowThemeSection={setShowThemeSection}
                />

                <CreateGroupModal
                    open={groupCreationModalControl}
                    setGroupCreationModalControl={setGroupCreationModalControl}
                    groupCreation={groupCreation}
                    groupName={groupName}
                    userInfo={userInfo}
                    handleGroupCreation={handleGroupCreation}
                    onClose={setGroupCreationModalControl}
                    setChatBox={setChatBox}
                />
            </div>
            {/* chat conponent */}
            {selectedChat ? (
                <Chatcontainer
                    setOpenPopUp={setOpenPopUp}
                    selectedChat={selectedChat}
                    isOnline={isOnline}
                    getLastSeenMessage={getLastSeenMessage}
                    messages={messages}
                    setMessages={setMessages}
                    userInfo={userInfo}
                    renderMessage={renderMessage}
                    handleFileChange={handleFileChange}
                    handleClick={handleClick}
                    messageBox={messageBox}
                    setMessageBox={setMessageBox}
                    sendMessage={sendMessage}
                    fileImages={fileImages}
                    pdfFile={pdfFile}
                    handleCloseImageWithTextModal={
                        handleCloseImageWithTextModal
                    }
                    ref={{ imageRef, pdfRef }}
                    openImageWithTextModal={openImageWithTextModal}
                    openPopUp={openPopUp}
                    isChatLoading={isChatLoading}
                    handleFileChangePdf={handleFileChangePdf}
                    handleClickPdfFiles={handleClickPdfFiles}
                    chatBox={chatBox}
                    handleCloseViewMediaControl={handleCloseViewMediaControl}
                    showViewMedia={showViewMedia}
                    showViewMediaContent={showViewMediaContent}
                />
            ) : (
                <div className="default-chat">
                    {/* todo: pressing escap make the component switch to default selectesate that is null */}
                    <DefaultChatContainer />
                </div>
            )}
        </div>
    );
}
