import { useState, type ChangeEvent } from "react";
import styles from "./Login.module.css";
import { LoginAPI } from "../../Shared/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const navigate = useNavigate();

  const [fieldData, setFieldData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((curr) => {
      return { ...curr, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fieldData.username.trim()) {
      setError("Username is required.");
      toast.error("Username is required.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    } else if (!fieldData.password.trim()) {
      setError("Password is required.")
      toast.error("Password is required.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    setError("");
    try {
      setLoading(true);
      const result = await LoginAPI(fieldData);
      console.log(result);
      if (result) {
        toast.success(result.message || 'Login successful', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        navigate("/");
      } else {
        toast.error("User not found", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      setFieldData({
        username: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
      const message = (err as any)?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
      <h1 className={styles.loginHeading}>TalentCrew</h1>
      <p style={{ color: '#475569', marginBottom: 12 }}>Welcome back — sign in to manage your profile and explore opportunities.</p>
              <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div style={{color: '#e53e3e', marginBottom: '0.7rem', fontWeight: 600}}>{error}</div>}
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
                  type="password"
                  name="password"
                  id="password"
                  value={fieldData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
            </div>
            <button className={styles.btn} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <Link to="/register" className={styles.redirect}>New Account</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
