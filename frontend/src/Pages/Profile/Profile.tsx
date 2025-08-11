
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import Navbar from "../../component/Navbar";
import styles from "./Profile.module.css";
import axios from "axios";

// Dummy userId for demo; replace with auth user id in real app
const userId = "replace_with_real_user_id";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [editData, setEditData] = useState({ companyName: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user data from backend
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/user/user-info/${userId}`);
        setUser(res.data.user);
        setEditData({
          companyName: res.data.user.companyName || "",
          bio: res.data.user.bio || "",
        });
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData(curr => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/api/user/user-info/${userId}`, editData);
      setUser((prev: any) => ({ ...prev, ...editData }));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
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
        <div className={styles.profilePicture}>
          <img src="/images/image.png" alt="profile img" />
        </div>
        <div className={styles.username}>{user.username}</div>
        <div className={styles.detailView}>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
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
      </div>
    </div>
  );
}
