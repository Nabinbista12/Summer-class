import styles from "./UserProfile.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loggedInId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user/user-info/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        setUser(res.data.user);
      } catch (err: any) {
        setError(
          "Failed to load user profile. " +
            (err?.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUser();
  }, [id]);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>{error}</div>;
  if (!user) return null;

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <img
            className={styles.profileAvatar}
            src={`https://ui-avatars.com/api/?name=${user.username}&background=4a47a3&color=fff&size=128`}
            alt={user.username}
          />
          <h2 className={styles.username}>{user.username}</h2>
          <p className={styles.email}>
            <strong>Email:</strong> {user.email}
          </p>
          <p className={styles.company}>
            <strong>Company:</strong> {user.companyName || "No company"}
          </p>
          <p className={styles.bio}>{user.bio || "No detail provided."}</p>

          {loggedInId === user._id && (
            <button
              className={styles.editBtn}
              onClick={() => (window.location.href = "/profile")}
            >
              Edit Profile
            </button>
          )}

          {/* --- Skills Section --- */}
          <div style={{ width: "100%", margin: "1.5rem 0" }}>
            <h3 className={styles.sectionTitle}>Skills</h3>
            <div className={styles.badgeList}>
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill: string) => (
                  <span key={skill} className={styles.badge}>
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: "#aaa" }}>No skills added</span>
              )}
            </div>
          </div>

          {/* --- Experience Section --- */}
          <div className={styles.experienceSection}>
            <h3 className={styles.sectionTitle}>Experience</h3>
            {user.experience && user.experience.length > 0 ? (
              <div className={styles.expList}>
                {user.experience.map((exp: any, idx: number) => (
                  <div key={idx} className={styles.experienceItem}>
                    <h4 className={styles.experienceRole}>{exp.title}</h4>
                    <p className={styles.experienceCompany}>{exp.company}</p>
                    <span className={styles.experienceDuration}>
                      {exp.years} yrs
                    </span>
                    {exp.description && (
                      <p className={styles.experienceDescription}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ color: "#aaa" }}>No experience added</span>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
