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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err?.message ?? "Login failed. Please try again.");
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
            <p className="auth-page__tagline">Kabulengwa SDA Church</p>
          </div>
        </Column>

        <Column sm={4} md={4} lg={6} xlg={6}>
          <div className="auth-page__card">
            <Stack gap={6}>
              <div>
                <h2 className="auth-page__title">Sign in</h2>
                <p className="auth-page__subtitle">
                  Welcome back! Enter your credentials to continue.
                </p>
              </div>

              {error && (
                <InlineNotification
                  kind="error"
                  lowContrast
                  title="Login failed"
                  subtitle={error}
                  onClose={() => setError(null)}
                />
              )}

              <form onSubmit={handleSubmit}>
                <Stack gap={5}>
                  <TextInput
                    id="login-email"
                    labelText="Email address"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    id="login-password"
                    labelText="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />

                  <div className="auth-page__action-row">
                    <RouterLink
                      to="/forgot-password"
                      className="auth-page__link"
                    >
                      Forgot password?
                    </RouterLink>
                  </div>

                  <Button
                    kind="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="auth-page__submit"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </Stack>
              </form>

              <div className="auth-page__divider">
                <span>Don't have an account?</span>
                <RouterLink to="/signup" className="auth-page__link">
                  Create account
                </RouterLink>
              </div>
            </Stack>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
