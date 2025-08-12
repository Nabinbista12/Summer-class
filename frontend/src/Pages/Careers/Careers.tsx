import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import styles from "./Careers.module.css";

const internships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova Pvt. Ltd.",
    location: "Remote",
    duration: "3 months",
    description: "Work with React, TypeScript, and modern UI frameworks to build real-world web apps. Mentor support and certificate provided.",
    applyUrl: "#"
  },
  {
    id: 2,
    title: "Backend Developer Intern",
    company: "CodeCrafters Inc.",
    location: "Kathmandu, Nepal",
    duration: "6 months",
    description: "Learn Node.js, Express, and MongoDB. Collaborate on live projects and gain hands-on backend experience.",
    applyUrl: "#"
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "InnovateX",
    location: "Remote",
    duration: "2 months",
    description: "Assist in designing user interfaces and experiences for web/mobile apps. Work with Figma and Adobe XD.",
    applyUrl: "#"
  }
];

export default function Careers() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Internship Opportunities</h1>
        <div className={styles.cardList}>
          {internships.map((job) => (
            <div className={styles.card} key={job.id}>
              <h2>{job.title}</h2>
              <h3>{job.company}</h3>
              <p className={styles.meta}><span>{job.location}</span> | <span>{job.duration}</span></p>
              <p className={styles.desc}>{job.description}</p>
              <a href={job.applyUrl} className={styles.applyBtn} target="_blank" rel="noopener noreferrer">Apply Now</a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
