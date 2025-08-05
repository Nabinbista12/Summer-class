import { useState, type ChangeEvent } from "react";
import Navbar from "../../component/Navbar";
import styles from "./Profile.module.css";

export default function Profile() {
  const [fieldData, setFieldData] = useState({
    name: "Test",
    email: "test",
    companyName: "XYZ company pvt ltd",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((curr) => {
      return { ...curr, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className={styles.profile}>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.profilePicture}>
          <img src="images/image.png" alt="profile img" />
        </div>

        <p className={styles.username}>Username</p>

        <form className={styles.formContainer}>
          <div className={styles.formField}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={fieldData.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="Email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={fieldData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="company">Company</label>
            <input
              type="text"
              name="company"
              id="company"
              value={fieldData.companyName}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
