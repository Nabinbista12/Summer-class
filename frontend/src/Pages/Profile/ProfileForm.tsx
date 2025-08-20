import React from "react";
import styles from "./Profile.module.css";

interface Props {
  editData: { companyName: string; bio: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ProfileForm({ editData, onChange }: Props) {
  return (
    <>
      <div className={styles.formField}>
        <label htmlFor="companyName">Company Name</label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          value={editData.companyName}
          onChange={onChange}
          autoFocus
        />
      </div>
      <div className={styles.formField}>
        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          id="bio"
          value={editData.bio}
          onChange={onChange}
          rows={4}
        />
      </div>
    </>
  );
}
