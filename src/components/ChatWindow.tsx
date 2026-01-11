import React, { useEffect, useRef, useState } from "react";
import { Send, ChevronLeft } from "lucide-react";
import { SocketClient } from "../services/socketClient";
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
    isOnline: boolean;
}

export const ChatWindow: React.FC<Props> = ({
                                                conversation,
                                                currentUser,
                                                onBack,
                                                isOnline
                                            }) => {
    const socketClient = SocketClient.getInstance();
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [joined, setJoined] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);




 useEffect(() => {
        setMessages([]);
        setJoined(false);
        const handleMessage = (res: any) => {
            const { event, data } = res;
            if(!data) return;

            if (event === "SEND_CHAT") {
                if(!data || !data.mes)return;

                const fromUser = data.from || data.name;
                if(!fromUser) return;
                if(fromUser === currentUser) return;
                const isValid =
                    (conversation.type ==="0" &&
                        (data.from === conversation.id ||
                        data.to === conversation.id )) ||
                    (conversation.type === "1" &&
                            data.to === conversation.id)
                if(!isValid) return;

                    const  newMessage = {
                        from : fromUser,
                        mes: data.mes,
                        time: data.createAt || new Date().toISOString(),
                        id: data.id ?? `rt-${Date.now()}`,

                };
                setMessages(prev => [...prev, newMessage]);

            }

            if(event==="GET_PEOPLE_CHAT_MES" && conversation.type=== "0"){
                const list: Message[] = Array.isArray(data)
                    ? data.map((m:any) => ({
                        from: m.from || m.name,
                        mes:m.mes ,
                        time: m.createAt,
                        id: m.id
                    }))
                    :[];
                list.sort((a,b) => Number(a.id)-Number(b.id));
                setMessages(list);
                return

            }

            if (event === "JOIN_ROOM" && conversation.type === "1") {
                setJoined(true);
                SocketClient.getInstance().getRoomChatMes(conversation.id, 1);
                return;
            }

            if (event === "GET_ROOM_CHAT_MES" && conversation.type === "1") {
                const list: Message[] = Array.isArray(data.chatData)
                    ? data.chatData.map((m: any) => ({
                        from: m.name,
                        mes: m.mes,
                        time: m.createAt,
                        id: m.id
                    }))
                    : [];
                list.sort((a,b) => Number(a.id)-Number(b.id));
                setMessages(list);
                return;
            }
        };
        const off = socketClient.subscribe(handleMessage);
        if(conversation.type === "1"){
            socketClient.getPeopleChatMes(conversation.id);
        }

        return off;
    }, [conversation.id,conversation.type]);

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"});

    },[messages]);

    const handleJoinRoom = () => {
        if (joined) return;
        SocketClient.getInstance().joinRoom(conversation.id);
    };

   // ================= SEND MESSAGE =================
    const sendMessage = () => {
        if (!text.trim()) return;

        SocketClient.getInstance().sendChat(
            conversation.type === "1" ? "room" : "people",
            conversation.id,
            text
        );

        // optimistic UI
        setMessages((prev) => [
            ...prev,
            {
                from: currentUser,
                mes: text,
                time: new Date().toISOString(),
                id: `local-${Date.now()}`,
            },
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
                        onClick={handleJoinRoom}
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
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={sendMessage} className="btn btn-circle btn-sm border-none shadow-md transition-all">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};
