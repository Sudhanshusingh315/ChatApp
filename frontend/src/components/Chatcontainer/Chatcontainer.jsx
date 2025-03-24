import { forwardRef, useEffect, useRef, useState } from "react";
import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { IoIosAttach } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import ImageWithText from "../Modals/ImageWithText/ImageWithText";
import ChatcontainerSkeleton from "../Skeletons/ChatcontainerSkeletons/ChatcontainerSkeleton";
import EmojiPicker from "emoji-picker-react";
import { FaFaceSmile, FaRegFaceSmile } from "react-icons/fa6";
import { BsCheck2All } from "react-icons/bs";
import Contact from "../Modals/ContactModal/Contact";
import ViewMedia from "../Modals/ViewMedia/ViewMedia";
import { BsCheck2 } from "react-icons/bs";
import { chatTypes, messageTypes } from "../../constants/contants";
import ContextMenu from "../Modals/ContextMenu/ContextMenu";
import ScheduleMessages from "../Modals/ScheduleMessages/ScheduleMessages";
import { CiCircleInfo } from "react-icons/ci";
import ProfileDetails from "../ProfileDetails/ProfileDetails";
import { CiSettings } from "react-icons/ci";

import "./styles.css";

export const Chatcontainer = forwardRef(
    (
        {
            setOpenPopUp,
            selectedChat,
            isOnline,
            getLastSeenMessage,
            messages,
            userInfo,
            renderMessage,
            handleFileChange,
            handleClick,
            messageBox,
            setMessageBox,
            sendMessage,
            fileImages,
            handleCloseImageWithTextModal,
            openImageWithTextModal,
            openPopUp,
            isChatLoading,
            handleClickPdfFiles,
            handleFileChangePdf,
            pdfFile,
            chatBox,
            handleCloseViewMediaControl,
            showViewMedia,
            showViewMediaContent,
            setMessages,
        },
        ref
    ) => {
        const { imageRef, pdfRef } = ref;
        const messageInputRef = useRef(null);
        const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
        useEffect(() => {
            messageInputRef?.current.focus();
        }, []);
        const [showContactModal, setShowContactModal] = useState(false);
        const [showContextMenu, setShowContextMenu] = useState(false);
        const [contextMenuMessageInfo, setContextMenuMessageInfo] = useState();
        const [position, setPosition] = useState();
        const [chatHeaderPosition, setChatHeaderPosition] = useState();
        const [showScheduleMessage, setShowScheduledMessage] = useState(false);
        const [showHeaderContextMenu, setShowHeaderContextMenu] =
            useState(false);
        const [showChatDetailsSection, setShowChatDetailsSection] =
            useState(false);
        const scrollableDiv = useRef(null);
        const chatHeaderSectionRef = useRef(null);
        const [showMeow, setShowMeow] = useState(true);
        const [groupSettings, setGroupSettings] = useState(false);

        const handleshowChatDetailsSction = (e) => {
            e.stopPropagation();
            setShowChatDetailsSection(!showChatDetailsSection);
            setShowHeaderContextMenu(false);
        };

        console.log("div meow", showMeow);

        const handleEmojiPicker = (e) => {
            e.stopPropagation();
            setOpenEmojiPicker((prev) => !prev);
        };
        const handleChatHeaderSectionContextMenu = (e) => {
            if (!chatHeaderSectionRef.current) return;

            setShowHeaderContextMenu(!showHeaderContextMenu);

            e.stopPropagation();
            const { left, top } =
                chatHeaderSectionRef.current.getBoundingClientRect();
            let position = {
                left: e.clientX - left,
                top: e.clientY - top,
            };
            setChatHeaderPosition(position);
        };
        const handleEmojiclick = (Emojivalue) => {
            const { emoji } = Emojivalue;
            setMessageBox((prev) => prev + emoji);
        };
        const handleEnterSend = (e) => {
            const { key } = e;
            if (key === "Enter") {
                sendMessage(messageBox);
            }
        };
        const handleShowModal = () => {
            setShowContactModal(!showContactModal);
        };

        const handleCloseModal = () => {
            setShowContactModal(false);
        };
        const handleContextMenu = (e, messageInfo) => {
            e.stopPropagation();
            e.preventDefault();

            if (!scrollableDiv?.current) return;

            const { left, top } = scrollableDiv.current.getBoundingClientRect();
            const scrollY = scrollableDiv.current.scrollTop;
            const scrollX = scrollableDiv.current.scrollLeft;

            let position = {
                left: e.clientX - left + scrollX,
                top: e.clientY - top + scrollY,
            };

            if (messageInfo?.senderId !== userInfo?.userId) return;
            setShowContextMenu(!showContextMenu);
            setContextMenuMessageInfo(messageInfo);
            setPosition(position);
        };
        const handleCloseContextMenu = (e) => {
            e.stopPropagation();
            setShowContextMenu(false);
        };

        const handleScheduleMessage = () => {
            setShowScheduledMessage(true);
        };
        const handleCloseScheduleMessage = () => {
            setShowScheduledMessage(false);
        };
        return (
            <div
                className="chat-container"
                onClick={(e) => {
                    // e.stopPropagation();
                    console.log("i'm being clicked");
                    setOpenPopUp(false);
                    setOpenEmojiPicker(false);
                }}
            >
                {/* header */}
                <div className="chat-header-section" ref={chatHeaderSectionRef}>
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
                                : getLastSeenMessage(selectedChat?.lastSeen)}
                        </span>
                    </div>
                    <p className="search-icon">
                        <CiSearch />
                    </p>
                    <p
                        className="kebab-icon"
                        onClick={(e) => {
                            handleChatHeaderSectionContextMenu(e);
                        }}
                    >
                        <CiMenuKebab />
                    </p>

                    {/* test menu */}
                    {/* todo: this should be on it's own, but i want to test few modals first, and later i can put this into it's own component */}
                    {showHeaderContextMenu && (
                        <div
                            className="action-menu"
                            style={chatHeaderPosition}
                            onClick={() => {
                                setShowHeaderContextMenu(
                                    !showHeaderContextMenu
                                );
                            }}
                        >
                            <div
                                onClick={() => {
                                    setShowScheduledMessage(
                                        !showScheduleMessage
                                    );
                                }}
                            >
                                Scheduled Messages
                            </div>
                            <div
                                onClick={handleshowChatDetailsSction}
                                className="flex justify-start items-center gap-2"
                            >
                                Chat Details <CiCircleInfo />
                            </div>
                            {selectedChat?.chatType === chatTypes.groupChat && (
                                <div
                                    className="flex justify-start items-center gap-2"
                                    onClick={(e) => {
                                        setGroupSettings(!groupSettings);
                                    }}
                                >
                                    Group settings <CiSettings />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* chat component */}

                <div>
                    {isChatLoading ? (
                        <ChatcontainerSkeleton />
                    ) : (
                        <div
                            ref={scrollableDiv}
                            className="chat-talking-section"
                            onClick={handleCloseContextMenu}
                        >
                            {messages?.map(
                                (
                                    {
                                        _id,
                                        recipientId,
                                        senderId,
                                        message,
                                        messageType,
                                        imageWithText,
                                        pdfWithText,
                                        contactAsAMessage,
                                        isSeen,
                                    },
                                    index
                                ) => {
                                    return (
                                        <div
                                            // todo: can we do a better index than this?
                                            onContextMenu={(e) => {
                                                handleContextMenu(e, {
                                                    _id,
                                                    recipientId,
                                                    senderId,
                                                });
                                            }}
                                            key={index}
                                            className={
                                                userInfo?.userId === senderId
                                                    ? "owner"
                                                    : "reciever"
                                            }
                                        >
                                            {/* {selectedChat?._id !==
                                                recipientId && (
                                                <p className="name-message-top">
                                                    {selectedChat?.firstName}{" "}
                                                    {selectedChat?.lastName}
                                                </p>
                                            )} */}
                                            {renderMessage(
                                                messageType,
                                                message,
                                                imageWithText,
                                                pdfWithText,
                                                contactAsAMessage,
                                                isSeen
                                            )}
                                            {messageType ===
                                                messageTypes.TEXT &&
                                                userInfo?.userId ===
                                                    senderId && (
                                                    <div className="check-box">
                                                        {isSeen ? (
                                                            <BsCheck2All color="blue" />
                                                        ) : (
                                                            <BsCheck2 />
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    );
                                }
                            )}

                            <ContextMenu
                                open={showContextMenu}
                                messageInfo={contextMenuMessageInfo}
                                messages={messages}
                                setMessages={setMessages}
                                position={position}
                            />
                        </div>
                    )}
                </div>

                {/* message box input */}
                <div className="send-chat-configuration">
                    <input
                        ref={imageRef}
                        type="file"
                        data-photo="photo-video"
                        className="photo-video"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <input
                        ref={pdfRef}
                        type="file"
                        data-photo="pdfs"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileChangePdf}
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
                        <div className="attachment-popup" id="attachment-popup">
                            <p
                                className="li-media"
                                mediatype="photo"
                                onClick={(e) => {
                                    handleClick(e);
                                }}
                            >
                                Photos and Videos
                            </p>

                            <p
                                className="li-pdf"
                                mediatype="document"
                                onClick={(e) => {
                                    handleClickPdfFiles(e);
                                }}
                            >
                                Documents
                            </p>
                            <p mediatype="contact" onClick={handleShowModal}>
                                Contact
                            </p>
                            <p
                                className="li-contact"
                                mediatype="schedule"
                                onClick={handleScheduleMessage}
                            >
                                Schedule Message
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
                        ref={messageInputRef}
                        onKeyDown={handleEnterSend}
                    />
                    <p
                        className="emoji-picker relative cursor-pointer"
                        onClick={handleEmojiPicker}
                    >
                        {openEmojiPicker ? <FaRegFaceSmile /> : <FaFaceSmile />}
                        <p className="absolute bottom-[50px] right-full ">
                            <EmojiPicker
                                width={300}
                                open={openEmojiPicker}
                                onEmojiClick={handleEmojiclick}
                                lazyLoadEmojis={true}
                            />
                        </p>
                    </p>
                    <p
                        className="send-message cursor-pointer hover:text-secondary-400-skeleton"
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
                    pdf={pdfFile}
                    onClose={handleCloseImageWithTextModal}
                    sendMessage={sendMessage}
                />

                {showContactModal && (
                    <Contact
                        onModalClose={handleCloseModal}
                        chatBox={chatBox}
                        sendMessage={sendMessage}
                    />
                )}

                <ViewMedia
                    open={showViewMedia}
                    media={showViewMediaContent}
                    onClose={handleCloseViewMediaControl}
                />

                <ScheduleMessages
                    open={showScheduleMessage}
                    onClose={handleCloseScheduleMessage}
                    userInfo={userInfo}
                    selectedChat={selectedChat}
                />

                {/* todo: make it's own compliment */}

                <div
                    className="chat-details-section"
                    style={{
                        transform:
                            showChatDetailsSection || groupSettings
                                ? "translateX(0%)"
                                : "translateX(-140%)",
                    }}
                >
                    {showChatDetailsSection ? (
                        <div className="meow">
                            <div className="section-1">
                                <ProfileDetails
                                    showMeow={showMeow}
                                    setShowMeow={setShowMeow}
                                    showChatDetailsSection={
                                        showChatDetailsSection
                                    }
                                    setShowChatDetailsSection={
                                        setShowChatDetailsSection
                                    }
                                    selectedChat={selectedChat}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMeow(!showMeow);
                                    }}
                                    className=""
                                >
                                    move next
                                </button>
                            </div>
                            <div
                                className="section-2 text-purple-400"
                                style={{
                                    transform: showMeow
                                        ? "translate(100%)"
                                        : "translate(-100%)",
                                }}
                            >
                                i'm div 2
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMeow(!showMeow);
                                    }}
                                    className=""
                                >
                                    move next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="group-settings"></div>
                    )}
                </div>

                {/* todo: group */}
            </div>
        );
    }
);
