import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

import styles from "./LoginForm.module.css";

export type LoginData = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginFormProps {
  onSubmit?: (data: LoginData) => Promise<void> | void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  const formValid = emailValid && password.length >= 6;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!formValid) {
      setError("Введите корректный email и пароль (минимум 6 символов)");
      return;
    }

    try {
      setLoading(true);
      const data: LoginData = { email: email.trim(), password, remember };
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await new Promise((r) => setTimeout(r, 1000)); 
      }
    } catch (err: any) {
      setError(err?.message || "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Access your account</p>

        <form onSubmit={handleSubmit} className={styles.form}>

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
                className={
                  password && password.length < 6 ? styles.invalid : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className={styles.eye}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className={styles.link}>
              Forgot password?
            </a>
          </div>

          {error && (
            <div className={styles.alertError}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!formValid || loading}
            className={styles.btn}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spin} size={16} /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <p className={styles.bottomText}>
            Don’t have an account? <a href="#">Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
}
