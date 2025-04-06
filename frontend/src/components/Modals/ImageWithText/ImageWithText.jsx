import "./styles.css";
import { RxCrossCircled } from "react-icons/rx";
import { FaDownload } from "react-icons/fa6";
import { CiFaceSmile } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { useState } from "react";
export default function ImageWithText({
    open,
    image,
    onClose,
    sendMessage,
    pdf,
}) {
    const [textWithImage, setTextWithImage] = useState("");
    const handleSend = (e) => {
        const message = {
            text: textWithImage,
            ...(image && { image }),
            ...(pdf && { pdf }),
        };
        console.log(
            `message is ${JSON.stringify(
                message,
                null,
                2
            )} and type of messgae is ${typeof message}, and normal message ${typeof "hellow catto"}`
        );
        sendMessage(message);
        setTextWithImage("");
        onClose();
    };

    const handleOnClose = () => {
        // todo: handle on close, delete the file from the firebase store.
    };

    const onTextChange = (e) => {
        const text = e?.target?.value;
        setTextWithImage((prev) => text);
    };
    return (
        open && (
            <div className="modal-container">
                <div className="modal">
                    <div className="tool-bar">
                        <p className="go-back" onClick={onClose}>
                            <RxCrossCircled />
                        </p>
                        <p className="image-preview">Media Preview</p>
                        <p className="download-button">
                            <FaDownload />
                        </p>
                    </div>
                    <div className="images-section">
                        {!image && !pdf ? (
                            <p className="default animate-pulse text-center my-4"></p>
                        ) : (
                            <>
                                <div className="justify-self-center object-cover">
                                    {image && (
                                        <img
                                            className="max-h-80 object-cover"
                                            src={image}
                                            alt=""
                                        />
                                    )}
                                </div>
                                <div className="justify-self-center object-cover">
                                    {pdf && (
                                        <img
                                            className="w-52 h-52"
                                            src="https://static.vecteezy.com/system/resources/previews/022/086/609/non_2x/file-type-icons-format-and-extension-of-documents-pdf-icon-free-vector.jpg"
                                            alt="pdf file"
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="inputbox">
                        <textarea
                            type="text"
                            name=""
                            id=""
                            placeholder=""
                            onChange={onTextChange}
                            value={textWithImage}
                        />
                        <p className="face-smile">
                            <CiFaceSmile />
                        </p>
                        <p
                            className={`send-button ${
                                image || pdf
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                            }`}
                            onClick={() => {
                                image || pdf ? handleSend() : "";
                            }}
                        >
                            <LuSend />
                        </p>
                    </div>
                </div>
            </div>
        )
    );
}
