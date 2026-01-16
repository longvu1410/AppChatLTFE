import React, { useRef, useState } from "react";
import { Conversation } from "../pages/Chat";
import {useChatMessages} from "../hooks/useChatMessages";
import {useAutoScroll} from "../hooks/useAutoScroll";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface Props {
    conversation: Conversation;
    currentUser: string;
    onBack: () => void;
    isOnline: boolean;
}


export const ChatWindow : React.FC<Props> = ({
                                                 conversation,
                                                 currentUser,
                                                 onBack,
                                                 isOnline
                                             }) => {
    const [text, setText] = useState("");
    const endRef = useRef<HTMLDivElement | null >(null);

    const {
        messages,
        joined,
        sendMessage,
        joinRoom,
        getDateLabel
    } = useChatMessages(conversation, currentUser);

    useAutoScroll(endRef,messages.length);
    const hanldeSend = () =>{
        if(!text.trim()) return;
        sendMessage(text);
        setText("");
    }


    return (
        <div className="flex-1 flex flex-col bg-[#F8FAF5] h-full relative">
            <ChatHeader
                conversation={conversation}
                isOnline={isOnline}
                joined={joined}
                onBack={onBack}
                onJoinRoom={joinRoom}
            />

            <ChatMessages
                messages={messages}
                currentUser={currentUser}
                getDateLabel={getDateLabel}
                endRef={endRef}
                conversation={conversation}
            />

            <ChatInput onSend={sendMessage} />
        </div>
    );
};
