import ChatBottomInputArea from "@/components/dashboard/ChatBottomInputArea";
import ChatContainer from "@/components/dashboard/ChatContainer";

export default async function Dashboard() {
    return (
        <main className="size-full relative flex flex-col overflow-y-auto custom-scrollbar">
            <ChatContainer />
            <ChatBottomInputArea />
        </main>
    );
}

