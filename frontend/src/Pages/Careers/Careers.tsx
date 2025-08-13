import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import styles from "./Careers.module.css";

const demoInternship = {
  title: "Frontend Developer Intern",
  company: "Tech Pvt. Ltd.",
  location: "Remote",
  duration: "3 months",
  description: "Work with React, TypeScript, and modern UI frameworks to build real-world web apps. Mentor support and certificate provided.",
  applyUrl: "#"
};

export default function Careers() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Internship Opportunities</h1>
        <div className={styles.cardList}>
          {[1,2,3, 4, 5, 6, 7].map((i) => (
            <div className={styles.card} key={i}>
              <h2>{demoInternship.title}</h2>
              <h3>{demoInternship.company}</h3>
              <p className={styles.meta}><span>{demoInternship.location}</span> | <span>{demoInternship.duration}</span></p>
              <p className={styles.desc}>{demoInternship.description}</p>
              <a href={demoInternship.applyUrl} className={styles.applyBtn} target="_blank" rel="noopener noreferrer">Apply Now</a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
