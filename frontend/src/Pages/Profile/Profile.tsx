import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import styles from "./Profile.module.css";
import axios from "axios";
// import { useParams } from "react-router-dom";

export default function Profile() {
  const loggedInId = localStorage.getItem("userId");
  const [user, setUser] = useState<any>(null);
  const [editData, setEditData] = useState({ companyName: "", bio: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState<any[]>([]);
  const [expForm, setExpForm] = useState({
    title: "",
    company: "",
    years: "",
    description: "",
  });
  const [expError, setExpError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Always show logged-in user's profile
  const profileId = loggedInId;

  useEffect(() => {
    if (!profileId) {
      setError("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user/user-info/${profileId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        if (!res.data.user) throw new Error("No user data returned");
        setUser(res.data.user);
        setEditData({
          companyName: res.data.user.companyName || "",
          bio: res.data.user.bio || "",
        });
        setSkills(res.data.user.skills || []);
        setExperience(res.data.user.experience || []);
      } catch (err: any) {
        setError(
          "Failed to load user profile. " +
            (err?.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [profileId, isEditing]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    if (!loggedInId) {
      setError("No user ID found. Please log in again.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:3000/api/user/user-info/${loggedInId}`,
        { ...editData, skills, experience },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
      );
      setUser((prev: any) => ({ ...prev, ...editData, skills, experience }));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      setError(
        "Failed to update profile. " +
          (err?.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Skills logic
  const handleSkillAdd = (e: FormEvent) => {
    e.preventDefault();
    const skill = newSkill.trim();
    if (!skill || skills.includes(skill)) return;
    setSkills([...skills, skill]);
    setNewSkill("");
  };
  const handleSkillRemove = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Experience logic
  const handleExpChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExpForm((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };
  const handleExpAdd = (e: FormEvent) => {
    e.preventDefault();
    if (
      !expForm.title ||
      !expForm.company ||
      !expForm.years ||
      isNaN(Number(expForm.years))
    ) {
      setExpError("All fields required and years must be a number");
      return;
    }
    setExperience([
      ...experience,
      { ...expForm, years: Number(expForm.years) },
    ]);
    setExpForm({ title: "", company: "", years: "", description: "" });
    setExpError("");
  };
  const handleExpRemove = (idx: number) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  if (loading)
    return (
      <div className={styles.profile}>
        <Navbar />
        <div className={styles.container}>Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className={styles.profile}>
        <Navbar />
        <div className={styles.container}>{error}</div>
      </div>
    );
  if (!user) return null;

  return (
    <div className={styles.profile}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.profilePicture}>
            <img
              src={`https://ui-avatars.com/api/?name=${user.username}&background=667eea&color=fff&size=128`}
              alt="profile img"
            />
          </div>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.email}>
            <strong>Email:</strong> {user.email}
          </div>
          {isEditing ? (
            <form
              className={styles.formContainer}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.formField}>
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={editData.companyName}
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  name="bio"
                  id="bio"
                  value={editData.bio}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    resize: "vertical",
                    fontSize: "1.1rem",
                    padding: "0.8rem 1.2rem",
                    borderRadius: "1.2rem",
                    border: "2px solid #cbd5e1",
                  }}
                />
              </div>
              {/* --- Skills Section --- */}
              <div style={{ width: "100%", margin: "1.5rem 0" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "#667eea",
                    marginBottom: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  Skills
                </h3>
                <div className={styles.badgeList}>
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span key={skill} className={styles.badge}>
                        {skill}
                        <button
                          type="button"
                          className={styles.badgeRemove}
                          onClick={() => handleSkillRemove(skill)}
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#aaa" }}>No skills added</span>
                  )}
                </div>
                <div className={styles.skillForm}>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSkillAdd(e as any);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={handleSkillAdd}
                  >
                    Add
                  </button>
                </div>
              </div>
              {/* --- Experience Section --- */}
              <div style={{ width: "100%", margin: "1.5rem 0" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "#667eea",
                    marginBottom: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  Experience
                </h3>
                <div>
                  {experience.length > 0 ? (
                    experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className={styles.expCard}
                        style={{
                          background: "#f7f9fc",
                          borderRadius: "1rem",
                          marginBottom: "1rem",
                          padding: "1rem 1.2rem",
                        }}
                      >
                        <span
                          className={styles.expTitle}
                          style={{ color: "#4a47a3", fontWeight: 600 }}
                        >
                          {exp.title}
                        </span>{" "}
                        at{" "}
                        <span className={styles.expCompany}>{exp.company}</span>{" "}
                        ({exp.years} yrs)
                        <span
                          className={styles.expDesc}
                          style={{
                            display: "block",
                            color: "#555",
                            marginTop: "0.3rem",
                          }}
                        >
                          {exp.description}
                        </span>
                        <button
                          type="button"
                          className={styles.badgeRemove}
                          onClick={() => handleExpRemove(idx)}
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: "#aaa" }}>No experience added</span>
                  )}
                </div>
                <div className={styles.expForm}>
                  <input
                    type="text"
                    name="title"
                    value={expForm.title}
                    onChange={handleExpChange}
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    name="company"
                    value={expForm.company}
                    onChange={handleExpChange}
                    placeholder="Company"
                  />
                  <input
                    type="number"
                    name="years"
                    value={expForm.years}
                    onChange={handleExpChange}
                    placeholder="Years"
                    min="0"
                  />
                  <input
                    type="text"
                    name="description"
                    value={expForm.description}
                    onChange={handleExpChange}
                    placeholder="Description (optional)"
                  />
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={handleExpAdd}
                  >
                    Add
                  </button>
                </div>
                {expError && <div className={styles.error}>{expError}</div>}
              </div>
              <div className={styles.btnGroup}>
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={toggleEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.detailView}>
              <p>
                <strong>Company Name:</strong>{" "}
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
              <div style={{ width: "100%", margin: "1.5rem 0" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "#667eea",
                    marginBottom: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  Skills
                </h3>
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
              <div style={{ width: "100%", margin: "1.5rem 0" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "#667eea",
                    marginBottom: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  Experience
                </h3>
                <div>
                  {user.experience && user.experience.length > 0 ? (
                    user.experience.map((exp: any, idx: number) => (
                      <div
                        key={idx}
                        className={styles.expCard}
                        style={{
                          background: "#f7f9fc",
                          borderRadius: "1rem",
                          marginBottom: "1rem",
                          padding: "1rem 1.2rem",
                        }}
                      >
                        <span
                          className={styles.expTitle}
                          style={{ color: "#4a47a3", fontWeight: 600 }}
                        >
                          {exp.title}
                        </span>{" "}
                        at{" "}
                        <span className={styles.expCompany}>{exp.company}</span>{" "}
                        ({exp.years} yrs)
                        <span
                          className={styles.expDesc}
                          style={{
                            display: "block",
                            color: "#555",
                            marginTop: "0.3rem",
                          }}
                        >
                          {exp.description}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: "#aaa" }}>No experience added</span>
                  )}
                </div>
              </div>
              <button className={styles.editBtn} onClick={toggleEdit}>
                Edit
              </button>
            </div>
          )}
          {success && (
            <div
              style={{ color: "#38a169", marginTop: "1rem", fontWeight: 600 }}
            >
              {success}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
