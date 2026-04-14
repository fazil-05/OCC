import React from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const TOKEN_KEY = 'occ-session-token';
const USER_STORAGE_KEY = 'occ-user-data';
const API_URL = 'https://occ-v2-prod.vercel.app';

export type UserMembership = {
  club: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
    coverImage?: string | null;
    description?: string | null;
    theme?: string | null;
    memberCount?: number;
  };
};

export type OccUser = {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  avatar?: string | null;
  bio?: string | null;
  city?: string | null;
  phoneNumber?: string | null;
  graduationYear?: number | null;
  role?: string;
  approvalStatus?: string;
  onboardingComplete?: boolean;
  referralCode?: string | null;
  createdAt?: string;
  memberships: UserMembership[];
  registrations?: any[];
  gigsApplied?: any[];
};

export type RegisterPayload = {
  fullName: string;
  collegeName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  referralCode: string;
  otp: string;
};

type AuthContextValue = {
  user: OccUser | null;
  token: string | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: (from?: 'login' | 'register') => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

/** Build headers that include the stored JWT as a cookie so the Next.js
 *  backend's `cookies().get("occ-token")` can read it. */
function authHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    // Send token both as a Cookie header AND as Authorization
    // The backend reads the cookie, so Cookie header is the correct approach
    headers['Cookie'] = `occ-token=${token}`;
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/** Extract the JWT value from a Set-Cookie response header string like:
 *  "occ-token=eyJhbGci...; Path=/; HttpOnly; ..."
 */
function extractTokenFromSetCookie(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(/occ-token=([^;]+)/);
  return match ? match[1] : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<OccUser | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  // 1. On mount: restore both user data and token from SecureStore
  React.useEffect(() => {
    (async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem(USER_STORAGE_KEY),
          SecureStore.getItemAsync(TOKEN_KEY),
        ]);

        if (storedToken) setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load session', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // 2. After restoring token on mount, refresh profile from backend
  React.useEffect(() => {
    if (ready && token) {
      refreshProfileWithToken(token);
    }
  }, [ready]);

  const refreshProfileWithToken = React.useCallback(async (tok: string) => {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: authHeaders(tok),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          // Merge memberships from stored data if API doesn't return them
          const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
          const storedUser: OccUser | null = stored ? JSON.parse(stored) : null;
          const merged: OccUser = {
            ...data.user,
            memberships: data.user.memberships || storedUser?.memberships || [],
            registrations: data.user.registrations || storedUser?.registrations || [],
            gigsApplied: data.user.gigsApplied || storedUser?.gigsApplied || [],
          };
          setUser(merged);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
        }
      }
    } catch (e) {
      console.log('[auth] refreshProfile error:', e);
    }
  }, []);

    const signIn = React.useCallback(async (email: string, password: string) => {
    try {
      console.log('--- MOBILE APP LOGIN INITIATED ---');
      console.log(`URL: ${API_URL}/api/auth/login`);
      console.log(`Email: '${email}' | Password: '${password}'`);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Extract JWT from Set-Cookie header
      const setCookieHeader =
        response.headers.get('set-cookie') ||
        response.headers.get('Set-Cookie');
      const extractedToken = extractTokenFromSetCookie(setCookieHeader);

      const data = await response.json();
      console.log('--- MOBILE APP LOGIN RESPONSE ---');
      console.log('Response OK:', response.ok);
      console.log('Response JSON:', JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        const userData: OccUser = {
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          collegeName: data.user.collegeName,
          avatar: data.user.avatar ?? null,
          bio: data.user.bio ?? null,
          city: null,
          phoneNumber: null,
          role: data.role,
          approvalStatus: data.approvalStatus,
          memberships: data.user.memberships || [],
        };

        setUser(userData);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

        // Store token if we got one from cookie
        if (extractedToken) {
          setToken(extractedToken);
          await SecureStore.setItemAsync(TOKEN_KEY, extractedToken);
          // Immediately fetch full profile (bio, avatar, city, etc.)
          await refreshProfileWithToken(extractedToken);
        }

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Connection failed. Please check your internet.' };
    }
  }, [refreshProfileWithToken]);

  const register = React.useCallback(async (payload: RegisterPayload) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const setCookieHeader =
        response.headers.get('set-cookie') ||
        response.headers.get('Set-Cookie');
      const extractedToken = extractTokenFromSetCookie(setCookieHeader);

      const data = await response.json();

      if (response.status === 201 && data.success) {
        const userData: OccUser = {
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          collegeName: data.user.collegeName,
          avatar: data.user.avatar ?? null,
          bio: data.user.bio ?? null,
          city: null,
          phoneNumber: null,
          memberships: [],
        };

        setUser(userData);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

        if (extractedToken) {
          setToken(extractedToken);
          await SecureStore.setItemAsync(TOKEN_KEY, extractedToken);
        }

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Connection failed. Please check your internet.' };
    }
  }, []);

  const signInWithGoogle = async (from: 'login' | 'register' = 'login') => {
    try {
      // 1. Construct the Google Start URL with mobile redirect and context
      const returnUrl = Linking.createURL('/');
      const authUrl = `${API_URL}/api/auth/google/start?redirect=mobile&from=${from}&returnTo=${encodeURIComponent(returnUrl)}`;
      
      // 2. Open Web Browser and wait for redirect back to app
      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);
      
      if (result.type === 'success' && result.url) {
        // 3. Extract token from URL (OCC://google-auth?token=...)
        const { queryParams } = Linking.parse(result.url);
        const googleToken = queryParams?.token as string;
        
        if (googleToken) {
          await SecureStore.setItemAsync(TOKEN_KEY, googleToken);
          setToken(googleToken);
          await refreshProfileWithToken(googleToken);
        }
      }
    } catch (err) {
      console.error('Google Sign In Error:', err);
    }
  };

  const signOut = React.useCallback(async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: authHeaders(token),
        });
      }
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error('Logout error', e);
    }
  }, [token]);

  const refreshProfile = React.useCallback(async () => {
    if (token) await refreshProfileWithToken(token);
  }, [token, refreshProfileWithToken]);

  const value = React.useMemo(
    () => ({
      user,
      token,
      ready,
      signIn,
      register,
      signOut,
      refreshProfile,
      signInWithGoogle,
    }),
    [user, token, ready, signIn, register, signOut, refreshProfile, signInWithGoogle],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/** Export authHeaders so other screens can use the token for API calls */
export { authHeaders, API_URL };

/** Helper to resolve relative backend URLs to absolute ones */
export const resolveUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  // Static assets and uploads are hosted on the main website domain
  const base = 'https://www.offcampusclub.com';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};
