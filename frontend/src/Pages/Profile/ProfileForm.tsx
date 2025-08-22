import React from "react";
import styles from "./Profile.module.css";

interface Props {
  editData: { companyName: string; bio: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  projects: any[];
  projectForm: { title: string; description: string; link: string; imageUrl?: string };
  onProjectChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onProjectAdd: (e: React.FormEvent) => void;
  onProjectRemove: (idx: number) => void;
}

export default function ProfileForm({ editData, onChange, projects, projectForm, onProjectChange, onProjectAdd, onProjectRemove }: Props) {
  return (
    <>
      <div className={styles.formField}>
        <label htmlFor="companyName">College Name</label>
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
      <div className={styles.sectionContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className={styles.sectionHeading}>Projects</h3>
          <small style={{ color: '#718096' }}>Add projects to showcase your work</small>
        </div>
        <div className={styles.expForm} style={{ marginTop: '1rem' }}>
          <input name="title" placeholder="Project title" value={projectForm.title} onChange={onProjectChange} />
          <input name="link" placeholder="Project link (optional)" value={projectForm.link} onChange={onProjectChange} />
          <input name="imageUrl" placeholder="Image URL (optional)" value={projectForm.imageUrl || ''} onChange={onProjectChange} />
          <input name="description" placeholder="Short description" value={projectForm.description} onChange={onProjectChange} />
          <button type="button" className={styles.addBtn} onClick={onProjectAdd}>Add Project</button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {projects && projects.length > 0 ? (
            projects.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <strong>{p.title}</strong>
                  <div style={{ color: '#718096', fontSize: '0.95rem' }}>{p.description}</div>
                </div>
                <button className={styles.badgeRemove} type="button" onClick={() => onProjectRemove(idx)}>×</button>
              </div>
            ))
          ) : (
            <div className={styles.fadedText}>No projects added</div>
          )}
        </div>
      </div>
    </>
  );
}
