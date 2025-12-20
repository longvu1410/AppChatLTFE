import React, { useState } from 'react';
import {Send, ImagePlus, MoreVertical, Smile, ChevronLeft} from 'lucide-react';

interface ChatWindowProps {
    onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({onBack}) => {
    const [message, setMessage] = useState("");

    // Hàm giả lập gửi tin nhắn
    const handleSend = () => {
        if (!message.trim()) return;
        console.log("Đã gửi:", message);
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex-1 flex flex-col bg-[#F8FAF5] h-full relative">
            {/* HEADER */}
            <div className="bg-base-100/80 backdrop-blur-md p-3 md:p-4 flex items-center gap-2 border-b border-gray-100 sticky top-0 z-10">
                <button onClick={onBack} className="md:hidden btn btn-ghost btn-circle btn-sm -ml-2 text-gray-600">
                    <ChevronLeft size={24} />
                </button>

                <div className="avatar online">
                    <div className="w-9 md:w-10 rounded-full border border-lime-200">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt=""/>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base-content text-sm md:text-base truncate">Nhóm Chung</h2>
                    <span className="text-lime-600 text-xs font-bold block">● Đang hoạt động</span>
                </div>

                <button className="btn btn-ghost btn-circle btn-sm hover:bg-lime-100 text-gray-500">
                    <MoreVertical size={20}/>
                </button>
            </div>

            {/* Nội dung tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="chat chat-start">
                    <div className="chat-image avatar"><div className="w-8 rounded-full"><img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt=""/></div></div>
                    <div className="chat-header text-xs text-gray-400 mb-1">Nguyễn Văn A</div>
                    <div className="chat-bubble bg-base-100 text-gray-700 shadow-sm border border-gray-100">Alo alo 1234</div>
                </div>

                {/* Nếu muốn hiển thị tin nhắn vừa gõ (Fake), sau này xử lý mảng ở đây */}
                <div className="chat chat-end">
                    <div className="chat-bubble bg-lime-500 text-white shadow-md">Nghe rõ trả lời!</div>
                    <div className="chat-footer opacity-50 text-[10px] mt-1">Đã xem</div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4">
                <div className="bg-base-100 p-2 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-2 px-4 transition-all focus-within:ring-2 focus-within:ring-lime-100 focus-within:border-lime-300">
                    <button className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-lime-600"><ImagePlus size={20} /></button>
                    <button className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-lime-600"><Smile size={20} /></button>

                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="input input-ghost w-full focus:bg-transparent border-none focus:outline-none text-gray-700"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button onClick={handleSend} className={`btn btn-circle btn-sm border-none shadow-md transition-all ${message.trim() ? 'bg-lime-500 hover:bg-lime-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};