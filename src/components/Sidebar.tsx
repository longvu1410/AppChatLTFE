import React, { useState } from "react";
import { Search, UserPlus, LogOut } from "lucide-react";

interface Conversation {
  id: number;
  name: string;
  msg?: string;
  time?: string;
  isGroup: boolean;
  avatar?: string;
}

interface SidebarProps {
  onOpenCreateGroup: () => void;
  selectedId: number;
  onSelectConversation: (id: number) => void;
  onLogout: () => void;
  conversations: Conversation[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenCreateGroup,
  selectedId,
  onSelectConversation,
  onLogout,
  conversations
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "groups">("all");

  const filteredList = activeTab === "all" ? conversations : conversations.filter(c => c.isGroup);

  return (
    <div className="flex w-full md:w-80 bg-base-100 border-r border-gray-100 flex-col p-4 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-lime-600 tracking-tighter">NLUChat</h1>
        <button onClick={onLogout} className="btn btn-circle btn-ghost btn-sm text-red-400 hover:bg-red-50">
          <LogOut size={18} />
        </button>
      </div>

      {/* Search & Add Group */}
      <div className="flex gap-2 mb-4">
        <label className="input input-bordered flex items-center gap-2 flex-1 rounded-full h-10 bg-gray-50">
          <Search className="w-4 h-4 text-gray-400"/>
          <input type="text" className="grow text-sm" placeholder="Tìm kiếm..."/>
        </label>

        <button
          onClick={onOpenCreateGroup}
          className="btn btn-circle btn-sm bg-lime-500 hover:bg-lime-600 text-white border-none shadow-md"
          title="Tạo nhóm mới"
        >
          <UserPlus size={18}/>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1 text-xs font-bold rounded-lg ${activeTab==='all' ? 'bg-base-100 shadow text-lime-600' : 'text-gray-500 hover:bg-gray-200'}`}
        >Tất cả</button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-1 text-xs font-bold rounded-lg ${activeTab==='groups' ? 'bg-base-100 shadow text-lime-600' : 'text-gray-500 hover:bg-gray-200'}`}
        >Nhóm</button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredList.map(item => (
          <div
            key={item.id}
            onClick={() => onSelectConversation(item.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              selectedId === item.id ? 'bg-lime-50 border border-lime-200 shadow-sm' : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={item.avatar} alt="" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold truncate ${selectedId===item.id ? 'text-lime-700':'text-base-content'}`}>{item.name}</div>
              <div className={`text-xs truncate ${selectedId===item.id ? 'text-lime-600 font-medium':'text-gray-500'}`}>{item.msg}</div>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
