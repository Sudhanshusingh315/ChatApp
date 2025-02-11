import { createContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);
    useEffect(() => {
        if (userInfo) {
            setSocket((prev) => {
                return io("http://localhost:5000", {
                    autoConnect: false,
                    query: userInfo,
                });
            });
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo && socket) {
            const roomsId = userInfo?.groups?.map((elment, index) => {
                return elment?._id;
            });
            
            roomsId.forEach((room) => {
                socket.emit("joinRoom",room);
            });
        }

        return () => {
            if (socket) {
                socket.off("joinRoom");
            }
        };
    }, [userInfo, socket]);
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
