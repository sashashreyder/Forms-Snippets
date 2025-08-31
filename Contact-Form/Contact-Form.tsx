import React, { useState } from "react";
import { User, Mail, MessageSquare, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; message: string }) => Promise<void> | void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formValid = name.trim().length > 1 && emailValid && message.trim().length > 5;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formValid) {
      setError("Please fill in all fields correctly");
      return;
    }

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit({ name: name.trim(), email: email.trim(), message: message.trim() });
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setSuccess("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Contact us</h1>
        <p className={styles.subtitle}>We’d love to hear from you</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.icon} />
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.icon} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="message">Message</label>
            <div className={styles.textareaWrapper}>
              <MessageSquare className={styles.icon} />
              <textarea
                id="message"
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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

          <button type="submit" disabled={!formValid || loading} className={styles.btn}>
            {loading ? (
              <>
                <Loader2 className={styles.spin} size={16} /> Sending...
              </>
            ) : (
              "Send message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
