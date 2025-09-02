import React, { useState } from "react";
import styles from "./DonationForm.module.css";
import { Heart } from "lucide-react";

const presetAmounts = [10, 25, 50, 100];

const App: React.FC = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSelectAmount = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = amount || Number(customAmount);
    alert(`Thank you ${name}! You donated $${finalAmount}.`);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          <Heart className={styles.redHeart} fill="#ef4444" /> Support Our
          Mission
        </h2>

        <div className={styles.amounts}>
          {presetAmounts.map((val) => (
            <button
              key={val}
              type="button"
              className={`${styles.amountBtn} ${
                amount === val ? styles.active : ""
              }`}
              onClick={() => handleSelectAmount(val)}
            >
              ${val}
            </button>
          ))}
          <input
            type="number"
            placeholder="Custom"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className={styles.customInput}
          />
        </div>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.submitBtn}>
          Donate Now
        </button>
      </form>
    </div>
  );
};

export default App;
