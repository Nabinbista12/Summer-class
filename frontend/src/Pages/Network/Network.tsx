import styles from "./Network.module.css";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";

export default function Network() {
  // Base single user object
  const singleUser = {
    id: 1,
    name: "myNetwork",
    company: "Demo Company",
    avatar:
      "https://ui-avatars.com/api/?name=myNetwork&background=4a47a3&color=fff&size=64",
  };

  // Create array with 6 copies for "Your Network"
  const myNetwork = Array(6)
    .fill(null)
    .map((_, i) => ({
      ...singleUser,
      id: i + 1,
      connected: true,
    }));

  // Create array with 6 copies for "Suggestions"
  const suggestions = Array(6)
    .fill(null)
    .map((_, i) => ({
      ...singleUser,
      id: i + 100,
      connected: false,
      name: `Suggestion ${i + 1}`,
    }));

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.networkHeading}>
          Build Network to the people for easier help
        </h2>
        <div className={styles.networkContainer}>
          {/* Your Network */}
          <div className={styles.network}>
            <h1>Your Network</h1>
            <div className={styles.cardList}>
              {myNetwork.map((user) => (
                <div className={styles.userCard} key={user.id}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatar}
                  />
                  <div>
                    <h3>{user.name}</h3>
                    <h4>{user.company}</h4>
                  </div>
                  <button className={styles.connectedBtn} disabled>
                    Connected
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className={styles.suggestion}>
            <h1>Suggestion</h1>
            <div className={styles.cardList}>
              {suggestions.map((user) => (
                <div className={styles.userCard} key={user.id}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatar}
                  />
                  <div>
                    <h3>{user.name}</h3>
                    <h4>{user.company}</h4>
                  </div>
                  <button className={styles.connectBtn}>Connect</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
