import "./chat.css";
import { CiDark, CiShop } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
export default function Chat() {
    return (
        <div className="chat-wrapper">
            <div className="sidebar">
                <div className="chat-action">
                    <div className="user-chat--info">
                        <img
                            className="user-profile"
                            src="https://i.pravatar.cc/300"
                            alt="user-profile-image"
                        />
                        <p className="themes">
                            <CiDark />
                        </p>
                        <p className="stories">
                            <CiShop/>
                        </p>
                        <p className="settings">
                            <CiSettings />
                        </p>
                    </div>
                    <div className="chat-search">
                        {/* todo : add the search icon and make that respnosive as well */}
                        {/* todo : add the focu:visible class */}
                        <input type="text" className="bg-secondary-400/85 hover:outline-primary hover:outline-4 hover:outline-double" placeholder="search contacts"/>
                    </div>
                    <div className="messages-category">
                        <p className="bg-secondary-400/85 text-primary">All</p>
                        <p className="bg-secondary-400/85 text-primary">Unread</p>
                        <p className="bg-secondary-400/85 text-primary">Favorites</p>
                        <p className="bg-secondary-400/85 text-primary">Groups</p>
                    </div>
                </div>
                <div className="chat-inboxes text-accent">
                    <div className="chat-inbox ">
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
                                +9
                            </p>
                        </div>
                    </div>
                    <div className="chat-inbox">
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
                    </div>
                </div>
            </div>
            <div className="chat-container"></div>
        </div>
    );
}
