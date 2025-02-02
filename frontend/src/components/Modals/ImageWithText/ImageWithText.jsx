import "./styles.css";
import { RxCrossCircled } from "react-icons/rx";
import { FaDownload } from "react-icons/fa6";
import { CiFaceSmile } from "react-icons/ci";
import { useEffect } from "react";
export default function ImageWithText({ open, images,onClose }) {
    return (
      open &&  <div className="modal-container">
            <div className="modal">
                <div className="tool-bar">
                    <p className="go-back" onClick={onClose}>
                        <RxCrossCircled />
                    </p>
                    <p className="image-preview">Image Preview</p>
                    <p className="download-button"><FaDownload/></p>
                </div>
                <div className="images-section">
                    <img
                        src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2113&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D1"
                        alt=""
                    />
                </div>
                <div className="inputbox">
                    <input type="text" name="" id="" />
                    <p className="face-smile"><CiFaceSmile/></p>
                </div>
            </div>
        </div>
    );
}
