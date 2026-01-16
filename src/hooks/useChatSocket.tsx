import {SocketClient} from "../services/socketClient";
import {useEffect, useRef, useState} from "react";
import {Conversation} from "../pages/Chat";



export function  useChatSocket(){
    const socketClient = SocketClient.getInstance();
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentUser, setCurrentUser] = useState("");
    const [filterType,setFilterType] = useState<"all"|"1">("all");
    const [onlineMap,setOnlineMap] = useState<Record<string,boolean>>({});
    const [searchText ,setSearchText] = useState("");
    const [errorModal, setErrorModal] = useState<string | null>(null);
    const [pendingSearchUser, setPendingSearchUser] = useState<string | null>(null);
    const pendingSearchUserRef = useRef<string | null>(null);
    const showError = (message:string) => {
        setErrorModal(message);
        setTimeout(() => setErrorModal(null),3000);

    };
    useEffect(() => {
        const user = localStorage.getItem("USER");
        if (user) {

            setCurrentUser(user);
        }

        const handleSocketMessage =(res : any) => {
            if(!res) return;
            const { event,status, data, mes } = res;

            if (status === "error") {
                console.warn(`[${event}]`,mes);
                alert(mes);
                return;
            }
            if (!data) return;

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

                list.forEach(c =>
                    socketClient.checkUserOnline(c.id)
                );
                return;
            }

            // ===== PRIVATE MESSAGE =====
            if (event === "SEND_CHAT") {
                const targetId = data.type === 1
                    ? data.to      // room
                    : data.name;  // private


                setConversations(prev =>
                    prev.map(c =>
                        c.id === targetId
                            ? {
                                ...c,
                                lastMessage: mes,
                                lastTime: Date.now(),
                                unread: currentConversationId === targetId ? 0 : c.unread + 1
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
                return;
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
                return;
            }
            if(event === "CREATE_ROOM" || event === "JOIN_ROOM"){
                const roomName = data.name;
                if(!roomName) return;

                setConversations(prev => {
                    if(prev.some(c => c.id === roomName)) return prev;

                    return[
                        {
                            id: roomName,
                            name:roomName,
                            type:"1",
                            lastMessage:"",
                            lastTime:Date.now(),
                            unread: 0
                        },
                        ...prev
                    ];
                });
                setCurrentConversationId(roomName);
            }
        }

        const off = socketClient.subscribe(handleSocketMessage);

        socketClient.getUserList();
        return off;
    }, [currentConversationId]);

    useEffect(() => {
        const handler = (e:any) => {
            const roomName = e.detail;
            if(!roomName) return;

            setConversations(prev => {
                if(prev.some(c => c.id === roomName)) return prev;
                return[
                    {
                        id: roomName,
                        name: roomName,
                        type:"1",
                        lastMessage:"",
                        lastTime:Date.now(),
                        unread: 0,
                    },
                    ...prev
                ];
            });
            setCurrentConversationId(roomName);
        };
        window.addEventListener("ROOM_CREATED", handler);
        return () => window.removeEventListener("ROOM_CREATED", handler);
    }, []);

    const handleSearchUser = () => {
        const username = searchText.trim();
        if(!username) return;
        setPendingSearchUser(username);
        pendingSearchUserRef.current= username;
        SocketClient.getInstance().checkUserExist(username);
    };

    const handleSelectConversation = (id: string) => {
        setCurrentConversationId(id);
        SocketClient.getInstance().checkUserOnline(id);
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, unread: 0 } : c))
        );
    };
    return{
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
    };

}