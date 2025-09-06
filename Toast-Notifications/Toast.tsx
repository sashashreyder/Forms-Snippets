import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Toast.module.css";

type Variant = "success" | "error" | "warning" | "info";
type ToastInput = {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
};
type ToastItem = ToastInput & {
  id: string;
  variant: Variant;
  duration: number;
};

type Ctx = { show: (t: ToastInput) => void; dismiss: (id: string) => void };
const ToastCtx = createContext<Ctx | null>(null);
export const useToast = () => {
  const v = useContext(ToastCtx);
  if (!v) throw new Error("useToast must be used inside <ToastProvider>");
  return v;
};

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  max?: number;
}> = ({ children, position = "top-right", max = 4 }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = (id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  const show = (t: ToastInput) => {
    const id = Math.random().toString(36).slice(2, 9);
    const item: ToastItem = {
      id,
      title: t.title,
      message: t.message,
      variant: t.variant ?? "info",
      duration: t.duration ?? 3500,
    };
    setToasts((prev) => {
      const next = [...prev, item];
      return next.slice(Math.max(0, next.length - max));
    });
    timers.current[id] = window.setTimeout(() => dismiss(id), item.duration);
  };

  const value = useMemo(() => ({ show, dismiss }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        className={`${styles.container} ${styles[position]}`}
        role="region"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.variant]}`}
            role="status"
          >
            <div className={styles.accent} />
            <div className={styles.body}>
              {t.title ? <div className={styles.title}>{t.title}</div> : null}
              <div className={styles.message}>{t.message}</div>
            </div>
            <button
              className={styles.close}
              aria-label="Close"
              onClick={() => dismiss(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};
