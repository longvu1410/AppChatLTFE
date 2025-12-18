import './ChatMessage.css';

function ChatMessage({ fromMe, text }: { fromMe: boolean; text: string }) {
    return (
        <div className={`message ${fromMe ? 'me' : 'other'}`}>
            {text}
        </div>
    );
}

export default ChatMessage;
