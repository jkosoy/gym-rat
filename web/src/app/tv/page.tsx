import { CSSProperties } from "react";
import { WorkoutProvider } from "../contexts/WorkoutContext";
import styles from "./page.module.css";
import { App } from "@/app/components/App";

export default function Home() {
  return (
    <main className={styles.main} style={{
      '--scale': '0.5'
    } as CSSProperties}>
      <WorkoutProvider>
        <App isTV />
      </WorkoutProvider>
    </main>
  );
}
