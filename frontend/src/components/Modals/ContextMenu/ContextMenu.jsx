import { useContext, useEffect } from "react";
import "./styles.css";
import { SocketContext } from "../../../context/SocketContex";
export default function ContextMenu({
    open,
    messageInfo,
    setMessages,
    messages,
    position,
    setShowContextMenu,
}) {
    const { socket } = useContext(SocketContext);
    const handleDeleteMessage = (e) => {
        e.stopPropagation();
        setMessages((prev) => {
            return prev.filter((element) => element?._id !== messageInfo?._id);
        });

        // write the logic for deleting message.
        socket.emit("deleteMessage", messageInfo);
        setShowContextMenu(false);
    };
    return (
        open && (
            <div className="context-menu" style={position}>
                <p onClick={handleDeleteMessage}>Delete message</p>
                <p>React to message</p>
            </div>
        )
    );
}
