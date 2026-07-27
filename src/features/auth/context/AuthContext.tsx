import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/shared/services/firebase";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  /** Sign in with email & password */
  login: (email: string, password: string) => Promise<User>;
  /** Create a new account */
  register: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<User>;
  /** Sign out the current user */
  logout: () => Promise<void>;
  /** Send a password-reset email */
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    });
    return unsubscribe;
  }, []);
  const login = async (email: string, password: string): Promise<User> => {
    const auth = getFirebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };
  const register = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<User> => {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    return cred.user;
  };
  const logout = async (): Promise<void> => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  };
  const resetPassword = async (email: string): Promise<void> => {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  };

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
