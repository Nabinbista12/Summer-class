import React from "react";
import styles from "./Profile.module.css";

interface Props {
  skills: string[];
  newSkill: string;
  onSkillChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkillAdd: (e: React.FormEvent) => void;
  onSkillRemove: (skill: string) => void;
}

export default function SkillsSection({ skills, newSkill, onSkillChange, onSkillAdd, onSkillRemove }: Props) {
  return (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionHeading}>Skills</h3>
      <div className={styles.badgeList}>
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span key={skill} className={styles.badge}>
              {skill}
              <button
                type="button"
                className={styles.badgeRemove}
                onClick={() => onSkillRemove(skill)}
              >
                &times;
              </button>
            </span>
          ))
        ) : (
          <span className={styles.fadedText}>No skills added</span>
        )}
      </div>
      <div className={styles.skillForm}>
        <input
          type="text"
          value={newSkill}
          onChange={onSkillChange}
          placeholder="Add skill"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSkillAdd(e as any);
            }
          }}
        />
        <button
          type="button"
          className={styles.addBtn}
          onClick={onSkillAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
}
