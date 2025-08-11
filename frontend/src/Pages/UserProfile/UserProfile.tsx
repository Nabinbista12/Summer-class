import styles from "./UserProfile.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../component/Navbar";

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
          <p className={styles.email}><strong>Email:</strong> {user.email}</p>
          <p className={styles.company}><strong>Company:</strong> {user.companyName || 'No company'}</p>
          <p className={styles.bio}> {user.bio || 'No bio provided.'}</p>
          {loggedInId === user._id && (
            <button
              className={styles.editBtn}
              onClick={() => window.location.href = "/profile"}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
