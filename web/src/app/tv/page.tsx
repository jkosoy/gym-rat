import styles from "./page.module.css";
import { App } from "@/app/components/App";

export default function Home() {
  return (
    <main className={styles.main}>
      <App isTV />
    </main>
  );
}
