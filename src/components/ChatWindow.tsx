import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './ChatWindow.css';

const messages = [
    { fromMe: false, text: 'Hi there!' },
    { fromMe: true, text: 'Hello 👋' },
    { fromMe: false, text: 'How are you?' },
];

function ChatWindow() {
    return (
        <div className="chat-window">
            <ChatHeader />
            <div className="messages">
                {messages.map((m, i) => (
                    <ChatMessage key={i} fromMe={m.fromMe} text={m.text} />
                ))}
            </div>
            <ChatInput />
        </div>
    );
}

export default ChatWindow;
