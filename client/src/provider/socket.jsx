import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) throw new Error("useSocket must be used within a SocketProvider");
    return socket;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const connectSocket = async () => {
            try {
                const connection = await io("http://localhost:3001");
                console.log('socket connection', connection);
                setSocket(connection);
            } catch (error) {
                console.error("Socket connection error:", error);
            }
        };
        connectSocket();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {socket ? children : null}
        </SocketContext.Provider>
    );
};
