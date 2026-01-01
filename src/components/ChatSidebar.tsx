import React, { useState } from "react";
import "./ChatSidebar.css";

export interface ChatUser {
  id: number;
  name: string;
  last: string;
}

interface ChatSidebarProps {
  users?: ChatUser[];
  onSelect?: (user: ChatUser) => void;
}

const defaultUsers: ChatUser[] = [
  { id: 1, name: "Alice", last: "Hello 👋" },
  { id: 2, name: "Bob", last: "How are you?" },
];

function ChatSidebar({ users = defaultUsers, onSelect }: ChatSidebarProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleSelect = (u: ChatUser) => {
    setActiveId(u.id);
    onSelect?.(u);
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Chats</h3>

      {users.map((u) => (
        <div
          key={u.id}
          className={`chat-user ${activeId === u.id ? "active" : ""}`}
          onClick={() => handleSelect(u)}
        >
          <div className="avatar">{u.name[0]}</div>

          <div className="chat-info">
            <strong>{u.name}</strong>
            <p>{u.last}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatSidebar;
