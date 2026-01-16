import { Send } from "lucide-react";
import { useState } from "react";

interface Props {
    onSend: (text: string) => void;
}

export const ChatInput: React.FC<Props> = ({ onSend }) => {
    const [text, setText] = useState("");

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    return (
        <div className="p-3 border-t flex gap-2">
            <input
                className="input input-ghost w-full"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
            />
            <button className="btn btn-circle btn-sm" onClick={handleSend}>
                <Send size={18} />
            </button>
        </div>
    );
};
