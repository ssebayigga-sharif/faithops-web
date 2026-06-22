import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/AuthContext";

const LoginPage = () => {
  const { login, isProcessing, error, clearError, user } = useAuthContext();
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
      <div className="auth-card">
        <h1 className="auth-card__title">Sign in</h1>
        <p className="auth-card__subtitle">Welcome back to FaithOps</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isProcessing}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isProcessing}
            />
          </label>

          <button type="submit" className="auth-btn" disabled={isProcessing}>
            {isProcessing ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <span className="auth-links__sep">·</span>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
