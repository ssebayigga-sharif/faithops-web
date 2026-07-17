import { useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Grid,
  Column,
  Stack,
  Button,
  TextInput,
  InlineNotification,
} from "@carbon/react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email.trim());
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError(err?.message ?? "Failed to send reset email.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Grid className="auth-page__grid" fullWidth>
        <Column sm={4} md={4} lg={6} xlg={6}>
          <div className="auth-page__brand">
            <h1>FaithOps</h1>
            <p className="auth-page__tagline">
              Church management platform for Kabulengwa SDA Church
            </p>
          </div>
        </Column>

        <Column sm={4} md={4} lg={6} xlg={6}>
          <div className="auth-page__card">
            <Stack gap={6}>
              <div>
                <h2 className="auth-page__title">Reset password</h2>
                <p className="auth-page__subtitle">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <InlineNotification
                  kind="error"
                  lowContrast
                  title="Error"
                  subtitle={error}
                  onClose={() => setError(null)}
                />
              )}

              {message && (
                <InlineNotification
                  kind="success"
                  lowContrast
                  title="Success"
                  subtitle={message}
                  onClose={() => setMessage(null)}
                />
              )}

              <form onSubmit={handleSubmit}>
                <Stack gap={5}>
                  <TextInput
                    id="reset-email"
                    labelText="Email address"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />

                  <Button
                    kind="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="auth-page__submit"
                  >
                    {isSubmitting ? "Sending..." : "Send reset link"}
                  </Button>
                </Stack>
              </form>

              <div className="auth-page__divider">
                <RouterLink to="/login" className="auth-page__link">
                  Back to sign in
                </RouterLink>
              </div>
            </Stack>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
