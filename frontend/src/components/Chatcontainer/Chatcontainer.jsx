import { forwardRef } from "react";
import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { IoIosAttach } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import ImageWithText from "../Modals/ImageWithText/ImageWithText";
import "./styles.css";
import ChatcontainerSkeleton from "../Skeletons/ChatcontainerSkeletons/ChatcontainerSkeleton";
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
        },
        imageRef // <-- Correctly placed as the second argument
    ) => {
        console.log("message", messages);

        return (
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
                                : getLastSeenMessage(selectedChat?.lastSeen)}
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

                <div>
                    {isChatLoading ? (
                        <ChatcontainerSkeleton />
                    ) : (
                        <div className="chat-talking-section text-accent">
                            {messages?.map(
                                (
                                    {
                                        recipientId,
                                        senderId,
                                        message,
                                        messageType,
                                        imageWithText,
                                    },
                                    index
                                ) => {
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
                                            {selectedChat?._id !==
                                                recipientId && (
                                                <p className="name-message-top">
                                                    {selectedChat?.firstName}{" "}
                                                    {selectedChat?.lastName}
                                                </p>
                                            )}
                                            {renderMessage(
                                                messageType,
                                                message,
                                                imageWithText
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
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
        );
    }
);
