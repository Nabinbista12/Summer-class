import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import styles from "./Profile.module.css";
import axios from "axios";
import ProfilePictureUpload from "./ProfilePictureUpload";
import ProfileForm from "./ProfileForm";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";

export default function Profile() {
  const loggedInId = localStorage.getItem("userId");
  const [user, setUser] = useState<any>(null);
  const [editData, setEditData] = useState({ companyName: "", bio: "" });
  // Profile picture upload logic moved to ProfilePictureUpload component
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePicFile) return;
    setProfilePicUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", profilePicFile);
      const res = await axios.post(
        `http://localhost:3000/api/user/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.image?.url) {
        setUser((prev: any) => ({ ...prev, profilePicture: res.data.image }));
        setSuccess("Profile picture updated!");
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (err: any) {
      setError("Failed to upload profile picture.");
    } finally {
      setProfilePicUploading(false);
    }
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
  const handleSkillAdd = (e: React.FormEvent) => {
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
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExpForm((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };
  const handleExpAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.title || !expForm.company || !expForm.years || isNaN(Number(expForm.years))) {
      setExpError("All fields required and years must be a number");
      return;
    }
    setExperience([...experience, { ...expForm, years: Number(expForm.years) }]);
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
          <ProfilePictureUpload
            profilePictureUrl={user.profilePicture?.url}
            onUploadSuccess={(image) => setUser((prev: any) => ({ ...prev, profilePicture: image }))}
          />
          <div className={styles.username}>{user.username}</div>
          <div className={styles.email}>
            <strong>Email:</strong> {user.email}
          </div>
          {isEditing ? (
            <form
              className={styles.formContainer}
              onSubmit={(e) => e.preventDefault()}
            >
              <ProfileForm editData={editData} onChange={handleChange} />
              {/* --- Skills Section --- */}
              <SkillsSection
                skills={skills}
                newSkill={newSkill}
                onSkillChange={(e) => setNewSkill(e.target.value)}
                onSkillAdd={handleSkillAdd}
                onSkillRemove={handleSkillRemove}
              />
              {/* --- Experience Section --- */}
              <ExperienceSection
                experience={experience}
                expForm={expForm}
                expError={expError}
                onExpChange={handleExpChange}
                onExpAdd={handleExpAdd}
                onExpRemove={handleExpRemove}
              />
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
                      <div
                        key={idx}
                        className={styles.expCard}
                      >
                        <span
                          className={styles.expTitle}
                        >
                          {exp.title}
                        </span>{" "}
                        at{" "}
                        <span className={styles.expCompany}>{exp.company}</span>{" "}
                        ({exp.years} yrs)
                        <span
                          className={styles.expDesc}
                        >
                          {exp.description}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className={styles.fadedText}>No experience added</span>
                  )}
                </div>
              </div>
              <button className={styles.editBtn} onClick={toggleEdit}>
                Edit
              </button>
            </div>
          )}
          {success && (
            <div className={styles.successMsg}>{success}</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
