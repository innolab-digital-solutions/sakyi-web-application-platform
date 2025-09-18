"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { isAuthenticated, handleAuthRedirect } from '@/lib/auth-utils';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 * AuthGuard component that handles client-side authentication routing
 * This works alongside the middleware for comprehensive protection
 */
export default function AuthGuard({
    children,
    requireAuth = true,
    redirectTo
}: AuthGuardProps) {
    const [isChecking, setIsChecking] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { loading: authLoading, isAuthenticated: contextAuthenticated } = useAuth();

    useEffect(() => {
        // Mark as client-side rendered to prevent hydration mismatches
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const checkAuth = async () => {
            // For login page with requireAuth=false, only check if user is already authenticated
            if (!requireAuth && pathname === '/admin/login') {
                // Quick check without waiting for full auth context loading
                const authenticated = isAuthenticated();
                if (authenticated) {
                    console.log('🚫 AuthGuard: Authenticated user on login page, redirecting to overview');
                    router.replace('/admin/overview');
                    return;
                }
                // If not authenticated, show login page immediately
                setIsChecking(false);
                return;
            }

            // For protected routes, check authentication status
            const hasToken = isAuthenticated();

            // If no token, redirect immediately without waiting for auth context
            if (requireAuth && !hasToken) {
                const loginUrl = redirectTo || '/admin/login';
                console.log(`🔒 AuthGuard: No token found, redirecting to: ${loginUrl}`);
                router.replace(loginUrl);
                return;
            }

            // If we have a token, wait for auth context to finish loading for validation
            if (hasToken && authLoading) {
                // Set a timeout to avoid infinite loading
                const timeout = setTimeout(() => {
                    console.log('⏰ AuthGuard: Auth context loading timeout, proceeding with token');
                    setIsChecking(false);
                }, 3000); // 3 second max wait

                return () => clearTimeout(timeout);
            }

            // Auth context finished loading or no token
            if (!authLoading || !hasToken) {
                const authenticated = contextAuthenticated || hasToken;
                const redirectUrl = handleAuthRedirect(pathname);

                console.log('🔍 AuthGuard check:', {
                    pathname,
                    authenticated,
                    requireAuth,
                    redirectUrl,
                    authLoading
                });

                if (redirectUrl) {
                    console.log(`🔄 AuthGuard redirecting to: ${redirectUrl}`);
                    router.replace(redirectUrl);
                    return;
                }

                // If route requires auth but user is not authenticated
                if (requireAuth && !authenticated) {
                    const loginUrl = redirectTo || '/admin/login';
                    console.log(`🔒 AuthGuard: Unauthenticated access to protected route, redirecting to: ${loginUrl}`);
                    router.replace(loginUrl);
                    return;
                }

                setIsChecking(false);
            }
        };

        checkAuth();
    }, [isClient, authLoading, contextAuthenticated, pathname, requireAuth, redirectTo, router]);

    // Show loading while checking authentication
    // Only show loading for protected routes or when actually checking auth
    const shouldShowLoading = !isClient || (isChecking && requireAuth);

    if (shouldShowLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuthGuard<P extends object>(
    Component: React.ComponentType<P>,
    options: { requireAuth?: boolean; redirectTo?: string } = {}
) {
    return function AuthGuardedComponent(props: P) {
        return (
            <AuthGuard requireAuth={options.requireAuth} redirectTo={options.redirectTo}>
                <Component {...props} />
            </AuthGuard>
        );
    };
}

/**
 * Hook for checking authentication status
 */
export function useAuthGuard() {
    const [isChecking, setIsChecking] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { loading: authLoading, isAuthenticated: contextAuthenticated } = useAuth();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const checkAuth = async () => {
            if (authLoading) return;

            const redirectUrl = handleAuthRedirect(pathname);

            if (redirectUrl) {
                router.replace(redirectUrl);
                return;
            }

            setIsChecking(false);
        };

        checkAuth();
    }, [isClient, authLoading, contextAuthenticated, pathname, router]);

    return {
        isChecking: !isClient || isChecking || authLoading,
        isAuthenticated: contextAuthenticated || isAuthenticated(),
        isClient
    };
}
