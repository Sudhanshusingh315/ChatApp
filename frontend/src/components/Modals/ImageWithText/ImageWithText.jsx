import "./styles.css";
import { RxCrossCircled } from "react-icons/rx";
import { FaDownload } from "react-icons/fa6";
import { CiFaceSmile } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { useState } from "react";
export default function ImageWithText({ open, image, onClose, sendMessage}) {
    const [textWithImage, setTextWithImage] = useState("");
    console.log("image", image);
    const handleSend = (e) =>{
        const message = {
            text:textWithImage,
            image
        }
        console.log(`message is ${JSON.stringify(message,null,2)} and type of messgae is ${typeof message}, and normal message ${typeof "hellow catto"}`);
        sendMessage(message);
        onClose();

    }

    const handleOnClose = () =>{
        // todo: handle on close, delet the file from the firebase store.
    }
    
    const onTextChange = (e) =>{
        const text = e?.target?.value;
        setTextWithImage(text);
    }
    return (
        open && <div className="modal-container">
            <div className="modal">
                <div className="tool-bar">
                    <p className="go-back" onClick={onClose}>
                        <RxCrossCircled />
                    </p>
                    <p className="image-preview">Image Preview</p>
                    <p className="download-button">
                        <FaDownload />
                    </p>
                </div>
                <div className="images-section">
                    {!image ? (
                        <p>Upload the div with shimmer effect</p>
                    ) : (
                        <img
                            src={image}
                            alt=""
                        />
                    )}
                </div>
                <div className="inputbox">
                    <textarea type="text" name="" id="" placeholder="" onChange={onTextChange} value={textWithImage} />
                    <p className="face-smile" >
                        <CiFaceSmile />
                        
                    </p>
                    <p className="send-button" onClick={handleSend}>
                        <LuSend />
                    </p>
                </div>
            </div>
        </div>
    );
}
