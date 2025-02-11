import { FaDownload } from "react-icons/fa";
import "./styles.css";
export default function ViewMedia({ open, onClose, media }) {
    console.log("media", media);
    const downloadMedia = async (e, media) => {
        e.stopPropagation();
        console.log("eellloo");
        const link = document.createElement("a");
        const fileName = media.split("/").pop().split("?")[0];
        link.href = media;
        link.target = "_blank";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        open && (
            <div
                className="view-media"
                onClick={(e) => {
                    e.stopPropagation;
                    onClose();
                }}
            >
                <div className="view-media-content">
                    <div className="recipient-details bg-primary text-secondary-300">
                        <img
                            src="https://randomuser.me/api/portraits/women/2.jpg"
                            alt="recipient-image"
                        />
                        <p className="recipient-name">Sudhanshu singh</p>
                        <p
                            className="download-media"
                            onClick={(e) => {
                                downloadMedia(e, media);
                            }}
                        >
                            <FaDownload />
                        </p>
                    </div>
                    <div className="media-container max-w-72 ">
                        <img src={media} alt="shared-media" />{" "}
                    </div>
                </div>
            </div>
        )
    );
}
