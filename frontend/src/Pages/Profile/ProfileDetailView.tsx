import styles from "./Profile.module.css";

interface Props {
  user: any;
  onEdit: () => void;
}

export default function ProfileDetailView({ user, onEdit }: Props) {
  return (
    <div className={styles.detailView}>
      <div className={styles.profilePicture}>
        <img
          src={user.profilePicture?.url || `https://ui-avatars.com/api/?name=${user.username}&background=667eea&color=fff&size=128`}
          alt="profile img"
          style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", marginBottom: "1.2rem" }}
        />
      </div>
      {/* --- Projects Section --- */}
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionHeading}>Projects</h3>
        <div className={styles.projectListSimple}>
          {user.projects && user.projects.length > 0 ? (
            user.projects.map((p: any, idx: number) => (
              <div key={idx} className={styles.projectItemSimple}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className={styles.projectThumb} />
                ) : (
                  <div className={styles.projectThumbPlaceholder}>No Image</div>
                )}
                <div className={styles.projectBody}>
                  <strong>{p.title}</strong>
                  <p className={styles.projectDesc}>{p.description}</p>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className={styles.projectLink}>Visit project</a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <span className={styles.fadedText}>No projects added</span>
          )}
        </div>
      </div>
      <p>
        <strong>College Name:</strong>{" "}
        {user.companyName || (
          <span style={{ color: "#aaa" }}>Not set</span>
        )}
      </p>
      <p>
        <strong>Bio:</strong>{" "}
        {user.bio || (
          <span style={{ color: "#aaa" }}>No bio provided</span>
        )}
      </p>
      {/* --- Skills Section --- */}
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionHeading}>Skills</h3>
        <div className={styles.badgeList}>
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill: string) => (
              <span key={skill} className={styles.badge}>
                {skill}
              </span>
            ))
          ) : (
            <span className={styles.fadedText}>No skills added</span>
          )}
        </div>
      </div>
      {/* --- Experience Section --- */}
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionHeading}>Experience</h3>
        <div>
          {user.experience && user.experience.length > 0 ? (
            user.experience.map((exp: any, idx: number) => (
              <div key={idx} className={styles.expCard}>
                <span className={styles.expTitle}>{exp.title}</span> at <span className={styles.expCompany}>{exp.company}</span> ({exp.years} yrs)
                <span className={styles.expDesc}>{exp.description}</span>
              </div>
            ))
          ) : (
            <span className={styles.fadedText}>No experience added</span>
          )}
        </div>
      </div>
      <div className={styles.editControl} onClick={onEdit} role="button" tabIndex={0}>
        <span className={styles.editIcon} aria-hidden>
          <i className="fa-solid fa-pen" aria-hidden></i>
        </span>
        <span className={styles.editLabel}>Edit profile</span>
      </div>
    </div>
  );
}
