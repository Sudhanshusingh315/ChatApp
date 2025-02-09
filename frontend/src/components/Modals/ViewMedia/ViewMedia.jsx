import { FaDownload } from "react-icons/fa";

export default function ViewMedia({ open, onClose }) {
    return (
        open && (
            <div className="view-media">
                <div className="recipient-detaild">
                    <img
                        src="https://randomuser.me/api/portraits/women/2.jpg"
                        alt="recipient-image"
                    />
                    <p>Sudhanshu singh</p>
                    <p>
                        <FaDownload />
                    </p>
                </div>
                <div className="media container">
                    <img
                        src="https://images.unsplash.com/photo-1738447429433-69e3ecd0bdd0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="shared-media"
                    />
                </div>
            </div>
        )
    );
}
