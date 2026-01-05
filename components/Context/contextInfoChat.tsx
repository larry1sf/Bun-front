"use client"
import { Message, Conversation } from "@/types";
import { HOST_SERVER } from "@/app/const";
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react"

const ChatContext = createContext<{
    messages: Message[];
    message: Message | null;
    isLoading: boolean;
    isConversationsLoading: boolean;
    isMessagesLoading: boolean;
    setMessages: Dispatch<SetStateAction<Message[]>>;
    setMessage: Dispatch<SetStateAction<Message | null>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    conversations: Conversation[];
    currentConversationId: string | null;
    setCurrentConversationId: Dispatch<SetStateAction<string | null>>;
    loadConversation: (id: string) => Promise<void>;
    createNewChat: () => void;
    refreshConversations: () => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
}>({
    messages: [],
    message: null,
    isLoading: false,
    isConversationsLoading: true,
    isMessagesLoading: false,
    setMessages: () => { },
    setMessage: () => { },
    setIsLoading: () => { },
    conversations: [],
    currentConversationId: null,
    setCurrentConversationId: () => { },
    loadConversation: async () => { },
    createNewChat: () => { },
    refreshConversations: async () => { },
    deleteConversation: async () => { }
})

export const ChatProvider = ({ initialValue, children }: { initialValue: Message[] | null; children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isConversationsLoading, setIsConversationsLoading] = useState(true)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>(initialValue || [])
    const [message, setMessage] = useState<Message | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

    const refreshConversations = async () => {
        try {
            // Only set loading if we don't have conversations yet (initial load)
            if (conversations.length === 0) setIsConversationsLoading(true);

            const res = await fetch(`${HOST_SERVER}/dashboard/conversations`, { credentials: "include" });
            if (res.ok) setConversations(await res.json());
        } catch (e) {
            console.error("Failed to load conversations", e);
        } finally {
            setIsConversationsLoading(false);
        }
    }

    const loadConversation = async (id: string) => {
        try {
            setIsMessagesLoading(true);
            const res = await fetch(`${HOST_SERVER}/dashboard/conversation?id=${id}`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                setCurrentConversationId(id);
            }
        } catch (e) {
            console.error("Failed to load conversation", e);
        } finally {
            setIsMessagesLoading(false);
        }
    }

    const createNewChat = () => {
        setMessages([]);
        setCurrentConversationId(null);
    }

    useEffect(() => {
        refreshConversations();
    }, [])

    const deleteConversation = async (id: string) => {
        try {
            const res = await fetch(`${HOST_SERVER}/dashboard/conversation?id=${id}`, {
                method: 'DELETE',
                credentials: "include"
            });

            if (res.ok) {
                setConversations(prev => prev.filter(c => c.id !== id));
                if (currentConversationId === id) {
                    createNewChat();
                }
            }
        } catch (e) {
            console.error("Failed to delete conversation", e);
        }
    }

    useEffect(() => {
        if (initialValue)
            setMessages(initialValue)

    }, [initialValue])

    return (
        < ChatContext.Provider value={{ messages, message, isLoading, isConversationsLoading, isMessagesLoading, setIsLoading, setMessages, setMessage, conversations, currentConversationId, setCurrentConversationId, loadConversation, createNewChat, refreshConversations, deleteConversation }} >
            {children}
        </ChatContext.Provider >
    )
}

export const useChat = () => useContext(ChatContext)
