import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./DonationForm.module.css";

type FormData = {
  name: string;
  email: string;
};

const App: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const onSubmit = (data: FormData) => {
    const finalAmount =
      selectedAmount === "custom"
        ? Number(customAmount || 0)
        : selectedAmount
        ? Number(selectedAmount)
        : 0;

    if (!finalAmount || finalAmount <= 0) {
      setModalMessage("❌ Amount must be greater than 0");
      return;
    }

    const donorName = data.name?.trim() || "";
    setModalMessage(
      donorName
        ? `Thank you, ${donorName}, for your donation ❤️`
        : "Thank you for your donation ❤️"
    );
  };

  useEffect(() => {
    if (modalMessage) {
      const t = setTimeout(() => setModalMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [modalMessage]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (customModalOpen) setCustomModalOpen(false);
        if (modalMessage) setModalMessage(null);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [customModalOpen, modalMessage]);

  return (
    <>
      <div className={styles.container}>
        <p className={styles.note}>
          💡 Demo only: Payments are not processed. In a real app, this form
          should be connected to a payment gateway (Stripe, PayPal, etc.).
        </p>
        <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.title}>❤️ Support Our Mission</h2>

          <div className={styles.amounts}>
            {["10", "25", "50", "100"].map((amt) => (
              <button
                type="button"
                key={amt}
                className={`${styles.amountOption} ${
                  selectedAmount === amt ? styles.selected : ""
                }`}
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount("");
                }}
              >
                ${amt}
              </button>
            ))}
            <button
              type="button"
              className={`${styles.amountOption} ${
                selectedAmount === "custom" ? styles.selected : ""
              }`}
              onClick={() => setCustomModalOpen(true)}
            >
              {selectedAmount === "custom" && customAmount
                ? `$${customAmount}`
                : "Custom"}
            </button>
          </div>

          <input
            {...register("name")}
            placeholder="Your Name"
            className={styles.input}
          />
          <input
            {...register("email")}
            type="email"
            placeholder="Your Email"
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Donate Now
          </button>
        </form>
      </div>

      {modalMessage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalMessage(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className={styles.modalTitle}>
              {modalMessage.startsWith("❌") ? "Error" : "Success"}
            </h3>
            <p className={styles.modalText}>{modalMessage}</p>
            <button
              className={styles.modalButton}
              onClick={() => setModalMessage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {customModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setCustomModalOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className={styles.modalClose}
              onClick={() => setCustomModalOpen(false)}
              aria-label="Close"
            >
              ✖
            </button>
            <h3 className={styles.modalTitle}>Enter Custom Amount</h3>
            <div className={styles.modalContent}>
              <input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className={styles.input}
                min={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!customAmount || Number(customAmount) <= 0) return;
                    setSelectedAmount("custom");
                    setCustomModalOpen(false);
                  }
                }}
              />
              <button
                className={styles.modalButton}
                onClick={() => {
                  if (!customAmount || Number(customAmount) <= 0) return;
                  setSelectedAmount("custom");
                  setCustomModalOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
