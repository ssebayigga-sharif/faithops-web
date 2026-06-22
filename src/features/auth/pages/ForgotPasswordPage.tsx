/**
 * ForgotPasswordPage.tsx
 *
 * Sends a password reset email via Firebase Auth.
 */
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/AuthContext";

const ForgotPasswordPage = () => {
  const { resetPassword, isProcessing, error, clearError } = useAuthContext();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      // error is set via context state
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-card__title">Check your email</h1>
          <p className="auth-card__subtitle">
            We sent a password reset link to <strong>{email}</strong>
          </p>
          <Link to="/login" className="auth-btn auth-btn--link">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Reset password</h1>
        <p className="auth-card__subtitle">
          Enter your email and we'll send you a reset link.
        </p>

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

          <button type="submit" className="auth-btn" disabled={isProcessing}>
            {isProcessing ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
