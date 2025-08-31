import React, { useState } from "react";
import { Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import styles from "./ForgotPasswordForm.module.css";

interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => Promise<void> | void;
}

export default function ForgotPasswordForm({
  onSubmit,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!emailValid) {
      setError("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(email.trim());
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
      setSuccess("Reset link sent to your email");
      setEmail("");
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot password?</h1>
        <p className={styles.subtitle}>
          Enter your email to reset your password
        </p>

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
            disabled={!emailValid || loading}
            className={styles.btn}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spin} size={16} /> Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
