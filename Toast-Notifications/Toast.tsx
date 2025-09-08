import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

type ToastItem = {
  id: string;
  title?: string;
  message: string;
  variant: Variant;
  duration: number;
  leaving?: boolean;
};

type Ctx = {
  show: (t: ToastInput) => void;
  dismiss: (id: string) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

const makeId = (() => {
  let n = 0;
  return () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? (crypto as any).randomUUID()
      : `${Date.now()}_${++n}`;
})();

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  duration?: number;
}> = ({ children, position = "top-right", duration = 5000 }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((arr) =>
      arr.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );

    const tm = timers.current[id];
    if (tm) {
      window.clearTimeout(tm);
      delete timers.current[id];
    }

    window.setTimeout(() => {
      setToasts((arr) => arr.filter((t) => t.id !== id));
    }, 320);
  }, []);

  const show = useCallback(
    (t: ToastInput) => {
      const id = makeId();
      const item: ToastItem = {
        id,
        title: t.title,
        message: t.message,
        variant: t.variant ?? "info",
        duration: t.duration ?? duration,
      };

      setToasts((prev) => [item, ...prev]);
      timers.current[id] = window.setTimeout(() => dismiss(id), item.duration);
    },
    [duration, dismiss]
  );

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((tm) => window.clearTimeout(tm));
      timers.current = {};
    };
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

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
            className={`${styles.toast} ${styles[t.variant]} ${
              t.leaving ? styles.leaving : styles.entering
            }`}
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
