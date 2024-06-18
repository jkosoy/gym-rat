import { Workout } from "../types/Workout";

export const tempWorkout:Workout = {
  name: 'Test Routine #1 ',
  circuits: [
    {
      name: 'Warmup',
      sets: [ { activeSeconds: 0, recoverySeconds: 300, moves: [] } ]
    },
    {
      name: 'Circuit',
      sets: [
        {
          activeSeconds: 50,
          recoverySeconds: 10,
          moves: [
            { name: 'Plank jacks with differnet words', equipment: 'Tubes', reps: 10 },
            { name: 'Plank jacks', equipment: 'TRX', reps: 10 },
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank jacks', equipment: 'Slam Ball', reps: 10 },
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank w shoulder taps', equipment: '', reps: 20 }
          ]
        },
        {
          activeSeconds: 50,
          recoverySeconds: 10,
          moves: [
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank w shoulder taps', equipment: '', reps: 20 }
          ]
        },
        {
          activeSeconds: 50,
          recoverySeconds: 10,
          moves: [
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank w shoulder taps', equipment: '', reps: 20 }
          ]
        },
        {
          activeSeconds: 50,
          recoverySeconds: 10,
          moves: [
            { name: 'Plank jacks', equipment: '' },
            { name: 'Plank w shoulder taps', equipment: '' }
          ]
        },
        {
          activeSeconds: 50,
          recoverySeconds: 10,
          moves: [
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank w shoulder taps', equipment: '', reps: 20 }
          ]
        },
        {
          activeSeconds: 50,
          recoverySeconds: 10,
          moves: [
            { name: 'Plank jacks', equipment: '', reps: 10 },
            { name: 'Plank w shoulder taps', equipment: '', reps: 20 }
          ]
        }
      ]
    },
    {
      name: 'Circuit 2',
      sets: [ { activeSeconds: 20, recoverySeconds: 10, moves: [{name: 'Circuit 2 has 10 seconds', equipment: ''}] } ]
    },
    {
      name: 'Circuit 3',
      sets: [ { activeSeconds: 20, recoverySeconds: 0, moves: [{name: 'No recovery', equipment: ''}] } ]
    },
    {
      name: 'Cooldown',
      sets: [ { activeSeconds: 0, recoverySeconds: 300, moves: [] } ]
    }
  ],
  recoverySeconds: 45
}