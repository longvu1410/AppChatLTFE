import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { CreateGroupModal } from "../components/CreateGroupModal";
import { useNavigate } from "react-router-dom";
import { WelcomeScreen } from "../components/WelcomeScreen";

interface Conversation {
  id: number;
  name: string;
  msg?: string;
  time?: string;
  isGroup: boolean;
  avatar?: string;
  members?: number[];
}

const ChatPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Đăng xuất");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden relative font-sans text-gray-800">
      <div className={`${currentConversationId ? "hidden" : "flex"} md:flex w-full md:w-80 h-full`}>
        <Sidebar
          onOpenCreateGroup={() => setIsModalOpen(true)}
          selectedId={currentConversationId || 0}
          onSelectConversation={(id) => setCurrentConversationId(id)}
          onLogout={handleLogout}
          conversations={conversations}
        />
      </div>

      <div className={`${!currentConversationId ? "hidden" : "flex"} md:flex flex-1 h-full`}>
        {currentConversationId ? (
         <ChatWindow
  conversation={conversations.find(c => c.id === currentConversationId)!}
  onBack={() => setCurrentConversationId(null)}
/>

        ) : (
          <WelcomeScreen />
        )}
      </div>

      {isModalOpen && (
        <CreateGroupModal
          onClose={() => setIsModalOpen(false)}
          onCreateGroup={(group) => {
            const newGroup: Conversation = {
              id: Date.now(),
              name: group.name,
              members: group.members,
              isGroup: true,
              msg: "Đang nhắn...",
              time: "Vừa xong",
              avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            };
            setConversations(prev => [...prev, newGroup]);
            setCurrentConversationId(newGroup.id);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;
