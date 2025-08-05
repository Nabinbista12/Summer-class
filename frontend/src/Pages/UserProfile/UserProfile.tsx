import styles from "./UserProfile.module.css";

export default function UserProfile() {

    return (
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <img className={styles.profile}></img>
            </div>
        </div>
    )
    
};
