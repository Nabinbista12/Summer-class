import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Navbar from "../../component/Navbar";
import axios from "axios";

interface UserType {
  _id: string;
  username: string;
  companyName?: string;
  bio?: string;
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
      const res = await axios.get("http://localhost:3000/api/user/public-users");
      setUsers(res.data.users);
    } catch (err) {
      console.log("Error occurred while fetching all users", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleCardClick = (id: string) => {
    navigate(`/user/${id}`);
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

        {users.map((val) => (
          <div
            className={styles.searchCard}
            key={val._id}
            onClick={() => handleCardClick(val._id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCardClick(val._id);
            }}
          >
            <div className={styles.profile}>
              <img
                src={`https://ui-avatars.com/api/?name=${val.username}&background=4a47a3&color=fff&size=64`}
                alt={`${val.username} profile`}
              />
              <div>
                <h3 className={styles.name}>{val.username}</h3>
                <p className={styles.companyName}>{val.companyName || 'No company'}</p>
              </div>
            </div>
            <p>{val.bio || 'No detail provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

