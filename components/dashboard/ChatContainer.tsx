'use client'
import { useChat } from "@/components/Context/contextInfoChat";
import ChatWelcome from "@/components/dashboard/ChatWelcome";
import ChatBubble from "@/components/dashboard/ChatBubble";
import ChatMessageSkeleton from "./ChatMessageSkeleton";

export default function ChatContainer() {
    const { messages, isMessagesLoading } = useChat();
    const hasMessages = messages.length > 0;

    if (isMessagesLoading) {
        return (
            <div className="flex-1 pt-10 pb-0 px-4">
                <div className="max-w-3xl mx-auto space-y-6">
                    <ChatMessageSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 pt-10 pb-0 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                {hasMessages ? <ChatBubble /> : <ChatWelcome />}
            </div>
        </div>
    );
}
