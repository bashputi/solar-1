import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) throw new Error("useSocket must be used within a SocketProvider");
    return socket;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
  

    useEffect(() => {
        const connectSocket =  () => {
            const connection = io("http://localhost:3000");
    
            connection.on('error', (error) => {
                console.error("Socket error:", error);
            });
    
            connection.on('connect', () => {
                console.log('Socket connected:', connection.connected);
                setSocket(connection);
            });
        };
    
        connectSocket();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []); 

    return (
        <SocketContext.Provider value={socket}>
            {socket ? children : null}
        </SocketContext.Provider>
    );
};
