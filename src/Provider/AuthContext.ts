import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { User, UserCredential } from "firebase/auth";

export interface AuthContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  signUpFunc: (email: string, password: string) => Promise<UserCredential>;
  signInFunc: (email: string, password: string) => Promise<UserCredential>;
  signInGoogleFunc: () => Promise<UserCredential>;
  signOutFunc: () => Promise<void>;
  updateProfileFunc: (displayName: string, photoURL: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
