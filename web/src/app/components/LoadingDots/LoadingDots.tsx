import styles from './LoadingDots.module.css';

export function LoadingDots() {
  return (
    <span className={styles.container}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </span>
  );
}
