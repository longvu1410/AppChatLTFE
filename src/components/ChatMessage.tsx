import React from "react";
import {Message} from "../hooks/useChatMessages";
import {Conversation} from "../pages/Chat";

const formatTime = (time: string) => {
    const d = new Date(time);
    return d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};


interface Props {
    messages: Message[];
    currentUser: string;
    getDateLabel: (time: string) => string;
    endRef: React.RefObject<HTMLDivElement | null>;
    conversation: Conversation;
}

export const ChatMessages: React.FC<Props> = ({
                                                  messages,
                                                  currentUser,
                                                  getDateLabel,
                                                  endRef,
                                                  conversation,
                                              }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                    Chưa có tin nhắn nào
                </div>
            )}

            {messages.map((m, i) => {
                const isMe = m.from === currentUser;
                const showDate =
                    i === 0 ||
                    getDateLabel(m.time!) !== getDateLabel(messages[i - 1].time!);

                let content = null;
                const rawMes = m.mes || "";
                let isSticker = false;

                if (rawMes.startsWith("$$STICKER$$")) {
                    isSticker = true;
                    const url = rawMes.replace("$$STICKER$$", "");
                    content = <img src={url} alt="sticker" className="w-24 h-24 object-contain"/>;
                } else if (rawMes.startsWith("$$IMG$$")) {
                    const url = rawMes.replace("$$IMG$$", "");
                    content = (
                        <img
                            src={url} alt="sent image"
                            className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition"
                            onClick={() => window.open(url, '_blank')}
                        />
                    );
                } else if (rawMes.startsWith("$$FILE$$")) {
                    const parts = rawMes.split("$$NAME$$");
                    const url = parts[0].replace("$$FILE$$", "");
                    const fileName = parts[1] || "File đính kèm";
                    content = (
                        <a href={url} target="_blank" rel="noreferrer"
                           className="flex items-center gap-2 text-blue-600 underline hover:text-blue-800">
                            <span className="text-2xl">📄</span> {fileName}
                        </a>
                    );
                } else {
                    try {
                        content = decodeURIComponent(rawMes);
                    } catch {
                        content = rawMes;
                    }
                }

                const bubbleClass = isSticker
                    ? "bg-transparent shadow-none border-none p-0"
                    : (isMe ? "bg-lime-500 text-white" : "bg-base-100 text-gray-700 border border-gray-200");

                return (
                    <React.Fragment key={m.id}>
                        {showDate && (
                            <div className="flex justify-center my-4">
                                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                    {getDateLabel(m.time!)}
                                </span>
                            </div>
                        )}

                        <div className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                            {conversation.type === "1" && !isMe && (
                                <span className="text-xs text-gray-500 ml-1 mb-1 font-semibold">
                                        {m.from}
                                    </span>
                            )}

                            <div className={`chat-bubble ${bubbleClass} break-words whitespace-pre-wrap max-w-[85%] md:max-w-[70%]`}>
                                {content}
                            </div>
                            {m.time && (
                                <div className="chat-footer opacity-50 text-[10px] mt-1">
                                    {formatTime(m.time)}
                                </div>
                            )}
                        </div>
                    </React.Fragment>
                );
            })}

            <div ref={endRef}/>
        </div>
    );
};
