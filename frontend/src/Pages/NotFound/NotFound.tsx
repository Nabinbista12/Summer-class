import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>404</h1>
        <p>Page not found.</p>
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.btn}>Go back</button>
          <button onClick={() => navigate('/')} className={styles.btnPrimary}>Home</button>
        </div>
      </div>
    </div>
  );
}
