import React, { useEffect, useState } from "react";
import { Search, LogOut, MessageCircle, Moon, UserPlus,Sun } from "lucide-react";
import { Conversation } from "../pages/Chat";
import { SocketClient } from "../services/socketClient";



interface Props {
    conversations: Conversation[];
    selectedId: string | null;
    onSelectConversation: (id: string) => void;
    onOpenCreateGroup: () => void;
    onLogout: () => void;
    currentUser: string;
    filterType:"all"|"1";
    setFilterType:React.Dispatch<React.SetStateAction<"all"|"1">>;
    onlineMap: Record<string,boolean>;
     joinedRooms: Record<string, boolean>;
    searchText:string;
    setSearchText:(v:string) => void;
    onSearchUser:() => void;

}

export const Sidebar: React.FC<Props> = ({
                                             conversations,
                                             selectedId,
                                             onSelectConversation,
                                             onLogout,
                                             currentUser,
                                             filterType,
                                             setFilterType,
                                             onlineMap,
                                              joinedRooms,
                                             searchText,
                                             setSearchText,
                                             onSearchUser

                                         }) => {
    const socketClient = SocketClient.getInstance();
    const [isDark,setIsDark] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    useEffect(() =>{
        const html = document.documentElement;
        if(isDark){
            html.setAttribute('data-theme','dark');
        }else{
            html.setAttribute('data-theme','light');
        }
    },[isDark]);
    return (
        <div className="w-full md:w-80 bg-base-100 border-r border-gray-100 flex-col flex h-screen">
            <div className="flex justify-between items-center mb-2 p-4">
                <h1 className="text-2xl font-black text-lime-600 tracking-tighter flex items-center gap-2">
                    <MessageCircle className="w-8 h-8 fill-lime-600 text-lime-600" />
                    NLUChat</h1>
                <button className="btn btn-circle btn-ghost btn-sm" onClick={() =>setIsDark(!isDark)}>
                    {isDark ? <Moon className="w-6 h-6 text-gray-600"/> : <Sun className="w-6 h-6 text-lime-500"/>}

                </button>
            </div>

            <div className="px-4">
            <div className="mb-4 flex items-center gap-3 bg-lime-50 p-3 rounded-2xl border border-lime-100">
                <div className="avatar placeholder">
                    <div className="bg-lime-500 text-white rounded-full w-10">
            <span className="text-xl font-bold">
              {currentUser.charAt(0).toUpperCase()}
            </span>
                    </div>
                </div>
                <div className="overflow-hidden flex-1">
                    <div className="font-bold text-sm truncate">{currentUser}</div>
                    <div className="text-xs text-lime-600 font-bold" > Online</div>

                </div>
                <button onClick={onLogout} className="btn btn-ghost btn-sm btn-circle text-red-400 hover:bg-red-50">
                    <LogOut size={18} />
                </button>
            </div>
            </div>

           <div className="flex-1 overflow-y-auto space-y-1 min-h-0 pb-2">
    {conversations.map(c => (
        <div
            key={String(c.id)}
            onClick={() => onSelectConversation(c.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                selectedId === c.id
                    ? "bg-lime-50 border border-lime-200 shadow-sm"
                    : "hover:bg-gray-50 border border-transparent"
            }`}
        >
            {/* AVATAR + ONLINE */}
            <div className="relative flex items-center gap-2">
                <div className="avatar placeholder relative">
                    <div className="bg-lime-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        {c.type === "1" ? (
                            <img src="/room.png" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold">
                                {c.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* DOT ONLINE */}
                    <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
                        ${
                            c.type === "1"
                                ? joinedRooms?.[c.id]
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                : onlineMap[c.id]
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                        }`}
                    />
                </div>

                {/* TEXT ONLINE */}
                <span
                    className={`text-[11px] font-semibold ${
                        c.type === "1"
                            ? joinedRooms?.[c.id]
                                ? "text-green-600"
                                : "text-gray-400"
                            : onlineMap[c.id]
                                ? "text-green-600"
                                : "text-gray-400"
                    }`}
                >
                    {c.type === "1"
                        ? joinedRooms?.[c.id]
                            ? "Online"
                            : "Offline"
                        : onlineMap[c.id]
                            ? "Online"
                            : "Offline"}
                </span>
            </div>

            {/* TEXT */}
            <div className="flex-1 min-w-0">
                <div className="font-bold">{c.name}</div>
                <div className="text-xs text-gray-500">
                    {typeof c.lastMessage === "string"
                        ? c.lastMessage
                        : "Chưa có tin nhắn"}
                </div>
            </div>

            {/* UNREAD */}
            {c.unread > 0 && (
                <span className="badge badge-error">{c.unread}</span>
            )}
        </div>
    ))}
</div>

             {showCreateGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-base-100 w-80 rounded-2xl p-5 shadow-xl">
                        <h2 className="text-lg font-bold mb-4 text-lime-600">
                            Tạo nhóm chat
                        </h2>

                        <input
                            type="text"
                            placeholder="Nhập tên nhóm..."
                            className="input input-bordered w-full mb-4 focus:border-lime-500"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                    setShowCreateGroup(false);
                                    setGroupName("");
                                }}
                            >
                                Hủy
                            </button>

                            <button
                                className="btn btn-sm bg-lime-500 hover:bg-lime-600 text-white border-none"
                                disabled={!groupName.trim()}
                                onClick={() => {
                                    socketClient.create(groupName.trim());
                                    window.dispatchEvent(
                                        new CustomEvent("ROOM_CREATED", {
                                            detail: groupName.trim()
                                        })
                                    );
                                    setShowCreateGroup(false);
                                    setGroupName("");
                                }}
                            >
                                Tạo nhóm
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};
