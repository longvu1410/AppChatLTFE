import React, { useEffect, useState ,useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";

import { WelcomeScreen } from "../components/WelcomeScreen";

import { useChatSocket } from "../hooks/useChatSocket";
import { useCurrentUser } from "../hooks/useCurrentUser";

export interface Conversation {
    id: string;
    type: "1" | "0";
    name: string;
    lastMessage?: string;
    lastTime: number;
    unread: number;
    avatar?: string;
}

interface Props {
    onLogout: () => void;
}

const ChatPage: React.FC<Props> = ({onLogout}) => {
    const [joinedRooms, setJoinedRooms] = useState<Record<string, boolean>>({});

    const { currentUser } = useCurrentUser();

    const {
        conversations,
        currentConversationId,
        onlineMap,
        filterType,
        setFilterType,
        searchText,
        setSearchText,
        handleSearchUser,
        handleSelectConversation,
        errorModal,
    } = useChatSocket();


    const fileredConversations = conversations.filter(c => {
        if(!c || !c.id || !c.name) return false;
        if(filterType === "all") return true;
        return c.type === filterType;
    });

    const currentConversation = conversations.find(
        c => c.id === currentConversationId
    );

    return (
        <div className="flex h-screen overflow-hidden">
            <div className={`${currentConversationId ? "hidden" : "flex"} md:flex w-full md:w-80`}>
                <Sidebar
                    conversations={fileredConversations}
                    selectedId={currentConversationId}
                    onSelectConversation={handleSelectConversation}
                    onLogout={onLogout}
                    currentUser={currentUser}
                    onOpenCreateGroup={() => {}}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    onlineMap={onlineMap}
                      joinedRooms={joinedRooms}
                    searchText = {searchText}
                    setSearchText ={setSearchText}
                    onSearchUser={handleSearchUser}


                />
            </div>

            <div className={`${!currentConversationId ? "hidden" : "flex"} md:flex flex-1`}>
                {currentConversation ? (
                    <ChatWindow
                        conversation={currentConversation}
                        currentUser={currentUser}
                        isOnline= {onlineMap[currentConversation.id] ?? false}
                        onBack={() =>  handleSelectConversation("")}
                         onJoinedRoom={(roomId) =>
        setJoinedRooms(prev => ({ ...prev, [roomId]: true }))
                         }
                    />
                ) : (
                    <WelcomeScreen />
                )}
            </div>
            {errorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-2">Lỗi</h2>
                        <p className="text-sm mb-4">{errorModal}</p>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {}}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatPage;
