import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * High performance hook to detect mobile devices.
 * Uses useSyncExternalStore for efficient DOM subscription.
 */
export function useIsMobile(): boolean {
    return useSyncExternalStore(
        // 1. Subscription function
        (callback) => {
            const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
            mql.addEventListener('change', callback);
            return () => mql.removeEventListener('change', callback);
        },
        // 2. Function to get the current value (Client-side)
        () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
        // 3. Function for the initial value (Server-side/Hydration)
        () => false
    );
}