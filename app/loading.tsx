import { Background } from "@/components/ui/Background";
import Spinner from "@/components/Spinner";

export default function Loading() {
    return <div className="size-full">
        <Background />
        <main className="flex flex-col items-center justify-center size-full">
            <Spinner />
        </main>
    </div>
}
