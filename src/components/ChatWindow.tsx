import React, { useRef, useState } from "react";
import { Send, ChevronLeft } from "lucide-react";
import { Conversation } from "../pages/Chat";
import {useChatMessages} from "../hooks/useChatMessages";
import {useAutoScroll} from "../hooks/useAutoScroll";

interface Props {
    conversation: Conversation;
    currentUser: string;
    onBack: () => void;
    isOnline: boolean;
}


export const ChatWindow : React.FC<Props> = ({
                                                 conversation,
                                                 currentUser,
                                                 onBack,
                                                 isOnline
                                             }) => {
    const [text, setText] = useState("");
    const endRef = useRef<HTMLDivElement | null >(null);

    const {
        messages,
        joined,
        sendMessage,
        joinRoom,
        getDateLabel
} = useChatMessages(conversation, currentUser);

    useAutoScroll(endRef,messages.length);
    const hanldeSend = () =>{
        if(!text.trim()) return;
        sendMessage(text);
        setText("");
    }


    return (
        <div className="flex-1 flex flex-col bg-[#F8FAF5] h-full relative">
            <div className="bg-base-100/10 backdrop-blur-md p-3 md:p-4 flex items-center gap-2 border-b border-gray-100 sticky top-0 z-10">
                <button className="md:hidden btn btn-ghost btn-circle btn-sm -ml-2 text-gray-600" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <div className="relative">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-lime-200 bg-lime-500 flex items-center justify-center text-white font-bold">

                        {conversation.type === "1" ? (
                            <img
                                src="/room.png"
                                alt="room avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-lime-500 text-white w-full h-full flex items-center justify-center font-bold">
                                {conversation.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {conversation.type === "0" && (
                        <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
                            ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                        />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base-content text-sm md:text-base truncate">{conversation.name}</h2>
                    {conversation.type === "0" && (
                    <span
                        className={`text-xs font-bold block ${
                            isOnline ? "text-lime-600" : "text-gray-400"
                        }`}
                    >
            {isOnline ? "Online" : "Offline"}
          </span>
                    )}
                    {conversation.type === "1" && (
                        <span className="text-xs text-gray-400">Nhóm chat</span>
                    )}

                </div>
                {conversation.type === "1" && !joined && (
                    <button
                        onClick={joinRoom}
                        className="btn btn-sm btn-outline"
                    >
                        Tham gia phòng
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        Chưa có tin nhắn nào
                    </div>
                )}
                {messages.map((m, i) => {
                    const isMe = m.from === currentUser;
                    const currentDate = getDateLabel(m.time!);
                    const prevDate =
                        i > 0 ? getDateLabel(messages[i-1].time!): null;
                    const showDateDiver = i === 0 || currentDate !== prevDate;
                    return (
                        <React.Fragment key={m.id}>
                            {showDateDiver && (
                                <div className="flex justify-center my-2">
                                   <span className="text-[11px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                      {currentDate}
                                   </span>
                                </div>
                            )}
                            <div  className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                                 <div className="flex flex-col max-w-xs">

                                {conversation.type === "1" && !isMe && (
                                    <span className="text-[11px] text-gray-500 ml-1 mb-0.5 font-semibold">
                                       {m.from}
                                    </span>
                                )}
                                <div
                                    className={`chat-bubble ${
                                        isMe ? "bg-base-100 text-gray-700" :"bg-lime-500 text-white"
                                    } shadow-sm border border-gray-100`}
                                >
                                    {m.mes}
                                    {m.time && (
                                        <div className="text-[10px] text-gray-400 mt-1 text-right">
                                            {new Date(m.time).toLocaleTimeString([],{hour: "2-digit",minute:"2-digit"})}
                                        </div>
                                    )}
                                </div>
                                </div>
                            </div>

                        </React.Fragment>

                    );
                })}
                <div ref={endRef} />
            </div>

            <div className="p-3 border-t flex gap-2">
                <input
                    className="input input-ghost w-full focus:bg-transparent border-none focus:outline-none text-gray-700"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && hanldeSend()}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={hanldeSend} className="btn btn-circle btn-sm border-none shadow-md transition-all">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};
