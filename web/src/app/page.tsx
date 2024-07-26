import styles from "./page.module.css";
import { App } from "./components/App";
import { WorkoutProvider } from "./contexts/WorkoutContext";

export default function Home() {
  return (
    <main className={[styles.main,'is-webapp'].join(' ')}>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>        
    </main>
  );
}
