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
import ChurchIcon from "../../../shared/layouts/ChurchIcon";

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
        {/* Left Brand Panel */}
        <Column className="auth-page__brand-col" sm={0} md={4} lg={8} xlg={8}>
          <div className="auth-page__brand-header">
            <div className="auth-page__brand-logo">
              <ChurchIcon size={32} />
            </div>
            <h1 className="auth-page__brand-title">
              <span className="auth-page__brand-name-desktop">FaithOps</span>
              <span className="auth-page__brand-name-mobile">
                Kabulengwa SDA Church
              </span>
            </h1>
          </div>

          <div className="auth-page__brand-content">
            <h2 className="auth-page__tagline">
              Need assistance? We are here to help you get back{" "}
              <strong>online</strong>.
            </h2>
            <p className="auth-page__church-name">
              Kabulengwa Seventh-day Adventist Church
            </p>

            <div className="auth-page__scripture">
              <p className="auth-page__scripture-text">
                "Fear thou not; for I am with thee: be not dismayed; for I am
                thy God: I will strengthen thee; yea, I will help thee..."
              </p>
              <span className="auth-page__scripture-ref">Isaiah 41:10</span>
            </div>
          </div>

          <div className="auth-page__brand-footer">
            <span>© {new Date().getFullYear()} Kabulengwa SDA Church.</span>
            <span>All rights reserved.</span>
          </div>
        </Column>

        {/* Right Form Card Panel */}
        <Column className="auth-page__card-col" sm={4} md={4} lg={8} xlg={8}>
          <div className="auth-page__card">
            <Stack gap={6}>
              <div>
                <h2 className="auth-page__title">Reset password</h2>
                <p className="auth-page__subtitle">
                  Enter your email address below and we'll email you a link to
                  reset your password.
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
