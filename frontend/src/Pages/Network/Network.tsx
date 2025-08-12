import styles from "./Network.module.css";
import Navbar from "../../component/Navbar";

export default function Network() {
  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.networkHeading}>
          Build Network to the people for easier help
        </h2>

        <div className={styles.networkContainer}>
          <div className={styles.network}>
            <h1>Your Network</h1>

            <div className="card">
              <div className={styles.user}>
                <div className={styles.profile}></div>
                <h3>Name</h3>
                <h4>Company Name</h4>

              </div>
            </div>
          </div>
          <div className={styles.suggestion}>
            <h1>Suggestion</h1>
          </div>
        </div>
      </div>
    </>
  );
}
