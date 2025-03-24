import "./styles.css";
import { RxCross2 } from "react-icons/rx";
import { FaArrowRight } from "react-icons/fa";
export default function ProfileDetails({
    selectedChat,
    showMeow,
    setShowMeow,
    setShowChatDetailsSection,
}) {
    console.log("profile section", selectedChat);
    const { profileImage, about } = selectedChat;
    const onToTabs = (e) => {
        e.preventDefault();
        setShowMeow(!showMeow);
    };
    return (
        <div className="profile-details">
            <div className="title-bar">
                <p
                    className="go-back"
                    onClick={() => {
                        setShowChatDetailsSection(false);
                    }}
                >
                    <RxCross2 />
                </p>
                <p className="contact-info">Contact info</p>
            </div>
            <div className="profile-image">
                <img src={profileImage} alt="" />
                <p>{about || "Hey, i am using Meowtalk"}</p>
            </div>

            <div className="tabs" onClick={onToTabs}>
                <p>Media</p>
                <p>Pdf</p>
                <p>Contact</p>
                <p>
                    <FaArrowRight />
                </p>
            </div>
        </div>
    );
}
