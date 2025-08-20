import React from "react";
import styles from "./Profile.module.css";

interface Exp {
  title: string;
  company: string;
  years: number | string;
  description?: string;
}

interface Props {
  experience: Exp[];
  expForm: Exp;
  expError: string;
  onExpChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onExpAdd: (e: React.FormEvent) => void;
  onExpRemove: (idx: number) => void;
}

export default function ExperienceSection({ experience, expForm, expError, onExpChange, onExpAdd, onExpRemove }: Props) {
  return (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionHeading}>Experience</h3>
      <div>
        {experience.length > 0 ? (
          experience.map((exp, idx) => (
            <div key={idx} className={styles.expCard}>
              <span className={styles.expTitle}>{exp.title}</span> at <span className={styles.expCompany}>{exp.company}</span> ({exp.years} yrs)
              <span className={styles.expDesc}>{exp.description}</span>
              <button
                type="button"
                className={styles.badgeRemove}
                onClick={() => onExpRemove(idx)}
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <span className={styles.fadedText}>No experience added</span>
        )}
      </div>
      <div className={styles.expForm}>
        <input
          type="text"
          name="title"
          value={expForm.title}
          onChange={onExpChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="company"
          value={expForm.company}
          onChange={onExpChange}
          placeholder="Company"
        />
        <input
          type="number"
          name="years"
          value={expForm.years}
          onChange={onExpChange}
          placeholder="Years"
          min="0"
        />
        <input
          type="text"
          name="description"
          value={expForm.description}
          onChange={onExpChange}
          placeholder="Description (optional)"
        />
        <button
          type="button"
          className={styles.addBtn}
          onClick={onExpAdd}
        >
          Add
        </button>
      </div>
      {expError && <div className={styles.error}>{expError}</div>}
    </div>
  );
}
