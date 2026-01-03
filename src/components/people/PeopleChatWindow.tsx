import React, { useEffect, useRef, useState } from "react";
import { Send, ChevronLeft } from "lucide-react";
import { SocketClient } from "../../services/socketClient";

interface Message {
    from: string;
    mes: string;
}

interface Props {
    currentUser: string;
    targetUser: string;
    onBack: () => void;
}

const PeopleChatWindow: React.FC<Props> = ({ currentUser, targetUser, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load history
    useEffect(() => {
        setMessages([]);

        SocketClient.getInstance().send({
            action: "onchat",
            data: {
                event: "GET_PEOPLE_CHAT_MES",
                data: { name: targetUser, page: 1 }
            }
        });
    }, [targetUser]);

    // Listen socket
    useEffect(() => {
        const unsub = SocketClient.getInstance().subscribe((data: any) => {
            // history
            if (data.event === "GET_PEOPLE_CHAT_MES" && Array.isArray(data.data)) {
                setMessages(data.data.reverse());
                scrollBottom();
            }

            // realtime
            if (data.event === "SEND_CHAT" && data.data) {
                const { from, mes } = data.data;
                if (from === targetUser || from === currentUser) {
                    setMessages(prev => [...prev, { from, mes }]);
                    scrollBottom();
                }
            }
        });

        return () => unsub();
    }, [currentUser, targetUser]);

    const sendMessage = () => {
        if (!input.trim()) return;

        SocketClient.getInstance().send({
            action: "onchat",
            data: {
                event: "SEND_CHAT",
                data: {
                    type: "people",
                    to: targetUser,
                    mes: input
                }
            }
        });

        setMessages(prev => [...prev, { from: currentUser, mes: input }]);
        setInput("");
        scrollBottom();
    };

    return (
        <div className="flex flex-col h-full bg-[#F8FAF5]">
            {/* HEADER */}
            <div className="p-3 flex items-center gap-2 border-b bg-white">
                <button onClick={onBack} className="btn btn-ghost btn-circle btn-sm">
                    <ChevronLeft size={20} />
                </button>
                <div className="font-semibold">{targetUser}</div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                    <div key={i} className={`chat ${m.from === currentUser ? "chat-end" : "chat-start"}`}>
                        <div className={`chat-bubble ${m.from === currentUser ? "bg-lime-500 text-white" : "bg-white border"}`}>
                            {m.mes}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 bg-white border-t flex gap-2">
                <input
                    className="input input-bordered flex-1"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} className="btn bg-lime-500 text-white">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default PeopleChatWindow;
