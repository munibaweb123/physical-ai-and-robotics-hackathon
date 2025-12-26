import { authClient } from '@site/src/lib/auth-client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Session, User } from 'better-auth';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = async () => {
        setIsLoading(true);
        try {
            // First check localStorage for token-based auth (works cross-domain!)
            const authToken = localStorage.getItem('auth_token');
            const authUser = localStorage.getItem('auth_user');
            const tokenExpiry = localStorage.getItem('auth_token_expiry');

            if (authToken && authUser && tokenExpiry) {
                const expiryTime = parseInt(tokenExpiry);
                if (Date.now() < expiryTime) {
                    // Token is still valid
                    console.log('✓ Using stored authentication token');
                    const user = JSON.parse(authUser);
                    setUser(user);
                    setSession({ token: authToken } as any);
                    setIsLoading(false);
                    return;
                } else {
                    // Token expired, clear it
                    console.log('⚠️ Authentication token expired');
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    localStorage.removeItem('auth_token_expiry');
                }
            }

            // Fallback to cookie-based session (for same-origin scenarios)
            const { data: sessionData } = await authClient.getSession();
            setUser(sessionData?.user || null);
            setSession(sessionData?.session || null);
        } catch (error) {
            console.error("Error refreshing session:", error);
            setUser(null);
            setSession(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial session fetch
        refreshSession();

        // Subscribe to auth state changes
        const { data: authListener } = authClient.onAuthStateChange((event, session) => {
            console.log(`Auth event: ${event}`, session);
            setSession(session);
            setUser(session?.user ?? null);
        });

        // Cleanup subscription on unmount
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, isLoading, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
