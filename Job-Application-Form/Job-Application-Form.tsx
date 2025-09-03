import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./App.module.css";

const dateField = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" });

const workSchema = z
  .object({
    company: z.string().min(1, "Company required"),
    title: z.string().min(1, "Title required"),
    startDate: dateField,
    endDate: dateField,
    description: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

const eduSchema = z
  .object({
    school: z.string().min(1, "School required"),
    degree: z.string().min(1, "Degree required"),
    startDate: dateField,
    endDate: dateField,
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone number is too short"),
  desiredSalary: z.string().min(1, "Enter your desired salary"),
  resume: z
    .any()
    .refine((f) => f && f.length === 1, "Upload resume")
    .refine(
      (f) =>
        f &&
        f[0] &&
        (f[0].type === "application/pdf" ||
          f[0].name.toLowerCase().endsWith(".docx")),
      "Only PDF or DOCX"
    ),
  workExperience: z
    .array(workSchema)
    .min(1, "Add at least one work experience"),
  education: z.array(eduSchema).min(1, "Add at least one education entry"),
  skills: z.string().min(1, "Enter at least one skill"),
  languages: z.string().min(1, "Enter at least one language"),
  driversLicenses: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

const App: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      desiredSalary: "",
      workExperience: [
        { company: "", title: "", startDate: "", endDate: "", description: "" },
      ],
      education: [{ school: "", degree: "", startDate: "", endDate: "" }],
      skills: "",
      languages: "",
      driversLicenses: [],
    },
  });

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({ control, name: "workExperience" });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "education" });

  const onSubmit = (data: FormValues) => {
    const skillsArray = data.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const languagesArray = data.languages
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    console.log("Submitted:", {
      ...data,
      skills: skillsArray,
      languages: languagesArray,
    });
    alert("Application submitted successfully!");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Job Application</h1>
        <p className={styles.subtitle}>Please fill out the form carefully</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.subCard}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("fullName")}
                className={errors.fullName ? styles.invalid : ""}
              />
              {errors.fullName?.message && (
                <span className={styles.errorText}>
                  {errors.fullName.message.toString()}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Email *</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={errors.email ? styles.invalid : ""}
              />
              {errors.email?.message && (
                <span className={styles.errorText}>
                  {errors.email.message.toString()}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Phone *</label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register("phone")}
                className={errors.phone ? styles.invalid : ""}
              />
              {errors.phone?.message && (
                <span className={styles.errorText}>
                  {errors.phone.message.toString()}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Desired Salary *</label>
              <input
                type="text"
                placeholder="$60,000 / year"
                {...register("desiredSalary")}
                className={errors.desiredSalary ? styles.invalid : ""}
              />
              {errors.desiredSalary?.message && (
                <span className={styles.errorText}>
                  {errors.desiredSalary.message.toString()}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Resume (PDF or DOCX) *</label>
              <input type="file" {...register("resume")} />
              {errors.resume?.message && (
                <span className={styles.errorText}>
                  {errors.resume.message.toString()}
                </span>
              )}
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Work Experience</h2>
          {workFields.map((f, idx) => (
            <div key={f.id} className={styles.subCard}>
              <input
                placeholder="Company"
                {...register(`workExperience.${idx}.company`)}
                className={
                  errors.workExperience?.[idx]?.company ? styles.invalid : ""
                }
              />

              <input
                placeholder="Job Title"
                {...register(`workExperience.${idx}.title`)}
                className={
                  errors.workExperience?.[idx]?.title ? styles.invalid : ""
                }
              />

              <div className={styles.row}>
                <input
                  type="date"
                  min="1950-01-01"
                  max="2030-12-31"
                  placeholder="Start Date"
                  {...register(`workExperience.${idx}.startDate`)}
                />
                <input
                  type="date"
                  min="1950-01-01"
                  max="2030-12-31"
                  placeholder="End Date"
                  {...register(`workExperience.${idx}.endDate`)}
                />
              </div>

              <textarea
                placeholder="Description"
                {...register(`workExperience.${idx}.description`)}
              />

              {workFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWork(idx)}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendWork({
                company: "",
                title: "",
                startDate: "",
                endDate: "",
                description: "",
              })
            }
            className={styles.addBtn}
          >
            + Add Experience
          </button>
          {errors.workExperience?.message && (
            <span className={styles.errorText}>
              {errors.workExperience.message.toString()}
            </span>
          )}

          <h2 className={styles.sectionTitle}>Education</h2>
          {eduFields.map((f, idx) => (
            <div key={f.id} className={styles.subCard}>
              <input
                placeholder="School"
                {...register(`education.${idx}.school`)}
                className={
                  errors.education?.[idx]?.school ? styles.invalid : ""
                }
              />

              <input
                placeholder="Degree"
                {...register(`education.${idx}.degree`)}
                className={
                  errors.education?.[idx]?.degree ? styles.invalid : ""
                }
              />

              <div className={styles.row}>
                <input
                  type="date"
                  min="1950-01-01"
                  max="2030-12-31"
                  placeholder="Start Date"
                  {...register(`education.${idx}.startDate`)}
                />
                <input
                  type="date"
                  min="1950-01-01"
                  max="2030-12-31"
                  placeholder="End Date"
                  {...register(`education.${idx}.endDate`)}
                />
              </div>

              {eduFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEdu(idx)}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendEdu({
                school: "",
                degree: "",
                startDate: "",
                endDate: "",
              })
            }
            className={styles.addBtn}
          >
            + Add Education
          </button>
          {errors.education?.message && (
            <span className={styles.errorText}>
              {errors.education.message.toString()}
            </span>
          )}

          <div className={styles.field}>
            <label>Skills *</label>
            <input
              type="text"
              placeholder="JavaScript, React, Figma"
              {...register("skills")}
              className={errors.skills ? styles.invalid : ""}
            />
            <p className={styles.hint}>Enter skills separated by commas</p>
            {errors.skills?.message && (
              <span className={styles.errorText}>
                {errors.skills.message.toString()}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label>Languages *</label>
            <input
              type="text"
              placeholder="English, Spanish, German"
              {...register("languages")}
              className={errors.languages ? styles.invalid : ""}
            />
            <p className={styles.hint}>Enter languages separated by commas</p>
            {errors.languages?.message && (
              <span className={styles.errorText}>
                {errors.languages.message.toString()}
              </span>
            )}
          </div>

          <button type="submit" className={styles.btn}>
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;

