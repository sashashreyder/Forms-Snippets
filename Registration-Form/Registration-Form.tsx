import React, { useMemo, useState } from "react";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import styles from "./RegistrationForm.module.css";

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

interface RegistrationFormProps {
  onSubmit?: (data: RegistrationData) => Promise<void> | void;
}

const emailRegex =
  /^[\w.!#$%&'*+/=?`{|}~^-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/;

function getPasswordStrength(pw: string) {
  let score = 0;
  const rules = [/.{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/];
  rules.forEach((r) => (score += r.test(pw) ? 1 : 0));
  const percent = (score / rules.length) * 100;
  let label: "Weak" | "Fair" | "Good" | "Strong" = "Weak";
  if (percent >= 80) label = "Strong";
  else if (percent >= 60) label = "Good";
  else if (percent >= 40) label = "Fair";
  return { percent, label };
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pw = useMemo(() => getPasswordStrength(password), [password]);
  const emailValid = emailRegex.test(email);
  const nameValid = name.trim().length >= 2;
  const passwordsMatch = password.length > 0 && password === confirm;
  const formValid =
    nameValid && emailValid && pw.percent >= 40 && passwordsMatch && agree;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formValid) {
      setError("Please check the form fields");
      return;
    }

    try {
      setLoading(true);
      const data: RegistrationData = {
        name: name.trim(),
        email: email.trim(),
        password,
      };
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setSuccess("Account created successfully");
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      setAgree(false);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Sign up to access your workspace.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Full name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.icon} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={!nameValid && name ? styles.invalid : ""}
              />
            </div>
            {!nameValid && name && (
              <p className={styles.errorText}>
                <AlertCircle size={14} /> Name must be at least 2 characters
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.icon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={!emailValid && email ? styles.invalid : ""}
              />
            </div>
            {!emailValid && email && (
              <p className={styles.errorText}>
                <AlertCircle size={14} /> Invalid email format
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.icon} />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={pw.percent < 40 && password ? styles.invalid : ""}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className={styles.eye}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className={styles.strengthBar}>
              <div
                style={{ width: `${pw.percent}%` }}
                className={`${styles.strengthFill} ${styles[pw.label]}`}
              />
            </div>
            <p className={styles.hint}>
              At least 8 characters, uppercase, lowercase, number and symbol.
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm">Confirm password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.icon} />
              <input
                id="confirm"
                type={showConfirmPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={!passwordsMatch && confirm ? styles.invalid : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                className={styles.eye}
              >
                {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!passwordsMatch && confirm && (
              <p className={styles.errorText}>
                <AlertCircle size={14} /> Passwords do not match
              </p>
            )}
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I agree with the <a href="#">Terms</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </span>
          </label>

          {error && (
            <div className={styles.alertError}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className={styles.alertSuccess}>
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          <button
            type="submit"
            disabled={!formValid || loading}
            className={styles.btn}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spin} size={16} /> Creating...
              </>
            ) : (
              "Create account"
            )}
          </button>

          <p className={styles.bottomText}>
            Already have an account? <a href="#">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
