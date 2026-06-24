/**
 * ForgotPasswordPage.tsx
 *
 * Sends a password reset email via Firebase Auth.
 *
 * SECURITY NOTE: We show the "check your email" success state regardless
 * of whether sendPasswordResetEmail actually found a matching account.
 * Firebase returns auth/user-not-found for unregistered emails — surfacing
 * that as a distinct UI state would let an attacker enumerate which
 * emails have accounts. We only show an error for non-enumeration failures
 * (e.g. invalid email format, network error).
 */
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Stack,
  TextInput,
  Button,
  InlineNotification,
  Link as CarbonLink,
  Tile,
} from "@carbon/react";
import { useAuthContext } from "@/features/auth/context/AuthContext";

// Error codes that are safe to surface — they don't reveal account
// existence, just a problem with the request itself.
const NON_ENUMERATING_CODES = new Set([
  "auth/invalid-email",
  "auth/network-request-failed",
  "auth/too-many-requests",
]);

const ForgotPasswordPage = () => {
  const { resetPassword, isProcessing, clearError } = useAuthContext();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      if (NON_ENUMERATING_CODES.has(code)) {
        setFormError(
          code === "auth/invalid-email"
            ? "Please enter a valid email address."
            : "Something went wrong. Please try again in a moment.",
        );
      } else {
        // Treat auth/user-not-found (and anything else) as success from
        // the user's point of view — never confirm or deny account
        // existence.
        setSent(true);
      }
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <Tile className="auth-card">
          <Stack gap={5}>
            <h1 className="auth-card__title">Check your email</h1>
            <p className="auth-card__subtitle">
              If an account exists for <strong>{email}</strong>, we've sent a
              password reset link.
            </p>
            <CarbonLink as={Link} to="/login">
              Back to sign in
            </CarbonLink>
          </Stack>
        </Tile>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Tile className="auth-card">
        <Stack gap={6}>
          <div>
            <h1 className="auth-card__title">Reset password</h1>
            <p className="auth-card__subtitle">
              Enter your email and we'll send you a reset link if an account
              exists.
            </p>
          </div>

          {formError && (
            <InlineNotification
              kind="error"
              title={formError}
              hideCloseButton
              lowContrast
            />
          )}

          <Form onSubmit={handleSubmit}>
            <Stack gap={5}>
              <TextInput
                id="forgot-password-email"
                labelText="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isProcessing}
              />

              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Sending…" : "Send reset link"}
              </Button>
            </Stack>
          </Form>

          <div className="auth-links">
            <CarbonLink as={Link} to="/login">
              Back to sign in
            </CarbonLink>
          </div>
        </Stack>
      </Tile>
    </div>
  );
};

export default ForgotPasswordPage;
