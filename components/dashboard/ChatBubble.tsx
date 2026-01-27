'use client'
import { useUser } from "@/components/context/contextInfoUser"
import { useChat } from "@/components/context/contextInfoChat"
import { useRef, useEffect } from "react"
import Markdown from "react-markdown"
import Image from "next/image"
import remarkGfm from "remark-gfm"

export default function ChatBubble() {
    const { isLoading, messages, currentConversationId } = useChat()
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const prevConversationIdRef = useRef<string | null>(null);

    useEffect(() => {
        // If the conversation ID has changed, or if it's the first render (prev is null)
        if (currentConversationId !== prevConversationIdRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
            prevConversationIdRef.current = currentConversationId;
        } else {
            // Same conversation, likely a new message streaming in
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [messages, isLoading, currentConversationId])

    return (
        <div className="flex flex-col space-y-6">
            {
                messages?.map(({ role, content }, index) => {
                    return content.map((item, itemIndex) => {
                        const key = `${index}-${itemIndex}`;
                        if (role === 'user') {
                            if ((item.type === 'text' || item.type === 'input_text') &&
                                item.text) {
                                return <ChatBubbleUser key={key} message={item.text} />
                            }
                            if (item.type === 'input_image' && item.image_url) {
                                return <ChatBubbleUser key={key} image_url={item.image_url} />
                            }
                        }
                        if (role === 'assistant') {
                            if (item.type === 'text') {
                                return <ChatBubbleAI key={key} message={item.text} />
                            }
                        }
                        return null;
                    })
                })
            }
            {
                isLoading && <ChatBubbleLoading />
            }
            <div ref={messagesEndRef} style={{ scrollMarginBottom: '200px' }} />
        </div>
    )
}

function ChatBubbleAI({ message }: { message: string }) {
    return (
        <div className="flex items-start space-x-4">
            <div className="hidden w-8 h-8 rounded-lg bg-blue-600 shrink-0 md:flex items-center justify-center text-xs font-bold text-white shadow-lg">M</div>
            <div className="bg-slate-900/80 border border-slate-800/50 px-5 py-4 rounded-2xl rounded-tl-none md:max-w-[85%] max-w-full text-slate-300 leading-relaxed shadow-sm">
                <div className="prose prose-invert text-sm md:text-base">
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                    >
                        {message}
                    </Markdown>
                </div>
            </div>
        </div>
    )
}

function ChatBubbleUser({ message, image_url }: { message?: string, image_url?: string }) {
    const { user } = useUser()
    return (
        <div className="flex items-start flex-row-reverse space-x-4 space-x-reverse">
            <div className="hidden w-8 h-8 rounded-lg bg-slate-800 shrink-0 md:flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">{user?.username?.toUpperCase().charAt(0)}</div>
            <div className="bg-blue-600 px-5 py-4 rounded-2xl rounded-tr-none md:max-w-[85%] max-w-full text-white leading-relaxed shadow-lg shadow-blue-500/10">
                {
                    image_url ? (
                        <div>
                            <Image src={image_url} alt="" width={500} height={500} className="w-full h-auto rounded-xl" />
                            {message}
                        </div>
                    ) :
                        <div className="text-sm md:text-base">
                            {message}
                        </div>
                }
            </div>
        </div>
    )
}

function ChatBubbleLoading() {
    return (
        <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg">M</div>
            <div className="bg-slate-900/80 border border-slate-800/50 px-5 py-4 rounded-2xl rounded-tl-none max-w-[85%] text-slate-300 leading-relaxed shadow-sm flex items-center space-x-1.5 h-[52px]">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
        </div>
    )
}