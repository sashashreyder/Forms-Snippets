import { useState, useEffect } from "react";
import styles from "./App.module.css";

type ToastType = "success" | "error" | "warning" | "info" | null;

const App: React.FC = () => {
  const [toast, setToast] = useState<ToastType>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const messages: Record<Exclude<ToastType, null>, string> = {
    success: "Your changes have been saved.",
    error: "Something went wrong.",
    warning: "Please double-check your input.",
    info: "A new version is available.",
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
            onClick={() => setToast("success")}
            className={styles.successBtn}
          >
            Success
          </button>
          <button onClick={() => setToast("error")} className={styles.errorBtn}>
            Error
          </button>
          <button
            onClick={() => setToast("warning")}
            className={styles.warningBtn}
          >
            Warning
          </button>
          <button onClick={() => setToast("info")} className={styles.infoBtn}>
            Info
          </button>
        </div>
      </div>

      {toast && (
        <div className={`${styles.toast} ${styles[toast]}`}>
          <div className={styles.toastContent}>
            <strong className={styles.toastTitle}>
              {toast.charAt(0).toUpperCase() + toast.slice(1)}
            </strong>
            <p className={styles.toastMessage}>{messages[toast]}</p>
          </div>
          <button className={styles.toastClose} onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
