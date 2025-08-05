import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./Register.module.css";
import { RegisterAPI } from "../../Shared/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [fieldData, setFieldData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((curr) => {
      return { ...curr, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const success = await RegisterAPI(fieldData);
      if (success) {
        navigate("/");
      } else {
        alert("User already exit.");
      }
      setFieldData({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.registerHeading}>Register</h1>
            <div className={styles.inputField}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                value={fieldData.username}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                value={fieldData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                id="password"
                value={fieldData.password}
                onChange={handleChange}
              />
            </div>

            <button className={styles.btn}>Register</button>
            <Link to="/login" className={styles.redirect}>
              Already has a account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
