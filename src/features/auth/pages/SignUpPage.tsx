import { useState, type FormEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Grid,
  Column,
  Stack,
  Button,
  TextInput,
  InlineNotification,
} from "@carbon/react";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim() || !displayName.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Wrong Password");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email.trim(), password, displayName.trim());
      navigate("/profile");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError(err?.message ?? "Registration failed. Please try again.");
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
            <p className="auth-page__tagline">Kabulengwa SDA Church</p>
          </div>
        </Column>

        <Column sm={4} md={4} lg={6} xlg={6}>
          <div className="auth-page__card">
            <Stack gap={6}>
              <div>
                <h2 className="auth-page__title">Create account</h2>
                <p className="auth-page__subtitle">Sign up.</p>
              </div>

              {error && (
                <InlineNotification
                  kind="error"
                  lowContrast
                  title="Registration failed"
                  subtitle={error}
                  onClose={() => setError(null)}
                />
              )}

              <form onSubmit={handleSubmit}>
                <Stack gap={5}>
                  <TextInput
                    id="signup-name"
                    labelText="Full name"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    id="signup-email"
                    labelText="Email address"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    id="signup-password"
                    labelText="Password"
                    placeholder="At least 6 characters"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    id="signup-confirm-password"
                    labelText="Confirm password"
                    placeholder="Re-enter your password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />

                  <Button
                    kind="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="auth-page__submit"
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </Stack>
              </form>

              <div className="auth-page__divider">
                <span>Already have an account?</span>
                <RouterLink to="/login" className="auth-page__link">
                  Sign in
                </RouterLink>
              </div>
            </Stack>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
