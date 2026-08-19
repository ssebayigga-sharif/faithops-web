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
import { getAuth } from "firebase/auth";
import ChurchIcon from "../../../shared/layouts/ChurchIcon";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email.trim(), password, displayName.trim());
      try {
        const idToken = await getAuth().currentUser?.getIdToken();
        if (idToken && BACKEND_URL) {
          await fetch(`${BACKEND_URL}/api/send-welcome-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              firstName: displayName.trim().split(/\s+/)[0],
            }),
          });
        }
      } catch (welcomeError) {
        console.error("Welcome email failed (non-blocking):", welcomeError);
      }
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
              Connecting our congregation, strengthening our{" "}
              <strong>fellowship</strong>.
            </h2>
            <p className="auth-page__church-name">
              Kabulengwa Seventh-day Adventist Church
            </p>

            <div className="auth-page__scripture">
              <p className="auth-page__scripture-text">
                "And let us consider one another to provoke unto love and to
                good works: Not forsaking the assembling of ourselves
                together..."
              </p>
              <span className="auth-page__scripture-ref">Hebrews 10:24-25</span>
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
                <h2 className="auth-page__title">Create account</h2>
                <p className="auth-page__subtitle">
                  Join the Kabulengwa SDA Church community. Create your account
                  to get started.
                </p>
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
