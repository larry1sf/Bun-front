import { Background } from "@/components/ui/Background";
import Spinner from "@/components/Spinner";

export default function Loading() {
    return <div className="size-full">
        <Background />
        <Spinner />

    </div>
}
