import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import './Chat.css';

function Chat() {
    return (
        <div className="chat-container">
            <ChatSidebar />
            <ChatWindow />
        </div>
    );
}

export default Chat;
