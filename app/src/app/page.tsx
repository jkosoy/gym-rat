import styles from "./page.module.css";
import { MenuScreen } from "./components/MenuScreen";
import { WorkoutScreen } from "./components/WorkoutScreen";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { tempWorkout } from "./temp/workout";

export default function Home() {
  return (
    <main className={styles.main}>
      <WorkoutProvider workout={tempWorkout}>
        <WorkoutScreen />
      </WorkoutProvider>        
    </main>
  );
}
