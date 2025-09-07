import debounce from '@/utils/debounce';
import throttle from '@/utils/throttle';
import { useEffect, useRef, useState } from 'react';

export enum ScrollDirection {
    up = 'up',
    down = 'down',
    none = 'none',
}

/**
 * A hook allowing consuming components to detect the direction of the user's scrolling
 *
 * @param throttleMs the number of milliseconds for the scroll handler cooldown; limits the frequency of scroll handler execution
 * @param idleMs the number of milliseconds after which to consider the user's scroll behavior as idle (ScrollDirection.none)
 *
 * @returns the direction of the user's scrolling
 */
export default function useScrollDirection(throttleMs = 150, idleMs = 300) {
    const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(ScrollDirection.none);
    const lastYPosition = useRef<number | null>(null);
    const idleHandler = useRef(debounce(() => {
        setScrollDirection(ScrollDirection.none);
    }, idleMs));

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handler = throttle(() => {
            const currentY = window.scrollY;

            if (lastYPosition.current === null) {
                lastYPosition.current = window.scrollY;
            }

            setScrollDirection(currentY >= lastYPosition.current ? ScrollDirection.down : ScrollDirection.up);

            lastYPosition.current = currentY;
            idleHandler.current();
        }, throttleMs);

        window.addEventListener('scroll', handler, { passive: true });

        return () => {
            window.removeEventListener('scroll', handler);
        }
    }, [throttleMs]);

    return scrollDirection;
}
