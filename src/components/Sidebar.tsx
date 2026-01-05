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
                                             searchText,
                                             setSearchText,
                                             onSearchUser

                                         }) => {
    const socketClient = SocketClient.getInstance();
    const [isDark,setIsDark] = useState(false);
    useEffect(() =>{
        const html = document.documentElement;
        if(isDark){
            html.setAttribute('data-theme','dark');
        }else{
            html.setAttribute('data-theme','light');
        }
    },[isDark]);
    return (
        <div className="w-full md:w-80 bg-base-100 border-r border-gray-100 flex-col p-4 h-full">
            <div className="flex justiful-between items-center mb-6 ">
                <h1 className="text-2xl font-black text-lime-600 tracking-tighter flex items-center gap-2">
                    <MessageCircle className="w-8 h-8 fill-lime-600 text-lime-600" />
                    NLUChat</h1>
                <button className="btn btn-cricle btn-ghost btn-sm" onClick={() =>setIsDark(!isDark)}>
                    {isDark ? <Moon className="w-6 h-6 text-gray-600"/> : <Sun className="w-6 h-6 text-lime-500"/>}

                </button>
            </div>

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
                    <div className="text-xs text-lime-600 font-bolđ" > Online</div>

                </div>
                <button onClick={onLogout} className="btn btn-ghost btn-sm btn-circle text-red-400 hover:bg-red-50">
                    <LogOut size={18} />
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <label className="input input-bordered flex items-center gap-2 flex-1 rounded-full h-10 bg-gray-50 focus-within:bg-base-100 focus-within:border-lime-500 transition-all">
                    <Search className="w-4 h-4 text-gray-400"/>
                    <input
                        type="text"
                        className="grow text-sm"
                        placeholder="Tìm kiếm..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) =>{
                            if(e.key === "Enter"){
                                onSearchUser();
                            }
                        }}
                    />
                    <button
                        onClick={onSearchUser}
                        className="btn btn-circle btn-sm bg-lime-500 hover:bg-lime-600 text-white border-none shadow-md"
                        title="nhắn tin vớiuser"
                    >
                        <Search size={18}/>

                    </button>
                </label>
                <button
                    onClick={() => {
                        const name = prompt("Tên phòng:");
                        if (name) {
                            socketClient.create(name);
                            window.dispatchEvent(
                                new CustomEvent("ROOM_CREATED",{detail:name})
                            );
                        }
                    }}
                    className="btn btn-cricle btn-sm bg-lime-500 hover:bg-lime-600 text-white border-none shadow-md"
                    title="Tạo nhóm mới">
                    <UserPlus size={18}/>
                </button>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                <button
                    onClick={() => setFilterType("all")}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition${filterType === "all" ? "bg-white text-black shadow" : "text-gray-500"}`}
                >Tất cả
                </button>
                <button
                    onClick={() => setFilterType("1")}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg ${filterType === "1" ? "bg-white text-black shadow" : "text-gray-500"}`}
                >Nhóm
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
                {conversations.map(c => (
                    <div
                        key={String(c.id)}
                        onClick={() => onSelectConversation(c.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            selectedId === c.id ? "bg-lime-50 border border-lime-200 shadow-sm" : "hover:bg-gray-50 border border-transparent"
                        }`}
                    >
                        <div className="relative flex items-center gap-2">
                            <div className="avatar placeholder relative">
                                <div className="bg-lime-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
      <span className="text-sm font-bold">
        {c.name.charAt(0)?.toUpperCase() ?? "?"}
      </span>
                                </div>

                                {/* DOT ONLINE */}
                                <span
                                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
      ${onlineMap[c.id] ? "bg-green-500" : "bg-gray-400"}`}
                                />
                            </div>

                            {/* TEXT ONLINE */}
                            <span
                                className={`text-[11px] font-semibold ${
                                    onlineMap[c.id] ? "text-green-600" : "text-gray-400"
                                }`}
                            >
    {onlineMap[c.id] ? "Online" : "Offline"}
  </span>
                        </div>



                        <div className="flex-1 min-w-0">
                            <div className="font-bold">{c.name}</div>
                            <div className="text-xs text-gray-500">
                                {typeof c.lastMessage ==="string"
                                    ? c.lastMessage
                                    : "Chưa có tin nhắn"}
                            </div>
                        </div>

                        {c.unread > 0 && (
                            <span className="badge badge-error">{c.unread}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
