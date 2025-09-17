import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./MultiStepForm.module.css";

type FormValues = {
  name: string;
  email: string;
  company: string;
  role: string;
  dates: string;
  resume: FileList;
};

const steps = ["Personal Info", "Experience", "Resume"];

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>();

  const next = async () => {
    const valid = await trigger();
    if (valid) setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Final data:", data);
    alert("Form submitted! 🎉");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.progress}>
          <div
            className={styles.progressFill}
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <h2 className={styles.title}>{steps[step]}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {step === 0 && (
            <>
              <div className={styles.field}>
                <label>Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className={styles.error}>{errors.name.message}</p>
                )}
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className={styles.field}>
                <label>Company</label>
                <input
                  {...register("company", { required: "Company is required" })}
                />
                {errors.company && (
                  <p className={styles.error}>{errors.company.message}</p>
                )}
              </div>
              <div className={styles.field}>
                <label>Role</label>
                <input
                  {...register("role", { required: "Role is required" })}
                />
                {errors.role && (
                  <p className={styles.error}>{errors.role.message}</p>
                )}
              </div>
              <div className={styles.field}>
                <label>Start Date</label>
                <input
                  type="date"
                  {...register("dates", { required: "Start date is required" })}
                />
                {errors.dates && (
                  <p className={styles.error}>{errors.dates.message}</p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <div className={styles.field}>
              <label>Upload Resume (PDF/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("resume", { required: "Resume is required" })}
              />
              {errors.resume && (
                <p className={styles.error}>{errors.resume.message}</p>
              )}
            </div>
          )}

          <div className={styles.buttons}>
            {step > 0 && (
              <button type="button" onClick={prev} className={styles.backBtn}>
                Back
              </button>
            )}
            {step < steps.length - 1 && (
              <button type="button" onClick={next} className={styles.nextBtn}>
                Next
              </button>
            )}
            {step === steps.length - 1 && (
              <button type="submit" className={styles.submitBtn}>
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
