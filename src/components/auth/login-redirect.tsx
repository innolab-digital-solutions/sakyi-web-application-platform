"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { isAuthenticated } from '@/lib/auth-utils';
import { Loader2 } from 'lucide-react';

interface LoginRedirectProps {
    children: React.ReactNode;
}

/**
 * Component that handles redirecting authenticated users away from login page
 * This is a lightweight alternative to AuthGuard for the login page
 */
export default function LoginRedirect({ children }: LoginRedirectProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const router = useRouter();
    const { loading: authLoading, isAuthenticated: contextAuthenticated } = useAuth();

    useEffect(() => {
        // Mark as hydrated to prevent hydration mismatches
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Check for token immediately after hydration
        if (isHydrated && hasToken === null) {
            const tokenExists = isAuthenticated();
            setHasToken(tokenExists);

            if (tokenExists) {
                console.log('🚫 LoginRedirect: Token detected, showing loading while validating...');
                setIsRedirecting(true);
            }
        }
    }, [isHydrated, hasToken]);

    useEffect(() => {
        // Only check if user is authenticated and redirect if needed
        // This runs after the auth context has loaded and component is hydrated
        if (isHydrated && hasToken) {
            if (!authLoading) {
                // User has token and auth context is loaded, redirect immediately
                const authenticated = contextAuthenticated || hasToken;
                if (authenticated) {
                    console.log('🚫 LoginRedirect: Authenticated user on login page, redirecting to overview');
                    router.replace('/admin/overview');
                    return;
                } else {
                    // Token exists but user is not authenticated, show login form
                    console.log('🚫 LoginRedirect: Token exists but user not authenticated, showing login form');
                    setIsRedirecting(false);
                }
            }

            // If we have a token but auth context is still loading, wait a bit more
            if (authLoading) {
                // Set a timeout to avoid infinite waiting
                const timeout = setTimeout(() => {
                    // If still loading after timeout, assume not authenticated
                    console.log('⏰ Auth context loading timeout, showing login form');
                    setIsRedirecting(false);
                }, 3000); // 3 second max wait

                return () => clearTimeout(timeout);
            }
        }
    }, [isHydrated, hasToken, authLoading, contextAuthenticated, router]);

    // Always render children on server to prevent hydration mismatch
    // Only show loading screen on client after hydration when we detect a token
    if (!isHydrated) {
        return <>{children}</>;
    }

    // Show loading screen when we detect a token and are validating
    if (isRedirecting) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
                <div className="relative">
                    <div className="absolute -inset-16 animate-pulse bg-gradient-to-tr from-primary/10 via-accent/10 to-blue-300/10 rounded-full blur-xl" />
                    <div className="relative z-10 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-xl px-8 py-7 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-accent/20 to-blue-300/20 blur-lg" />
                            <div className="relative rounded-full p-3 bg-white shadow-sm ring-1 ring-gray-200">
                                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                            </div>
                        </div>

                        <h2 className="text-base font-semibold text-gray-800 tracking-tight">Redirecting to your dashboard</h2>
                        <p className="mt-1.5 text-xs text-gray-500 max-w-xs">
                            You are already signed in. Taking you to the right place.
                        </p>

                        <div className="mt-5 h-1 w-40 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary via-accent to-blue-400 animate-[shimmer_1.2s_ease_infinite]" />
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-150%); }
                        50% { transform: translateX(50%); }
                        100% { transform: translateX(150%); }
                    }
                `}</style>
            </div>
        );
    }

    // Show login form for unauthenticated users
    return <>{children}</>;
}
