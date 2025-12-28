import React, { useState, useEffect, useRef } from "react";
import { Send, ImagePlus, Smile, ChevronLeft } from "lucide-react";
import { socketClient } from "../services/socketClient";

export interface Conversation {
  id: number;
  name: string;
  avatar?: string;
}

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onBack
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  const scrollBottom = () =>
    endRef.current?.scrollIntoView({ behavior: "smooth" });

  // ===== CONNECT + LISTEN SOCKET =====
  useEffect(() => {
    socketClient.connect();

    const off = socketClient.onMessage((res) => {
      const event = res?.data?.event;

      // LỊCH SỬ ROOM
      if (event === "GET_ROOM_CHAT_MES") {
        const list = res.data.data?.list || [];
        setMessages(list.map((m: any) => m.mes));
        scrollBottom();
      }

      // TIN NHẮN MỚI TRONG ROOM
      if (event === "SEND_CHAT") {
        setMessages((prev) => [...prev, res.data.data.mes]);
        scrollBottom();
      }
    });

    // JOIN ROOM + LOAD HISTORY mỗi khi đổi room
    socketClient.joinRoom(conversation.name);
    socketClient.getRoomHistory(conversation.name, 1);

    return off;
  }, [conversation]);

  // ===== SEND MESSAGE =====
  const handleSend = () => {
    if (!message.trim()) return;

    socketClient.sendMessage(conversation.name, message);
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAF5] h-full relative">
      {/* HEADER */}
      <div className="bg-base-100/80 backdrop-blur-md p-3 md:p-4 flex items-center gap-2 border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="md:hidden btn btn-ghost btn-circle btn-sm -ml-2 text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="avatar online">
          <div className="w-9 md:w-10 rounded-full border border-lime-200">
            <img
              src={
                conversation.avatar ||
                "https://i.pravatar.cc/150?img=10"
              }
              alt={conversation.name}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base-content text-sm md:text-base truncate">
            {conversation.name}
          </h2>
          <span className="text-lime-600 text-xs font-bold block">
            ● Đang hoạt động
          </span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
          >
            <div
              className={`chat-bubble ${
                idx % 2 === 0
                  ? "bg-base-100 text-gray-700"
                  : "bg-lime-500 text-white"
              } shadow-sm border border-gray-100`}
            >
              {msg}
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="p-4">
        <div className="bg-base-100 p-2 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-2 px-4">
          <ImagePlus size={20} className="text-gray-400" />
          <Smile size={20} className="text-gray-400" />

          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="input input-ghost w-full border-none focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="btn btn-circle btn-sm bg-lime-500 text-white"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
