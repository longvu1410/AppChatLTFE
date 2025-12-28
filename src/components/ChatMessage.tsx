import React from "react";

interface ChatMessageProps {
  message: {
    sender?: string;
    content: string;
    time?: string;
    isMine?: boolean;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`w-full flex mb-2 ${
        message.isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`rounded-2xl px-3 py-2 max-w-[75%] text-sm shadow ${
          message.isMine
            ? "bg-lime-500 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {!message.isMine && (
          <div className="font-semibold text-xs mb-1">
            {message.sender || "User"}
          </div>
        )}

        <div>{message.content}</div>

        {message.time && (
          <div className="text-[10px] opacity-70 mt-1 text-right">
            {message.time}
          </div>
        )}
      </div>
    </div>
  );
};
