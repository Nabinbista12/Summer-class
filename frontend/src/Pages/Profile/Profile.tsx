

import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import styles from "./Profile.module.css";
import axios from "axios";
// import { useParams } from "react-router-dom";


export default function Profile() {
  const loggedInId = localStorage.getItem("userId");
  const [user, setUser] = useState<any>(null);
  const [editData, setEditData] = useState({ companyName: "", bio: "" });
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
        const res = await axios.get(`http://localhost:3000/api/user/user-info/${profileId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        if (!res.data.user) throw new Error("No user data returned");
        setUser(res.data.user);
        setEditData({
          companyName: res.data.user.companyName || "",
          bio: res.data.user.bio || "",
        });
        console.log(res);
      } catch (err: any) {
        setError("Failed to load user profile. " + (err?.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [profileId, isEditing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData(curr => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    if (!loggedInId) {
      setError("No user ID found. Please log in again.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/api/user/user-info/${loggedInId}`, editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setUser((prev: any) => ({ ...prev, ...editData }));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      setError("Failed to update profile. " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.profile}><Navbar /><div className={styles.container}>Loading...</div></div>;
  if (error) return <div className={styles.profile}><Navbar /><div className={styles.container}>{error}</div></div>;
  if (!user) return null;

  return (
    <div className={styles.profile}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.profilePicture}>
            <img src={`https://ui-avatars.com/api/?name=${user.username}&background=667eea&color=fff&size=128`} alt="profile img" />
          </div>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.email}><strong>Email:</strong> {user.email}</div>
          {isEditing ? (
            <form className={styles.formContainer} onSubmit={e => e.preventDefault()}>
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
                  style={{ resize: "vertical", fontSize: "1.1rem", padding: "0.8rem 1.2rem", borderRadius: "1.2rem", border: "2px solid #cbd5e1" }}
                />
              </div>
              <div className={styles.btnGroup}>
                <button type="button" className={styles.saveBtn} onClick={handleSave}>
                  Save
                </button>
                <button type="button" className={styles.cancelBtn} onClick={toggleEdit}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.detailView}>
              <p><strong>Company Name:</strong> {user.companyName || <span style={{ color: '#aaa' }}>Not set</span>}</p>
              <p><strong>Bio:</strong> {user.bio || <span style={{ color: '#aaa' }}>No bio provided</span>}</p>
              <button className={styles.editBtn} onClick={toggleEdit}>
                Edit
              </button>
            </div>
          )}
          {success && <div style={{ color: '#38a169', marginTop: '1rem', fontWeight: 600 }}>{success}</div>}
        </div>
      </div>
      <Footer />
    </div>
  );
}
