import React, {useEffect, useState} from "react";
import {Sidebar} from "../components/Sidebar";
import {ChatWindow} from "../components/ChatWindow";
import {CreateGroupModal} from "../components/CreateGroupModal";
import {useNavigate} from "react-router-dom";
import {WelcomeScreen} from "../components/WelcomeScreen";
import { socketClient } from "../services/socketClient";

interface Conversation {
    id: string;
    name: string;
    avatar?: string;
    type: "1"|"0";
    lastMessage?: string;
    lastTime: number;
    unread: number;
}

const ChatPage: React.FC = () => {

    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const navigate = useNavigate();
    const [filterType,setFilterType] = useState<"all"|"1">("all");
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("USER");
        if (!user) {
            navigate("/login");
            return;
        }
        setCurrentUser(user);
        const off = socketClient.onMessage((res) => {
            const { event, data } = res;

            // ===== USER LIST =====
            if (event === "GET_USER_LIST") {
                const list: Conversation[] = data .map((u: any) => ({
                    id: u.name,
                    type: u.type === 0 ? "0" :"1",
                    name: u.name,
                    lastMessage: "",
                    lastTime:new Date(u.actionTime).getTime(),
                    unread: 0
                }));
                setConversations(list);
            }

            // ===== PRIVATE MESSAGE =====
            if (event === "SEND_CHAT") {
                const { from, mes } = data;

                setConversations(prev =>
                    prev.map(c =>
                        c.id === from
                            ? {
                                ...c,
                                lastMessage: mes,
                                lastTime: Date.now(),
                                unread: currentConversationId === from ? 0 : c.unread + 1
                            }
                            : c
                    )
                );
            }
        });

        socketClient.getUserList();
        return off;

    }, [currentConversationId]);

    const handleSelectConversation = (id: string) => {
        setCurrentConversationId(id);
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, unread: 0 } : c))
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("USER");
        navigate("/login");
    };

    const fileredConversations = conversations.filter(c => {
        if(filterType === "all") return true;
        return c.type === filterType;
    });

    return (
        <div className="flex h-screen overflow-hidden relative font-sans text-gray-800">
            <div className={`${currentConversationId ? "hidden" : "flex"} md:flex w-full md:w-80 h-full`}>
                <Sidebar
                    conversations={fileredConversations}
                    selectedId={currentConversationId}
                    onSelectConversation={handleSelectConversation}
                    onLogout={handleLogout}
                    currentUser={currentUser}
                    onOpenCreateGroup={() => {}}
                    filterType={filterType}
                    setFilterType={setFilterType}
                />
            </div>

            <div className={`${!currentConversationId ? "hidden" : "flex"} md:flex flex-1 h-full`}>
                {currentConversationId ? (
                    <ChatWindow
                        conversation={conversations.find(c => c.id === currentConversationId)!}
                        currentUser={currentUser}
                        onBack={() => setCurrentConversationId(null)}
                    />

                ) : (
                    <WelcomeScreen/>
                )}
            </div>


        </div>
    );
};

export default ChatPage;
