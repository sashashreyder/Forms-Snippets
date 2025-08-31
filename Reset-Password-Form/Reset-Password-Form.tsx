import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import styles from "./ResetPasswordForm.module.css";

interface ResetPasswordFormProps {
  onSubmit?: (password: string) => Promise<void> | void;
}

export default function ResetPasswordForm({
  onSubmit,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pwValid = password.length >= 8;
  const match = password && password === confirm;
  const formValid = pwValid && match;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formValid) {
      setError("Passwords must match and be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(password);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
      setSuccess("Password successfully reset");
      setPassword("");
      setConfirm("");
    } catch (err: any) {
      setError(err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.subtitle}>Enter your new password</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="password">New password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.icon} />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={!pwValid && password ? styles.invalid : ""}
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
                className={!match && confirm ? styles.invalid : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                className={styles.eye}
              >
                {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
            disabled={!formValid || loading}
            className={styles.btn}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spin} size={16} /> Saving...
              </>
            ) : (
              "Save new password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
