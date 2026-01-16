import { useEffect, useState } from "react";
import { SocketClient } from "../services/socketClient";
import { Conversation } from "../pages/Chat";

export interface Message {
    from: string;
    mes: string;
    time?: string;
    id: number | string;
}

export const useChatMessages = (
    conversation: Conversation,
    currentUser: string
) => {
    const socket = SocketClient.getInstance();

    const [messages, setMessages] = useState<Message[]>([]);
    const [joined, setJoined] = useState(false);

    // ===== FORMAT DATE =====
    const getDateLabel = (time: string) => {
        const d = new Date(time);
        return d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    // ===== SOCKET LISTENER =====
    useEffect(() => {
        setMessages([]);
        setJoined(false);

        const handler = (res: any) => {
            const { event, data } = res;
            if (!data) return;

            // ===== REALTIME =====
            if (event === "SEND_CHAT") {
                const from = data.name;
                const to = data.to;

                if (!from || !to) return;

                const isPeople =
                    conversation.type === "0" &&
                    (from === conversation.id || to === conversation.id);

                const isRoom =
                    conversation.type === "1" && to === conversation.id;

                if (!isPeople && !isRoom) return;

                setMessages(prev => [
                    ...prev,
                    {
                        from,
                        mes: data.mes,
                        time: data.createAt || data.time,
                        id: `rt-${Date.now()}`
                    }
                ]);
            }

            // ===== PEOPLE HISTORY =====
            if (event === "GET_PEOPLE_CHAT_MES" && conversation.type === "0") {
                const list = Array.isArray(data)
                    ? data.map((m: any) => ({
                        from: m.from || m.name,
                        mes: m.mes,
                        time: m.createAt,
                        id: m.id
                    }))
                    : [];

                list.sort((a, b) => Number(a.id) - Number(b.id));
                setMessages(list);
            }

            // ===== JOIN ROOM =====
            if (event === "JOIN_ROOM" && conversation.type === "1") {
                setJoined(true);
                socket.getRoomChatMes(conversation.id, 1);
            }

            // ===== ROOM HISTORY =====
            if (event === "GET_ROOM_CHAT_MES" && conversation.type === "1") {
                const list = Array.isArray(data.chatData)
                    ? data.chatData.map((m: any) => ({
                        from: m.name,
                        mes: m.mes,
                        time: m.createAt,
                        id: m.id
                    }))
                    : [];

                list.sort((a: Message, b: Message) => {
                    const aId = typeof a.id === "number" ? a.id : parseInt(a.id);
                    const bId = typeof b.id === "number" ? b.id : parseInt(b.id);
                    return aId - bId;
                });


                setMessages(list);
            }
        };

        const off = socket.subscribe(handler);

        if (conversation.type === "0") {
            socket.getPeopleChatMes(conversation.id);
        }

        return off;
    }, [conversation.id, conversation.type]);

    // ===== SEND MESSAGE =====
    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        socket.sendChat(
            conversation.type === "1" ? "room" : "people",
            conversation.id,
            text
        );

        // optimistic UI
        setMessages(prev => [
            ...prev,
            {
                from: currentUser,
                mes: text,
                time: new Date().toISOString(),
                id: `local-${Date.now()}`
            }
        ]);
    };

    // ===== JOIN ROOM =====
    const joinRoom = () => {
        if (!joined) {
            socket.joinRoom(conversation.id);
        }
    };

    return {
        messages,
        joined,
        sendMessage,
        joinRoom,
        getDateLabel
    };
};
