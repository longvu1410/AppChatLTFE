import { useEffect, RefObject } from "react";

export const useAutoScroll = (
    endRef: RefObject<HTMLDivElement | null>,
    messageCount: number
) => {
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageCount]);
};
