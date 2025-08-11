import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Navbar from "../../component/Navbar";
import axios from "axios";

interface UserType {
  username: string;
  email: string;
}


export default function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);

    if (value.trim() === "") {
      getAllUsers();
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/user/search?search=${value}`
      );

      if (res.data.users) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.log("Search error", err);
      setUsers([]);
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/all-users");
      setUsers(res.data.users);
    } catch (err) {
      console.log("Error occurred while fetching all users", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleCardClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  return (
    <div className={styles.homeContainer}>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search for the user"
            name="search"
            onChange={handleSearch}
            value={search}
          />
          <i className="fa-solid fa-magnifying-glass" />
        </div>

        <div className={styles.projectInfo}>
          <span>TalentConnect</span>
          Search Talent Recruiter
        </div>
      </div>

      <div className={styles.filterBar}>
        <p className={styles.result}>{users.length} result(s) found</p>
        <button className={styles.filter}>Filter</button>
      </div>

      <div className={styles.SearchResult}>
        {users.length === 0 && (
          <p style={{ color: "black", marginTop: "2rem", fontWeight: "600" }}>
            No users found.
          </p>
        )}

        {users.map((val, key) => (
          <div
            className={styles.searchCard}
            key={key}
            onClick={() => handleCardClick(val.username)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCardClick(val.username);
            }}
          >
            <div className={styles.profile}>
              <img
                src={`https://ui-avatars.com/api/?name=${val.username}&background=4a47a3&color=fff&size=64`}
                alt={`${val.username} profile`}
              />
              <h3 className={styles.name}>{val.username}</h3>
              <p className={styles.companyName}>XYZ company</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
              possimus vel vitae dolor reiciendis quo mollitia dolores ipsam,
              minima suscipit esse omnis! Harum vitae eaque perspiciatis eum
              sunt quibusdam vel?
            </p>
            <div className={styles.btn}>
              <button type="button">React</button>
              <button type="button">Node</button>
              <button type="button">Mongo</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

