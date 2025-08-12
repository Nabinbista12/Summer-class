import { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import styles from "./SkillsExplorer.module.css";
import axios from "axios";

export default function SkillsExplorer() {
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/user/skills").then(res => {
      setSkills(res.data.skills);
    });
  }, []);

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
    axios.get(`http://localhost:3000/api/user/skills/${skill}`).then(res => {
      setUsers(res.data.users);
    });
  };

  const filteredSkills = skills.filter(skill => skill.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Skills Explorer</h2>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.skillsList}>
          {filteredSkills.map(skill => (
            <button
              key={skill}
              className={styles.skillBtn + (selectedSkill === skill ? ' ' + styles.selected : '')}
              onClick={() => handleSkillClick(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
        {selectedSkill && (
          <div className={styles.usersSection}>
            <h3>Users with "{selectedSkill}"</h3>
            {users.length === 0 ? (
              <p>No users found for this skill.</p>
            ) : (
              <ul className={styles.usersList}>
                {users.map(user => (
                  <li key={user._id} className={styles.userCard}>
                    <strong>{user.username}</strong> <span>({user.email})</span>
                    <div>{user.companyName}</div>
                    <div className={styles.userBio}>{user.bio}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
