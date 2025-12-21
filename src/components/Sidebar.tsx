import React, {useState, useEffect} from 'react';
import {Search, LogOut, MessageCircle, Sun, Moon, UserPlus, Users} from 'lucide-react';

// Định nghĩa dữ liệu giả để map ra
const DEMO_CONVERSATIONS = [
    {
        id: 1,
        name: "Nhóm Chung",
        msg: "Đang nhắn...",
        time: "Vừa xong",
        isGroup: true,
        avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
    },
    {
        id: 2,
        name: "Nguyễn Văn A",
        msg: "Ok bác ơi",
        time: "5p",
        isGroup: false,
        avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
    },
    {
        id: 3,
        name: "Trần Thị B",
        msg: "Deadline tới rồi",
        time: "10p",
        isGroup: false,
        avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
    },
];

interface SidebarProps {
    onOpenCreateGroup: () => void;
    selectedId: number;
    onSelectConversation: (id: number) => void;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({onOpenCreateGroup, selectedId, onSelectConversation, onLogout}) => {
    const [activeTab, setActiveTab] = useState<'all' | 'groups'>('all');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
        }
    }, [isDark]);

    // Lọc danh sách theo Tab (Giả lập)
    const filteredList = activeTab === 'all'
        ? DEMO_CONVERSATIONS
        : DEMO_CONVERSATIONS.filter(c => c.isGroup);

    return (
        <div className="flex w-full md:w-80 bg-base-100 border-r border-gray-100 flex-col p-4 h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black text-lime-600 tracking-tighter flex items-center gap-2">
                    <MessageCircle className="w-8 h-8 fill-lime-600 text-lime-600"/>
                    NLUChat
                </h1>
                {/* Toggle Sun/Moon */}
                <button
                    className="btn btn-circle btn-ghost btn-sm"
                    onClick={() => setIsDark(!isDark)}
                >
                    {isDark ? <Moon className="w-6 h-6 text-gray-600"/> : <Sun className="w-6 h-6 text-lime-500"/>}
                </button>
            </div>

            {/* User Info */}
            <div className="mb-4 flex items-center gap-3 bg-lime-50 p-3 rounded-2xl border border-lime-100">
                <div className="avatar placeholder">
                    <div className="bg-lime-500 text-white rounded-full w-10"><span
                        className="text-xl font-bold">A</span></div>
                </div>
                <div className="overflow-hidden flex-1">
                    <div className="font-bold text-sm truncate">long</div>
                    <div className="text-xs text-lime-600 font-bold">● Online</div>
                </div>
                <button onClick={onLogout} className="btn btn-ghost btn-sm btn-circle text-red-400 hover:bg-red-50">
                    <LogOut size={18}/></button>
            </div>

            {/* Search & Add Group */}
            <div className="flex gap-2 mb-4">
                <label
                    className="input input-bordered flex items-center gap-2 flex-1 rounded-full h-10 bg-gray-50 focus-within:bg-base-100 focus-within:border-lime-500 transition-all">
                    <Search className="w-4 h-4 text-gray-400"/>
                    <input type="text" className="grow text-sm" placeholder="Tìm kiếm..."/>
                </label>
                {/* NÚT MỞ MODAL */}
                <button
                    onClick={onOpenCreateGroup}
                    className="btn btn-circle btn-sm bg-lime-500 hover:bg-lime-600 text-white border-none shadow-md"
                    title="Tạo nhóm mới"
                >
                    <UserPlus size={18}/>
                </button>
            </div>

            {/* Tabs Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-base-100 shadow text-lime-600' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setActiveTab('groups')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === 'groups' ? 'bg-base-100 shadow text-lime-600' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                    Nhóm
                </button>
            </div>

            {/* Danh sách Chat (Map từ dữ liệu giả) */}
            <div className="flex-1 overflow-y-auto space-y-1">
                {filteredList.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelectConversation(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            selectedId === item.id
                                ? 'bg-lime-50 border border-lime-200 shadow-sm' // Style khi ĐƯỢC CHỌN
                                : 'hover:bg-gray-50 border border-transparent'  // Style bình thường
                        }`}
                    >
                        <div className="avatar">
                            <div className="w-10 rounded-full">
                                <img src={item.avatar} alt=""/>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div
                                className={`font-bold truncate ${selectedId === item.id ? 'text-lime-700' : 'text-base-content'}`}>
                                {item.name}
                            </div>
                            <div
                                className={`text-xs truncate ${selectedId === item.id ? 'text-lime-600 font-medium' : 'text-gray-500'}`}>
                                {item.msg}
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">{item.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};