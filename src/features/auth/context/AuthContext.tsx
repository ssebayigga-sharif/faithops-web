import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type AuthError,
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import {
  getFirebaseAuth,
  getFirebaseDatabase,
} from "@/shared/services/firebase";
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
  /** True when login is temporarily blocked after repeated failures */
  isLoginLocked: boolean;
  /** Seconds remaining on the login lockout, for UI display */
  lockoutSecondsRemaining: number;
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
}

const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!PASSWORD_PATTERN.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

// ─── Login throttling ──────────────────────────────────────────────────────────

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 60;

function sanitizeAuthError(
  err: unknown,
  context: "login" | "register" | "reset" | "logout",
): string {
  const code = (err as AuthError)?.code ?? "";

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      // Deliberately identical message for both cases — do not reveal
      // whether the email exists.
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Please choose a stronger password.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default: {
      const fallback: Record<typeof context, string> = {
        login: "Login failed. Please try again.",
        register: "Registration failed. Please try again.",
        reset: "Failed to send reset email.",
        logout: "Logout failed.",
      };
      return fallback[context];
    }
  }
}

// ─── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_STATE: AuthState = {
  user: null,
  userProfile: null,
  isLoading: true,
  isProcessing: false,
  error: null,
  isLoginLocked: false,
  lockoutSecondsRemaining: 0,
};

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const auth = getFirebaseAuth();
  const db = getFirebaseDatabase();

  const failedAttemptsRef = useRef(0);
  const lockoutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLoginLockedRef = useRef(false);

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
        setState((prev) => ({
          ...prev,
          user: firebaseUser,
          userProfile: profile,
          isLoading: false,
          isProcessing: false,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          userProfile: null,
          isLoading: false,
          isProcessing: false,
          error: null,
        }));
      }
    });
    return unsubscribe;
  }, [auth, fetchProfile]);

  // ── Lockout countdown cleanup ────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    };
  }, []);

  const startLockout = useCallback(() => {
    isLoginLockedRef.current = true;
    setState((prev) => ({
      ...prev,
      isLoginLocked: true,
      lockoutSecondsRemaining: LOCKOUT_DURATION_SECONDS,
      error: `Too many failed attempts. Try again in ${LOCKOUT_DURATION_SECONDS}s.`,
    }));

    lockoutTimerRef.current = setInterval(() => {
      setState((prev) => {
        const next = prev.lockoutSecondsRemaining - 1;
        if (next <= 0) {
          if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
          failedAttemptsRef.current = 0;
          isLoginLockedRef.current = false;
          return {
            ...prev,
            isLoginLocked: false,
            lockoutSecondsRemaining: 0,
            error: null,
          };
        }
        return { ...prev, lockoutSecondsRemaining: next };
      });
    }, 1000);
  }, []);

  // ── Login ───────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string) => {
      if (isLoginLockedRef.current) return;

      setState((prev) => ({ ...prev, isProcessing: true, error: null }));
      try {
        await signInWithEmailAndPassword(auth, email, password);
        failedAttemptsRef.current = 0;
        // Profile is loaded by onAuthStateChanged listener
      } catch (err: unknown) {
        failedAttemptsRef.current += 1;
        const message = sanitizeAuthError(err, "login");

        setState((prev) => ({ ...prev, isProcessing: false, error: message }));

        if (failedAttemptsRef.current >= MAX_FAILED_ATTEMPTS) {
          startLockout();
        }
        throw err;
      }
    },
    [auth, startLockout],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      profileData: RegisterProfileData,
    ) => {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setState((prev) => ({ ...prev, error: passwordError }));
        throw new Error(passwordError);
      }

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
          role: "member", // hardcoded — see security note #1
          createdAt: now,
          updatedAt: now,
        };

        await set(ref(db, `profiles/${uid}`), profile);
        // Profile will be loaded by onAuthStateChanged
      } catch (err: unknown) {
        const message = sanitizeAuthError(err, "register");
        setState((prev) => ({ ...prev, isProcessing: false, error: message }));
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
      failedAttemptsRef.current = 0;
    } catch (err: unknown) {
      const message = sanitizeAuthError(err, "logout");
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
        // Note: we intentionally still show success-like UI even on
        // auth/user-not-found at the page level, to avoid email
        // enumeration. See ForgotPasswordPage.
        const message = sanitizeAuthError(err, "reset");
        setState((prev) => ({ ...prev, isProcessing: false, error: message }));
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

// ─── Hook

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
