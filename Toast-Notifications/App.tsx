import { useState } from "react";
import styles from "./App.module.css";

type ToastType = "success" | "error" | "warning" | "info";
type Phase = "pre" | "enter" | "leave";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
  phase: Phase;
};

const App: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const messages: Record<ToastType, string> = {
    success: "Your changes have been saved.",
    error: "Something went wrong.",
    warning: "Please double-check your input.",
    info: "A new version is available.",
  };

  const showToast = (type: ToastType) => {
    const id = Math.random().toString(36).slice(2, 9);
    const base: Toast = { id, type, message: messages[type], phase: "pre" };
    setToasts((prev) => [base, ...prev]);
    requestAnimationFrame(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, phase: "enter" } : t))
      );
    });
    setTimeout(() => startDismiss(id), 4000);
  };

  const startDismiss = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, phase: "leave" } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 380);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Toast Notifications</h1>
        <p className={styles.subtitle}>
          Muted, minimal variants to match auth / application forms.
        </p>
        <div className={styles.buttons}>
          <button
            onClick={() => showToast("success")}
            className={styles.successBtn}
          >
            Success
          </button>
          <button
            onClick={() => showToast("error")}
            className={styles.errorBtn}
          >
            Error
          </button>
          <button
            onClick={() => showToast("warning")}
            className={styles.warningBtn}
          >
            Warning
          </button>
          <button onClick={() => showToast("info")} className={styles.infoBtn}>
            Info
          </button>
        </div>
      </div>

      <div className={styles.toastStack}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              styles.toastItem,
              styles[`t_${t.type}`],
              t.phase === "pre"
                ? styles.pre
                : t.phase === "enter"
                ? styles.enter
                : styles.leave,
            ].join(" ")}
          >
            <div className={styles.toastAccent} />
            <div className={styles.toastBody}>
              <div className={styles.toastTitle}>
                {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
              </div>
              <div className={styles.toastMessage}>{t.message}</div>
            </div>
            <button
              className={styles.toastClose}
              onClick={() => startDismiss(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
