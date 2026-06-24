import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Form,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
  Link as CarbonLink,
  Tile,
} from "@carbon/react";
import { useAuthContext } from "@/features/auth/context/AuthContext";

const LoginPage = () => {
  const {
    login,
    isProcessing,
    error,
    clearError,
    user,
    isLoginLocked,
    lockoutSecondsRemaining,
  } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Already authenticated — redirect to dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      // error is set via context state
    }
  };

  return (
    <div className="auth-page">
      <Tile className="auth-card">
        <Stack gap={6}>
          <div>
            <h1 className="auth-card__title">Sign in</h1>
            <p className="auth-card__subtitle">Welcome back to FaithOps</p>
          </div>

          {error && (
            <InlineNotification
              kind={isLoginLocked ? "warning" : "error"}
              title={error}
              hideCloseButton
              lowContrast
            />
          )}

          <Form onSubmit={handleSubmit}>
            <Stack gap={5}>
              <TextInput
                id="login-email"
                labelText="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isProcessing || isLoginLocked}
              />

              <PasswordInput
                id="login-password"
                labelText="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isProcessing || isLoginLocked}
              />

              <Button type="submit" disabled={isProcessing || isLoginLocked}>
                {isLoginLocked
                  ? `Try again in ${lockoutSecondsRemaining}s`
                  : isProcessing
                    ? "Signing in…"
                    : "Sign in"}
              </Button>
            </Stack>
          </Form>

          <div className="auth-links">
            <CarbonLink as={Link} to="/forgot-password">
              Forgot password?
            </CarbonLink>
            <span className="auth-links__sep">·</span>
            <CarbonLink as={Link} to="/register">
              Create account
            </CarbonLink>
          </div>
        </Stack>
      </Tile>
    </div>
  );
};

export default LoginPage;
