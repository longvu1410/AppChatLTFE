import React, { useEffect, useState ,useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { useNavigate } from "react-router-dom";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { socketClient } from "../services/socketClient";

export interface Conversation {
    id: string;
    type: "1" | "0";
    name: string;
    lastMessage?: string;
    lastTime: number;
    unread: number;
    avatar?: string;
}

const ChatPage: React.FC = () => {
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentUser, setCurrentUser] = useState("");
    const [filterType,setFilterType] = useState<"all"|"1">("all");
    const navigate = useNavigate();
    const [onlineMap,setOnlineMap] = useState<Record<string,boolean>>({});
    const [searchText ,setSearchText] = useState("");
    const [searchingUser,setSearchingUser] = useState<string| null >(null);
    const [errorModal, setErrorModal] = useState<string | null>(null);
    const [pendingSearchUser, setPendingSearchUser] = useState<string | null>(null);
    const pendingSearchUserRef = useRef<string | null>(null);
    useEffect(() => {
        const user = localStorage.getItem("USER");
        if (!user) {
            navigate("/login");
            return;
        }

        setCurrentUser(user);


        const handleSocketMessage =(res : any) => {
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
                setConversations(prev => {
                    const map = new Map<string , Conversation>();
                    prev.forEach(c => map.set(c.id,c));

                    list.forEach(c => {
                        map.set(c.id,{
                            ...map.get(c.id),
                            ...c
                        });
                    });
                    return Array.from(map.values());
                });

                list.forEach(c => {
                    socketClient.checkUserOnline(c.id);
                });
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
            if(event === "CHECK_USER_ONLINE"){
                const username =  pendingSearchUserRef.current ?? data.username;
                if(!username) return;

                setOnlineMap(prev => ({
                    ...prev,[username] :data.status
                }));
                if(pendingSearchUserRef.current){
                    setConversations(prev => {
                        const exists = prev.some(c => c.id === username);
                        if (exists) return prev;
                        return [
                            {
                                id: username,
                                name : username,
                                type: "0",
                                lastMessage:"",
                                lastTime: Date.now(),
                                unread: 0,
                                avatar:undefined
                            },
                            ...prev
                        ];
                    });

                    setCurrentConversationId(username);
                    pendingSearchUserRef.current = null;
                }
            }

            if(event === "CHECK_USER_EXIST"){
                const username = pendingSearchUserRef.current;
                if(!username) return;

                if(data.status === false){
                    showError("user không tồn tại ");
                    setPendingSearchUser(null);
                    pendingSearchUserRef.current = null;
                    return;
                }

                socketClient.checkUserOnline(username);
            }
        }

        setCurrentUser(user);

        const off = socketClient.onMessage(handleSocketMessage);
        socketClient.getUserList();
        return off;
    }, [navigate]);

    const showError = (message:string) => {
        setErrorModal(message);
        setTimeout(() => setErrorModal(null),3000);

    };

    const handleSearchUser = () => {
        const username = searchText.trim();
        if(!username) return;
        setPendingSearchUser(username);
        pendingSearchUserRef.current= username;
        socketClient.checkUserExist(username);
    };

    const handleSelectConversation = (id: string) => {
        setCurrentConversationId(id);
        socketClient.checkUserOnline(id);
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, unread: 0 } : c))
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("USER");
        navigate("/login");
    };

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
                    onLogout={handleLogout}
                    currentUser={currentUser}
                    onOpenCreateGroup={() => {}}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    onlineMap={onlineMap}
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
                        onBack={() => setCurrentConversationId(null)}

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
                            onClick={() => setErrorModal(null)}
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
