import { useEffect, useState } from "react";

export const useCountdown = (seconds?: number, running?: boolean) => {
    const [remaining, setRemaining] = useState<number | undefined>(seconds);

    useEffect(() => {
        if (!seconds) return setRemaining(undefined);
        setRemaining(seconds);
    }, [seconds]);

    useEffect(() => {
        if (!seconds || !running) return;
        setRemaining(seconds);
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - start) / 1000);
            const next = Math.max(seconds - elapsed, 0);
            setRemaining(next);
            if (next <= 0) clearInterval(interval);
        }, 250);
        return () => clearInterval(interval);
    }, [seconds, running]);

    return remaining;
};