'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser } from '@/types';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<AppUser>;
  signUp: (email: string, pass: string, name: string, role?: 'admin' | 'customer') => Promise<AppUser>;
  signOut: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAppUser = useCallback(async (uid: string): Promise<AppUser | null> => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          name: (data.name as string) || 'User',
          email: (data.email as string) || '',
          role: (data.role as AppUser['role']) || 'customer',
          loyaltyPoints: Number(data.loyaltyPoints ?? 0),
          freeItemReady: Boolean(data.freeItemReady),
          orderFrequency: data.orderFrequency || {},
        };
      }
    } catch {
      // Offline fallback: construct temporary profile from current Firebase Auth credentials
      if (auth.currentUser) {
        return {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'User',
          email: auth.currentUser.email || '',
          role: auth.currentUser.email?.toLowerCase().includes('admin') ? 'admin' : 'customer',
          loyaltyPoints: 0,
          freeItemReady: false,
          orderFrequency: {},
        };
      }
    }
    return null;
  }, []);

  const refreshAppUser = useCallback(async () => {
    if (auth.currentUser) {
      const profile = await fetchAppUser(auth.currentUser.uid);
      setAppUser(profile);
    }
  }, [fetchAppUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await fetchAppUser(currentUser.uid);
        setAppUser(profile);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchAppUser]);

  const signIn = async (email: string, pass: string): Promise<AppUser> => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await fetchAppUser(cred.user.uid);
      if (!profile) {
        // Fallback profile if Firestore doc was missing
        const fallback: AppUser = {
          id: cred.user.uid,
          name: cred.user.displayName || email.split('@')[0],
          email,
          role: 'customer',
          loyaltyPoints: 0,
          freeItemReady: false,
          orderFrequency: {},
        };
        await setDoc(doc(db, 'users', cred.user.uid), fallback);
        setAppUser(fallback);
        return fallback;
      }
      setAppUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    name: string,
    role: 'admin' | 'customer' = 'customer'
  ): Promise<AppUser> => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }

      const newAppUser: AppUser = {
        id: cred.user.uid,
        name,
        email,
        role,
        loyaltyPoints: 0,
        freeItemReady: false,
        orderFrequency: {},
      };

      await setDoc(doc(db, 'users', cred.user.uid), newAppUser);
      setAppUser(newAppUser);
      return newAppUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setAppUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        signIn,
        signUp,
        signOut,
        refreshAppUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
