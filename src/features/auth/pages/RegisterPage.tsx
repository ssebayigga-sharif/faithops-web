/**
 * RegisterPage.tsx
 *
 * Registration form that creates both a Firebase Auth account and a
 * ChurchProfile node in RTDB.
 *
 * Role is intentionally NOT selectable here. Every account is created as
 * "member" by AuthContext.register; elevated roles are granted later via
 * an admin action. Do not reintroduce a role field on this form — see the
 * security notes in AuthContext.tsx.
 */
import { useMemo, useState, type FormEvent } from "react";
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
import {
  useAuthContext,
  validatePassword,
} from "@/features/auth/context/AuthContext";

const RegisterPage = () => {
  const { register, isProcessing, error, clearError, user } = useAuthContext();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const passwordHint = useMemo(() => validatePassword(password), [password]);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setLocalError(passwordError);
      return;
    }

    try {
      await register(email, password, { firstName, lastName, phone });
      navigate("/dashboard");
    } catch {
      // error is set via context state
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-page">
      <Tile className="auth-card">
        <Stack gap={6}>
          <div>
            <h1 className="auth-card__title">Create account</h1>
            <p className="auth-card__subtitle">Join your church on FaithOps</p>
          </div>

          {displayError && (
            <InlineNotification
              kind="error"
              title={displayError}
              hideCloseButton
              lowContrast
            />
          )}

          <Form onSubmit={handleSubmit}>
            <Stack gap={5}>
              <div className="auth-row">
                <TextInput
                  id="register-first-name"
                  labelText="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  disabled={isProcessing}
                />
                <TextInput
                  id="register-last-name"
                  labelText="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  disabled={isProcessing}
                />
              </div>

              <TextInput
                id="register-email"
                labelText="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isProcessing}
              />

              <TextInput
                id="register-phone"
                labelText="Phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+256 700 000 000"
                disabled={isProcessing}
              />

              {/* Role selector removed deliberately — see file header note. */}

              <div className="auth-row">
                <PasswordInput
                  id="register-password"
                  labelText="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  disabled={isProcessing}
                  helperText={
                    password.length > 0 && passwordHint
                      ? passwordHint
                      : "At least 8 characters, with a letter and a number."
                  }
                  invalid={password.length > 0 && Boolean(passwordHint)}
                  invalidText={passwordHint ?? undefined}
                />

                <PasswordInput
                  id="register-confirm-password"
                  labelText="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  disabled={isProcessing}
                  invalid={
                    confirmPassword.length > 0 && confirmPassword !== password
                  }
                  invalidText="Passwords do not match."
                />
              </div>

              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Creating account…" : "Create account"}
              </Button>
            </Stack>
          </Form>

          <div className="auth-links">
            <span>Already have an account?</span>{" "}
            <CarbonLink as={Link} to="/login">
              Sign in
            </CarbonLink>
          </div>
        </Stack>
      </Tile>
    </div>
  );
};

export default RegisterPage;
