import './ChatSidebar.css';

const users = [
    { id: 1, name: 'Alice', last: 'Hello 👋' },
    { id: 2, name: 'Bob', last: 'How are you?' },
];

function ChatSidebar() {
    return (
        <div className="sidebar">
            <h3>Chats</h3>

            {users.map(u => (
                <div className="chat-user" key={u.id}>
                    <div className="avatar">{u.name[0]}</div>
                    <div>
                        <strong>{u.name}</strong>
                        <p>{u.last}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatSidebar;
