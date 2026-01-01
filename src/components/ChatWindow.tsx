import React, { useEffect, useRef, useState } from "react";
import { Send, ChevronLeft } from "lucide-react";
import { socketClient } from "../services/socketClient";
import { Conversation } from "../pages/Chat";


interface Message {
    from: string;
    mes: string;
    time?:string;
    id:number| string;
}

interface Props {
    conversation: Conversation;
    currentUser: string;
    onBack: () => void;
}

export const ChatWindow: React.FC<Props> = ({
                                                conversation,
                                                currentUser,
                                                onBack
                                            }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const endRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
        const off = socketClient.onMessage((res) => {
            const { event, data } = res;

            if (event === "SEND_CHAT") {
                if(data.from === conversation.id || data.to === conversation.id){
                    setMessages(prev => [...prev, data]);
                }

            }

            if(event==="GET_PEOPLE_CHAT_MES"){
                const list: Message[] = Array.isArray(data)
                    ? data.map((m:any) => ({
                        from: m.from || m.name,
                        mes:m.mes || m.message || "",
                        time: m.createAt,
                        id: m.id
                    }))
                    :[];
                list.sort((a,b) => Number(a.id)-Number(b.id));
                setMessages(list);

            }
        });
        socketClient.getPeopleChatMes(conversation.id);

        return off;
    }, [conversation.id]);

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"});

    },[messages]);

    const sendMessage = () => {
        if (!text.trim()) return;
        socketClient.sendChat(conversation.id, text);

        const tempId =`temp-${Date.now()}`;

        setMessages(prev => [
            ...prev,
            {from:currentUser, mes:text ,time:new Date().toISOString(),id:tempId }
        ]);
        setText("");

    };
    const getDateLabel = (time:string) => {
        const d = new Date(time);
        return d.toLocaleDateString("vi-VN" ,{
            day:"2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };


    return (
        <div className="flex-1 flex flex-col bg-[#F8FAF5] h-full relative">
            <div className="bg-base-100/10 backdrop-blur-md p-3 md:p-4 flex items-center gap-2 border-b border-gray-100 sticky top-0 z-10">
                <button className="md:hidden btn btn-ghost btn-circle btn-sm -ml-2 text-gray-600" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <div className="avatar online">
                    <div className="w-9 md:w-10 rounded-full border border-lime-200"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base-content text-sm md:text-base truncate">{conversation.name}</h2>
                    <span className="text-lime-600 text-xs font-bold block">Đang hoạt động</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={sendMessage} className="btn btn-cricle btn-sm border-none shadow-md transition-all">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};
