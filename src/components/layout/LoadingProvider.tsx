"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LoadingContextType {
    isPageLoaded: boolean;
    setPageLoaded: (loaded: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isPageLoaded: false,
    setPageLoaded: () => { },
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isPageLoaded, setPageLoaded] = useState(false);

    return (
        <LoadingContext.Provider value={{ isPageLoaded, setPageLoaded }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    return useContext(LoadingContext);
}

/**
 * A tiny invisible component that instantly triggers the loaded state
 * as soon as it mounts on the client (which happens immediately after
 * the server finishes sending the HTML).
 */
export function PageLoadTrigger() {
    const { setPageLoaded } = useLoading();

    useEffect(() => {
        // Adding a tiny buffer ensures Framer Motion has mounted
        // its internal layout tracking before we flip the animation switches
        const timer = setTimeout(() => {
            setPageLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [setPageLoaded]);

    return null;
}
