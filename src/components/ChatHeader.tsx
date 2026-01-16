import { ChevronLeft } from "lucide-react";
import { Conversation } from "../pages/Chat";

interface Props {
    conversation: Conversation;
    isOnline: boolean;
    joined: boolean;
    onBack: () => void;
    onJoinRoom: () => void;
}

export const ChatHeader: React.FC<Props> = ({
                                                conversation,
                                                isOnline,
                                                joined,
                                                onBack,
                                                onJoinRoom
                                            }) => {
    return (
        <div className="bg-base-100 p-3 flex items-center gap-2 border-b sticky top-0 z-10">
            <button
                className="md:hidden btn btn-ghost btn-circle btn-sm"
                onClick={onBack}
            >
                <ChevronLeft size={24} />
            </button>

            <div className="w-10 h-10 rounded-full bg-lime-500 text-white flex items-center justify-center font-bold">
                {conversation.type === "1"
                    ? <img src="/room.png" />
                    : conversation.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
                <div className="font-bold">{conversation.name}</div>
                {conversation.type === "0" && (
                    <div className={`text-xs ${isOnline ? "text-green-600" : "text-gray-400"}`}>
                        {isOnline ? "Online" : "Offline"}
                    </div>
                )}
            </div>

            {conversation.type === "1" && !joined && (
                <button className="btn btn-sm btn-outline" onClick={onJoinRoom}>
                    Tham gia phòng
                </button>
            )}
        </div>
    );
};
