import { useState } from "react";
import "./styles.css";
import { chatTypes } from "../../../constants/contants";
export default function Contact({ onModalClose, chatBox, sendMessage }) {
    const [onlyOneOnOne, setOnlyOneOnOne] = useState(
        chatBox?.filter((chat) => !chat?.groupName)
    );
    const [sendContactConfirmantion, setContactConfirmation] = useState(false);
    const [selectedConact, setSelectedContact] = useState({});
    console.log("onlyOneOnOne", onlyOneOnOne);
    function handleConfirmation(confirmedContact) {
        setContactConfirmation(true);
        setSelectedContact(() => confirmedContact);
    }
    function handleRejectConfirmation() {
        setContactConfirmation(false);
        setSelectedContact({});
    }
    function handleYesConfirmation(e) {
        e.stopPropagation();
        const {
            chatType,
            contacts,
            groups,
            password,
            profileSetup,
            __v,
            ...contact
        } = selectedConact;
        const message = {
            ...(contact && { contact }),
        };
        console.log(
            `message is ${JSON.stringify(
                message,
                null,
                2
            )} and type of messgae is ${typeof message}, and normal message ${typeof "hellow catto"}`
        );
        sendMessage(message);
        setContactConfirmation(false);
        onModalClose();
    }

    return (
        <div className="contact-dialog">
            <div className="contacts-backdrop" onClick={onModalClose}></div>
            <div className="contacts bg-primary-bg-skeleton text-secondary-300 font-semibold">
                <h2 className="text-2xl text-center decoration-wavy ">
                    Your Contacts
                </h2>
                {onlyOneOnOne?.map((element, index) => {
                    return (
                        <div
                            key={index}
                            className="individual-contact bg-primary-skeleton rounded-md hover:bg-secondary-300-skeleton hover:text-white cursor-pointer"
                            onClick={() => {
                                handleConfirmation(element);
                            }}
                        >
                            <img
                                src={element?.profileImage}
                                alt="profile-image"
                            />
                            <p className="contact-name">
                                {element?.firstName} {element?.lastName}
                            </p>
                        </div>
                    );
                })}
            </div>
            {sendContactConfirmantion && (
                <div className="confirmation text-white bg-primary p-4">
                    <h2 className="text-2xl ">Select this contact?</h2>
                    <div className="flex gap-1 ">
                        <button
                            className="flex-1 call-to-action bg-secondary-300-skeleton text-white"
                            onClick={handleYesConfirmation}
                        >
                            Yes
                        </button>
                        <button
                            className="flex-1 call-to-action bg-white text-gray-800"
                            onClick={handleRejectConfirmation}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
