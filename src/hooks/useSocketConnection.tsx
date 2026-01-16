import {useEffect, useState} from "react";
import {SocketClient} from "../services/socketClient";

export const useSocketConnection = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = SocketClient.getInstance();

        const unsubscribe = socket.onConnectionChange((status) => {
            setIsConnected(status);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return isConnected;
};