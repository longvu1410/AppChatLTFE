import './ChatInput.css';

function ChatInput() {
    return (
        <div className="chat-input">
            <input placeholder="Type a message..." />
            <button>Send</button>
        </div>
    );
}

export default ChatInput;
