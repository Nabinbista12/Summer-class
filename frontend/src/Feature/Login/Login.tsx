import { useState, type ChangeEvent } from "react";
import styles from "./Login.module.css";
import { LoginAPI } from "../../Shared/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [fieldData, setFieldData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((curr) => {
      return { ...curr, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await LoginAPI(fieldData);
      console.log(result);
      if (result) {
        navigate("/");
      } else {
        alert("User not found");
      }

      setFieldData({
        username: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.formContainer}>
        <h1 className={styles.loginHeading}>Login</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
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
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                id="password"
                value={fieldData.password}
                onChange={handleChange}
              />
            </div>
            <button className={styles.btn}>Login</button>
            <Link to="/register" className={styles.redirect}>New Account</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
