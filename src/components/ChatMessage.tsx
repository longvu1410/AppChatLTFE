import React from "react";
import { Message } from "../hooks/useChatMessages";
import { Conversation } from "../pages/Chat";

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

                return (
                    <React.Fragment key={m.id}>
                        {showDate && (
                            <div className="flex justify-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {getDateLabel(m.time!)}
                </span>
                            </div>
                        )}

                        <div className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                            <div className="flex flex-col max-w-xs">
                                {conversation.type === "1" && !isMe && (
                                    <span className="text-xs text-gray-500 ml-1 mb-1 font-semibold">
                    {m.from}
                  </span>
                                )}

                                <div
                                    className={`chat-bubble ${
                                        isMe
                                            ? "bg-base-100 text-gray-700"
                                            : "bg-lime-500 text-white"
                                    }`}
                                >
                                    {m.mes}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}

            <div ref={endRef} />
        </div>
    );
};
