import {ImagePlus, Send, Smile} from "lucide-react";
import {useRef, useState} from "react";
import sticker1 from "../assets/stickers/4th-of-july.png";
import sticker2 from "../assets/stickers/4th-of-july (1).png";
import sticker3 from "../assets/stickers/usa.png";
import sticker4 from "../assets/stickers/vietnam.png";
import EmojiPicker from "emoji-picker-react";


// Config Cloudinary
const CLOUD_NAME = "dzpe8iops";
const UPLOAD_PRESET = "chat_app_upload";

const STICKERS = [sticker1, sticker2, sticker3, sticker4];

interface Props {
    onSend: (text: string) => void;
}

export const ChatInput: React.FC<Props> = ({onSend}) => {
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(encodeURIComponent(text));
        setText("");
        setShowEmoji(false);
    };

    const onEmojiClick = (emojiObject: any) => {
        setText((prev) => prev + emojiObject.emoji);
    };

    const sendSticker = (stickerUrl: string) => {
        onSend(`$$STICKER$$${stickerUrl}`);
        setShowEmoji(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            const fileUrl = data.secure_url;

            let messageToSend = "";
            if (file.type.startsWith("image/")) {
                messageToSend = `$$IMG$$${fileUrl}`;
            } else {
                messageToSend = `$$FILE$$${fileUrl}$$NAME$$${file.name}`;
            }

            onSend(messageToSend);

        } catch (error) {
            console.error("Upload error:", error);
            alert("Lỗi upload file!");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="p-4">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload}/>
            {showEmoji && (
                <div className="absolute bottom-20 left-4 z-50 bg-white shadow-xl rounded-xl border border-gray-200 p-2 flex flex-col gap-2">
                    {/* Sticker Tab */}
                    <div className="flex gap-2 overflow-x-auto p-2 border-b">
                        {STICKERS.map((s, i) => (
                            <img
                                key={i} src={s} alt="sticker"
                                className="w-10 h-10 hover:scale-110 cursor-pointer transition"
                                onClick={() => sendSticker(s)}
                            />
                        ))}
                    </div>
                    {/* Emoji Picker */}
                    <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} />
                </div>
            )}
            <div
                className="bg-base-100 p-2 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-2 px-4 transition-all focus-within:ring-2 focus-within:ring-lime-100 focus-within:border-lime-300">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-lime-600"><ImagePlus size={20}/></button>
                <button onClick={() => setShowEmoji(!showEmoji)} className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-lime-600"><Smile size={20}/></button>
                <input
                    className="input input-ghost w-full focus:bg-transparent border-none focus:outline-none text-gray-700"                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder={isUploading ? "Đang tải tin nhắn..." : "Nhập tin nhắn..."}
                    onFocus={() => setShowEmoji(false)}
                    disabled={isUploading}
                />
                <button className="btn btn-circle btn-sm" onClick={handleSend} disabled={isUploading || !text.trim()}>
                    <Send size={18}/>
                </button>
            </div>
        </div>
    );
};
