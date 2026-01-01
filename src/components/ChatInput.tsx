import React, { useState } from "react";

interface ChatInputProps {
  roomName: string;
  socket: WebSocket | null;
  onSent?: (mes: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  roomName,
  socket,
  onSent,
}) => {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim() || !socket || socket.readyState !== 1) return;

    socket.send(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "SEND_CHAT",
          data: {
            name: roomName,
            mes: text,
          },
        },
      })
    );

    onSent?.(text);
    setText("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white">
      <input
        className="input input-bordered w-full rounded-2xl"
        placeholder="Nhập tin nhắn…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <button
        className="btn bg-lime-500 text-white rounded-2xl"
        onClick={sendMessage}
        disabled={!text.trim()}
      >
        Gửi
      </button>
    </div>
  );
};
