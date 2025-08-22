import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import axios from "axios";
import { API_BASE } from "../../config/URLAPI";

interface UserType {
  _id: string;
  username: string;
  companyName?: string;
  bio?: string;
  skills?: string[];
  profilePicture?: { url?: string };
  projects?: { title?: string; description?: string; link?: string; imageUrl?: string }[];
}

export default function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [collegeFilter, setCollegeFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);

    if (value.trim() === "") {
      getAllUsers();
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/api/user/search?search=${value}`
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
  const res = await axios.get(`${API_BASE}/api/user/public-users`);
      setUsers(res.data.users);
    } catch (err) {
      console.log("Error occurred while fetching all users", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Apply client-side filters (college prioritized, then skill match count)
  useEffect(() => {
    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }

    const collegeQ = collegeFilter.trim().toLowerCase();
    const skillTokens = skillsFilter
      .split(/[,\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (!collegeQ && skillTokens.length === 0) {
      setFilteredUsers(users);
      return;
    }

    const scored = users.map((u) => {
      const company = (u.companyName || "").toLowerCase();
      const collegeMatch = collegeQ ? company.includes(collegeQ) : false;
      const userSkills = (u.skills || []).map((s) => String(s).toLowerCase());
      let skillMatches = 0;
      for (const t of skillTokens) if (userSkills.includes(t)) skillMatches++;
      return { u, collegeMatch, skillMatches };
    });

    // College matches first (sorted by skillMatches desc), then other skill matches, then rest
    const primary = scored
      .filter((s) => s.collegeMatch)
      .sort((a, b) => b.skillMatches - a.skillMatches)
      .map((s) => s.u);
    const secondary = scored
      .filter((s) => !s.collegeMatch && s.skillMatches > 0)
      .sort((a, b) => b.skillMatches - a.skillMatches)
      .map((s) => s.u);
    const rest = scored
      .filter((s) => !s.collegeMatch && s.skillMatches === 0)
      .map((s) => s.u);

    setFilteredUsers([...primary, ...secondary, ...rest]);
  }, [users, collegeFilter, skillsFilter]);

  const handleCardClick = (id: string) => {
    navigate(`/user/${id}`);
  };
  const displayList = filteredUsers.length > 0 ? filteredUsers : users;

  const truncateWords = (text?: string, maxWords = 10) => {
    if (!text) return "";
    const words = String(text).split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(" ");
    return words.slice(0, maxWords).join(" ") + "...";
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
          <span>TalentCrew</span>
          <div style={{ marginTop: 10 }}>
            {/* retained tagline area; removed redundant filter button here per request */}
          </div>
          Search Talent Recruiter
        </div>
      </div>
  <div className={styles.filterBar}>
    <p className={styles.result}>{users.length} result(s) found</p>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {!showFilters && (
        <button className={styles.filter} onClick={() => setShowFilters(true)}>
          Filter
        </button>
      )}
    </div>
    {showFilters && (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
        <button className={styles.filter} onClick={() => { setCollegeFilter(''); setSkillsFilter(''); }} style={{ padding: '0.45rem 0.7rem' }}>
          Clear
        </button>
        <input
          placeholder="College name (priority)"
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          style={{ padding: '0.45rem 0.65rem', borderRadius: 6, border: '1px solid #dbeafe', width: 200, maxWidth: '40vw' }}
        />
        <input
          placeholder="Skills (comma separated)"
          value={skillsFilter}
          onChange={(e) => setSkillsFilter(e.target.value)}
          style={{ padding: '0.45rem 0.65rem', borderRadius: 6, border: '1px solid #dbeafe', width: 200, maxWidth: '40vw' }}
        />
        <button className={styles.filter} onClick={() => setShowFilters(false)} style={{ marginLeft: 6 }}>
          Hide filters
        </button>
      </div>
    )}
  </div>
      <div className={styles.SearchResult}>
        {displayList.length === 0 ? (
          <p className={styles.noUsers}>No users found.</p>
        ) : (
          displayList.map((val) => (
            <div
              className={styles.searchCard}
              key={val._id}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(val._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCardClick(val._id);
              }}
            >
              <div className={styles.cardFlip}>
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>
                    <div className={styles.profile}>
                      <img
                        src={val.profilePicture?.url || `https://ui-avatars.com/api/?name=${val.username}&background=4a47a3&color=fff&size=64`}
                        alt={`${val.username} profile`}
                      />
                      <div>
                        <h3 className={styles.name}>{val.username}</h3>
                        <p className={styles.companyName}>
                          {val.companyName || "No company"}
                        </p>
                      </div>
                    </div>
                    <p>{val.bio || "No detail provided."}</p>

                      {val.skills && val.skills.length > 0 && (
                        <div className={styles.skillsBadgeList}>
                          {(() => {
                            const maxSkills = 6;
                            const visible = (val.skills || []).slice(0, maxSkills);
                            return (
                              <>
                                {visible.map((skill: any, idx: number) => (
                                  <span key={skill + idx} className={styles.skillsBadge}>
                                    {skill}
                                  </span>
                                ))}
                                {val.skills.length > maxSkills && (
                                  <span className={styles.skillsBadge}>+{val.skills.length - maxSkills}</span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                  </div>
                  <div className={styles.cardBack}>
                    <h4 style={{ marginTop: 0 }}>Projects</h4>
                      {val.projects && val.projects.length > 0 ? (
                        <div>
                          <div className={styles.projectPreviewList}>
                            {val.projects.slice(0, 3).map((p: any, i: number) => (
                              <div key={i} className={styles.projectPreview}>
                                <strong>{p.title}</strong>
                                <div className={styles.projectPreviewDesc}>
                                  {p.link ? truncateWords(p.link, 10) : truncateWords(p.description || '', 12)}
                                </div>
                              </div>
                            ))}
                          </div>
                          {val.projects.length > 3 && (
                            <div className={styles.seeMore} onClick={(e) => { e.stopPropagation(); navigate(`/user/${val._id}`); }}>
                              See more projects
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.fadedText}>No projects added</div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}
