import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import type { OccDemoUser } from '@/constants/occ';

const STORAGE_KEY = 'occ-ui-demo-session';

export type RegisterPayload = {
  fullName: string;
  collegeName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthContextValue = {
  user: OccDemoUser | null;
  ready: boolean;
  /** UI-only: never fails; optional fields get defaults. No backend. */
  signIn: (email: string, password: string) => Promise<void>;
  /** UI-only: never fails. No backend. */
  register: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readStoredUser(): Promise<OccDemoUser | null> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user?: OccDemoUser };
    return parsed.user ?? null;
  } catch {
    return null;
  }
}

async function writeStoredUser(user: OccDemoUser | null) {
  try {
    if (!user) {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify({ user }));
  } catch {
    /* Preview on simulator / web — still keep in-memory session */
  }
}

function displayNameFromEmail(email: string) {
  const local = email.includes('@') ? (email.split('@')[0] ?? '') : email;
  if (!local.trim()) return 'Student';
  return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OccDemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const u = await readStoredUser();
      if (!cancelled) {
        setUser(u);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    const e = email.trim() || 'guest@preview';
    const next: OccDemoUser = {
      id: `local-${Date.now()}`,
      fullName: displayNameFromEmail(e),
      email: e,
      collegeName: 'Your college',
      memberships: [
        { club: { id: 'm1', name: 'Music', slug: 'music', icon: '🎵' } },
        { club: { id: 'm2', name: 'Sports', slug: 'sports', icon: '⚽' } },
      ],
    };
    setUser(next);
    await writeStoredUser(next);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const e = payload.email.trim() || 'guest@preview';
    const next: OccDemoUser = {
      id: `local-${Date.now()}`,
      fullName: payload.fullName.trim() || displayNameFromEmail(e),
      email: e,
      collegeName: payload.collegeName.trim() || 'Your college',
      memberships: [],
    };
    setUser(next);
    await writeStoredUser(next);
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    await writeStoredUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const u = await readStoredUser();
    setUser(u);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      signIn,
      register,
      signOut,
      refreshProfile,
    }),
    [user, ready, signIn, register, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
