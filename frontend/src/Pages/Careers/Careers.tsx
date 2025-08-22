import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { internships } from "./career.data";
import styles from "./Careers.module.css"

export default function Careers() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Internship Opportunities</h1>
        <div className={styles.cardList}>
          {internships.map((intern) => (
            <div className={styles.card} key={intern.id}>
              <div className={styles.cardHeader}>
                <h2>{intern.title}</h2>
                <h3>{intern.company}</h3>
              </div>
              <p className={styles.meta}>
                <span>{intern.location}</span> | <span>{intern.duration}</span>
              </p>
              <p className={styles.desc}>{intern.description}</p>
              <a
                href={intern.applyUrl}
                className={styles.applyBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
