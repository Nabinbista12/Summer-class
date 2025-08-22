import React, { useState } from "react";
import styles from "./Profile.module.css";
import axios from "axios";
import { API_BASE } from "../../config/URLAPI";

interface Props {
  profilePictureUrl?: string;
  onUploadSuccess: (image: any) => void;
}

export default function ProfilePictureUpload({ profilePictureUrl, onUploadSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
  `${API_BASE}/api/user/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.image?.url) {
        onUploadSuccess(res.data.image);
        setMessage("Profile picture updated!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      setMessage("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.formField}>
      <label htmlFor="profile-pic">Profile Picture</label>
      <img
        src={profilePictureUrl || "https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=128"}
        alt="profile img"
        style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", marginBottom: "0.7rem" }}
      />

      <label className={styles.uploadLabel} style={{ display: 'inline-block', marginTop: 8 }}>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </label>

      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
}
