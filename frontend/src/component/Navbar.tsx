import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const decoded = jwtDecode<{ username: string }>(token);
        setUsername(decoded.username);
      } catch (err) {
        console.log("invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("isLoggedIn");
    setUsername("");
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>
      {/* Fixed brand name on left */}
      <h1 className={styles.brand}>
        <Link to="/">TalentCrew</Link>
      </h1>

      <div className={styles.auth}>
        {/* Username alone before profile */}
        {username && <span className={styles.username}>{username}</span>}

        {!username ? (
          <>
            <div className={styles.authBtn}>
              <Link to={"/login"}>Login</Link>
            </div>
            <div className={styles.authBtn}>
              <Link to={"/register"}>Register</Link>
            </div>
          </>
        ) : (
          <>
            <button className={styles.logoutBtn}>
              <Link to="/profile">Profile</Link>
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
