import React, {useState} from 'react';
import {Sidebar} from '../components/Sidebar';
import {ChatWindow} from '../components/ChatWindow';
import {CreateGroupModal} from '../components/CreateGroupModal';
import {useNavigate} from 'react-router-dom';
import {WelcomeScreen} from "../components/WelcomeScreen";

const ChatPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Sau này có API thì xóa token ở đây
        // localStorage.removeItem('token');
        console.log("Đã đăng xuất");
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden relative font-sans text-gray-800">
            <div className={`
                ${currentConversationId ? 'hidden' : 'flex'} 
                md:flex w-full md:w-80 h-full
            `}>
                <Sidebar
                    onOpenCreateGroup={() => setIsModalOpen(true)}
                    selectedId={currentConversationId || 0}
                    onSelectConversation={(id) => setCurrentConversationId(id)}
                    onLogout={handleLogout}
                />
            </div>

            <div className={`
                ${!currentConversationId ? 'hidden' : 'flex'} 
                md:flex flex-1 h-full
            `}>
                {currentConversationId ? (<ChatWindow onBack={() => setCurrentConversationId(null)}/>) : (<WelcomeScreen/>)}
            </div>

            {isModalOpen && (
                <CreateGroupModal onClose={() => setIsModalOpen(false)}/>
            )}
        </div>
    );
};
export default ChatPage;