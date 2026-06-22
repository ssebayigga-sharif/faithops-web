/**
 * AuthContext.tsx
 *
 * Provides authentication state (Firebase Auth + user profile from RTDB)
 * to the entire app.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import {
  getFirebaseAuth,
  getFirebaseDatabase,
} from "@/shared/services/firebase";
import type { ChurchRole } from "@/features/auth/types";
import type { ChurchProfile } from "@/features/profile/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AuthState {
  /** Firebase Auth user (null when not authenticated) */
  user: User | null;
  /** Full church profile from RTDB (includes role) */
  userProfile: ChurchProfile | null;
  /** True while initial auth check is running */
  isLoading: boolean;
  /** True while a mutation (login / register / logout) is in flight */
  isProcessing: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    profileData: RegisterProfileData,
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export interface RegisterProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  role?: ChurchRole;
}

// ─── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_STATE: AuthState = {
  user: null,
  userProfile: null,
  isLoading: true,
  isProcessing: false,
  error: null,
};

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const auth = getFirebaseAuth();
  const db = getFirebaseDatabase();

  // ── Fetch profile from RTDB by UID ──────────────────────────────────────────

  const fetchProfile = useCallback(
    async (uid: string): Promise<ChurchProfile | null> => {
      try {
        const snapshot = await get(child(ref(db), `profiles/${uid}`));
        return snapshot.exists() ? (snapshot.val() as ChurchProfile) : null;
      } catch {
        return null;
      }
    },
    [db],
  );

  // ── Refresh the current user's profile ──────────────────────────────────────

  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const profile = await fetchProfile(currentUser.uid);
    setState((prev) => ({ ...prev, userProfile: profile }));
  }, [auth, fetchProfile]);

  // ── Auth state listener ─────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchProfile(firebaseUser.uid);
        setState({
          user: firebaseUser,
          userProfile: profile,
          isLoading: false,
          isProcessing: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          userProfile: null,
          isLoading: false,
          isProcessing: false,
          error: null,
        });
      }
    });
    return unsubscribe;
  }, [auth, fetchProfile]);

  // ── Login ───────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }));
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // Profile is loaded by onAuthStateChanged listener
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Login failed. Please try again.";
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: message,
        }));
        throw err;
      }
    },
    [auth],
  );

  // ── Register ────────────────────────────────────────────────────────────────

  const register = useCallback(
    async (
      email: string,
      password: string,
      profileData: RegisterProfileData,
    ) => {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }));
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const uid = credential.user.uid;
        const now = new Date().toISOString();

        const profile: ChurchProfile = {
          uid,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          middleName: "",
          dateOfBirth: "",
          gender: "",
          nationality: "",
          nationalId: "",
          profilePhotoUrl: "",
          email,
          phone: profileData.phone,
          alternatePhone: "",
          address: "",
          city: "",
          country: "",
          postalCode: "",
          maritalStatus: "",
          spouseName: "",
          numberOfChildren: "",
          emergencyContact: { name: "", relationship: "", phone: "" },
          membershipStatus: "visitor",
          membershipNumber: "",
          dateJoined: now,
          baptismStatus: "",
          baptismDate: "",
          department: "",
          cellGroup: "",
          serviceUnit: "",
          ministryRoles: [],
          spiritualGifts: [],
          occupation: "",
          employer: "",
          role: profileData.role ?? "member",
          createdAt: now,
          updatedAt: now,
        };

        await set(ref(db, `profiles/${uid}`), profile);
        // Profile will be loaded by onAuthStateChanged
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.";
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: message,
        }));
        throw err;
      }
    },
    [auth, db],
  );

  // ── Logout ──────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isProcessing: true, error: null }));
    try {
      await signOut(auth);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed.";
      setState((prev) => ({ ...prev, isProcessing: false, error: message }));
      throw err;
    }
  }, [auth]);

  // ── Reset password ──────────────────────────────────────────────────────────

  const resetPassword = useCallback(
    async (email: string) => {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }));
      try {
        await sendPasswordResetEmail(auth, email);
        setState((prev) => ({ ...prev, isProcessing: false }));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to send reset email.";
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: message,
        }));
        throw err;
      }
    },
    [auth],
  );

  // ── Clear error ─────────────────────────────────────────────────────────────

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ── Value ───────────────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    refreshProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
