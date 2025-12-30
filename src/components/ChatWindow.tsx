import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft } from "lucide-react";
import { socketClient } from "../services/socketClient";
import { Conversation } from "../pages/Chat";

interface Message {
    from: string;
    mes: string;
    time?:string;

}

interface Props {
    conversation: Conversation;
    currentUser: string;
    onBack: () => void;
}

export const ChatWindow: React.FC<Props> = ({
                                                conversation,currentUser, onBack
}) => {
  const [message, setMessage] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const off = socketClient.onMessage((res) => {
            const { event, data } = res;

            if (event === "SEND_CHAT") {
                setMessages(prev => [...prev, data]);

            }

            if(event==="GET_PEOPLE_CHAT_MES"){
                const list: Message[] = Array.isArray(data)
                    ? data.map((m:any) => ({
                        from: m.from || m.name,
                        mes:m.mes || m.message || "",


                    }))
                    :[];

                setMessages(list);

            }
        });
        socketClient.getPeopleChatMes(conversation.id);

        return off;
    }, [conversation]);



    const sendMessage = () => {
        if (!text.trim()) return;
        socketClient.sendChat(conversation.id, text);



        setMessages(prev => [
            ...prev,
            {from:currentUser, mes:text ,time:new Date().toISOString()}
        ]);
        setText("");

    };


  return (
    <div className="flex-1 flex flex-col bg-[#F8FAF5] h-full relative">
      {/* HEADER */}
      <div className="bg-base-100/80 backdrop-blur-md p-3 md:p-4 flex items-center gap-2 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="md:hidden btn btn-ghost btn-circle btn-sm -ml-2 text-gray-600">
          <ChevronLeft size={24} />
        </button>

        <div className="avatar online">
          <div className="w-9 md:w-10 rounded-full border border-lime-200">
            <img src={conversation.avatar} alt={conversation.name}/>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base-content text-sm md:text-base truncate">{conversation.name}</h2>
          <span className="text-lime-600 text-xs font-bold block">● Đang hoạt động</span>
        </div>
      </div>

      {/* Nội dung tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
            <div className={`chat-bubble ${idx % 2 === 0 ? "bg-base-100 text-gray-700" : "bg-lime-500 text-white"} shadow-sm border border-gray-100`}>
              {msg}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="bg-base-100 p-2 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-2 px-4 transition-all focus-within:ring-2 focus-within:ring-lime-100 focus-within:border-lime-300">
          <button className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-lime-600"><ImagePlus size={20} /></button>
          <button className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-lime-600"><Smile size={20} /></button>

          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="input input-ghost w-full focus:bg-transparent border-none focus:outline-none text-gray-700"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleSend}
            className={`btn btn-circle btn-sm border-none shadow-md transition-all ${message.trim() ? 'bg-lime-500 hover:bg-lime-600 text-white' : 'bg-gray-200 text-gray-400'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
