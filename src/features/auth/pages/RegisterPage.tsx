/**
 * RegisterPage.tsx
 *
 * Registration form that creates both a Firebase Auth account and a
 * ChurchProfile node in RTDB.
 */
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import type { ChurchRole } from "@/features/auth/types";

const ROLE_OPTIONS: { value: ChurchRole; label: string }[] = [
  { value: "member", label: "Member" },
  { value: "deacon", label: "Deacon" },
  { value: "elder", label: "Elder" },
  { value: "pastor", label: "Pastor" },
];

const RegisterPage = () => {
  const { register, isProcessing, error, clearError, user } = useAuthContext();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<ChurchRole>("member");
  const [localError, setLocalError] = useState<string | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    try {
      await register(email, password, { firstName, lastName, phone, role });
      navigate("/dashboard");
    } catch {
      // error is set via context state
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">Join your church on FaithOps</p>

        {displayError && <div className="auth-error">{displayError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <label className="auth-field">
              <span>First name</span>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={isProcessing}
              />
            </label>

            <label className="auth-field">
              <span>Last name</span>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={isProcessing}
              />
            </label>
          </div>

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
            <span>Phone</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+256 700 000 000"
              disabled={isProcessing}
            />
          </label>

          <label className="auth-field">
            <span>Church role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as ChurchRole)}
              disabled={isProcessing}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <div className="auth-row">
            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                disabled={isProcessing}
              />
            </label>

            <label className="auth-field">
              <span>Confirm password</span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                disabled={isProcessing}
              />
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={isProcessing}>
            {isProcessing ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="auth-links">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
