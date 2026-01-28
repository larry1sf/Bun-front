import { useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Limpieza si el componente se desmonta
        return () => clearTimeout(timeoutRef.current as NodeJS.Timeout);
    }, []);

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutRef.current as NodeJS.Timeout);          // cancela el anterior
        timeoutRef.current = setTimeout(() => {  // programa el nuevo
            callback(...args);
        }, delay);
    };
}