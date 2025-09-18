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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Show login form for unauthenticated users
    return <>{children}</>;
}
