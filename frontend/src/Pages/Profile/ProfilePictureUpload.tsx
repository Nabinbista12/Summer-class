import React, { useState } from "react";
import styles from "./Profile.module.css";
import axios from "axios";

interface Props {
  profilePictureUrl?: string;
  onUploadSuccess: (image: any) => void;
}

export default function ProfilePictureUpload({ profilePictureUrl, onUploadSuccess }: Props) {
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePicFile) return;
    setProfilePicUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicFile);
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
        onUploadSuccess(res.data.image);
        setSuccess("Profile picture updated!");
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (err: any) {
      setError("Failed to upload profile picture.");
    } finally {
      setProfilePicUploading(false);
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
      <input
        type="file"
        id="profile-pic"
        accept="image/png, image/jpeg"
        onChange={handleProfilePicChange}
        style={{ marginBottom: "0.7rem" }}
      />
      <button
        type="button"
        className={styles.addBtn}
        onClick={handleProfilePicUpload}
        disabled={profilePicUploading || !profilePicFile}
        style={{ marginBottom: "0.7rem" }}
      >
        {profilePicUploading ? "Uploading..." : "Upload"}
      </button>
      {success && <div className={styles.successMsg}>{success}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
