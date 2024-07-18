'use server'

import { Client } from "@notionhq/client";
import { BlockObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

import { sleep } from "@/app/helpers/utility";
import { Routine, Workout, Circuit, ExcerciseSet, Move } from "@/app/types/Workout";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// given a notion page id, return a move name.
const moveCache = new Map<string, string>();
async function getReferenceMoveById(moveId: string):Promise<string> {
  if(moveCache.has(moveId)) {
    return moveCache.get(moveId)!;
  }

  const rawMove = await notion.pages.retrieve({
    page_id: moveId
  })

  // @ts-ignore:
  const name = rawMove.properties["Name"].title[0].plain_text
  moveCache.set(moveId, name);

  return name;
}

// given a page with an inline database view, retrieve the id of said database view.
async function getIdForDatabaseBlock(blockId: string): Promise<string|undefined> {
  const blocks = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100
  });

  const db = blocks.results.filter(result => (result as BlockObjectResponse).type === 'child_database');
  if(db.length === 0) {
    console.warn(`No database found in ${blockId}.`);
    return;
  }

  return db[0].id;
}

async function getDatabaseInPage(pageId: string): Promise<QueryDatabaseResponse|undefined>  {
  const databaseId = await getIdForDatabaseBlock(pageId);
  if(databaseId) {
    const rawDatabase = await notion.databases.query({
      database_id: databaseId,
      sorts: [{property: "Order",direction:"ascending"}]
    })
  
    return rawDatabase;  
  }
}

// workouts are a complex graph of embedded database blocks. let's walk the tree to retrieve them.
export async function getWorkout(routine: Routine): Promise<Workout> {
  const { name: routineName, recoverySeconds: routineRecoverySeconds } = routine;
  console.log(`Loading routine :: ${routineName} (${routine.id}).`)
  const rawCircuitsDB = await getDatabaseInPage(routine.id);

  const circuits:Circuit[] = await Promise.all(rawCircuitsDB!.results.map(async rawCircuit => {

    // @ts-ignore: circuit is loaded
    const name = rawCircuit.properties["Name"].title[0].plain_text;

    let moves:Array<Move[]> = [];
    console.log(`Loading circuit :: ${name} (${rawCircuit.id}).`);

    const rawMovesDB = await getDatabaseInPage(rawCircuit.id);
    if(rawMovesDB) {
      const flatMoves = await Promise.all(rawMovesDB.results.map(async rawMove => {
          // @ts-ignore: if a set has moves in it this relationship will exist
        const referenceMoveId = rawMove.properties["Move"].relation[0].id;
        const name = await getReferenceMoveById(referenceMoveId);      

        // @ts-ignore: if no reps are passed maybe it's an AMRAP
        const reps = rawMove.properties["Amount"].number || -1;

        // @ts-ignore: if no order is passed maybe it's an AMRAP
        let group = rawMove.properties["Order"].number || -1; 

        // allow for a group override if it exists. 
        // this allows us to sort items but keep them as a single set, such as for obstacle courses.
        try {
          // @ts-ignore: described above
          group = rawMove.properties["Group"].number || -1;
        }
        catch(e) {}

        let equipment = "";

        // @ts-ignore: if a set has moves in it this equipment rollup will exist
        if(rawMove.properties["Equipment"].rollup.array[0].select) {
          // @ts-ignore: if a set has moves in it this equipment rollup will exist
          equipment = rawMove.properties["Equipment"].rollup.array[0].select.name
        }

        return {
          name,
          equipment,
          reps,
          group
        }
      }));

      // chunk moves by group
      moves = Object.values(
        flatMoves.reduce((groups: Record<number, Move[]>, move:Move) => {
          if(!groups[move.group]) {
           groups[move.group] = [] 
          }

          groups[move.group].push(move)
          return groups;
        }, {})
      )
    }

    const type = (() => {
      if(name === "Warmup") {
        return "warmup";
      }

      if(name === "Cooldown") {
        return "cooldown";
      }

      try {
        // @ts-ignore: circuit is loaded and if a set has a type defined this will exist
        const t = rawCircuit.properties["Type"].select.name

        if(t === "Stations") {
          return "stations";
        }

        if(t === "Manual Reps") {
          return "manual";
        }

        return "amrap";
      }
      catch(e) {
        // AMRAP is default to make it easy to set up single sets like jump ropes
        return "amrap";
      }
    })();

    // @ts-ignore: circuit is loaded
    const totalSets = rawCircuit.properties["Sets"].number || 1;
    // @ts-ignore: circuit is loaded
    const activeSeconds = rawCircuit.properties["High"].number || 0;
    // @ts-ignore: circuit is loaded
    const recoverySeconds = rawCircuit.properties["Low"].number || 0;

    let hasCircuitRecovery = true;
    try {
      // @ts-ignore: circuit is loaded
      hasCircuitRecovery = (rawCircuit.properties["Skip Circuit Recovery?"].checkbox === true) ? false : true;
    }
    catch(e) {}

    const sets:ExcerciseSet[] = [];
    let currentGroup = 0;

    if(type === "warmup" || type === "cooldown") {
      sets.push({
        type: type,
        time: recoverySeconds,
        autoAdvance: true,
        moves: []
      })
    }
    else {
      for(let i=0;i<totalSets;i++) {
        sets.push({
          type: "active",
          time: activeSeconds,
          autoAdvance: type !== "manual",
          moves: moves[currentGroup]
        })
  
        if(recoverySeconds > 0) {
          sets.push({
            type: "recovery",
            time: recoverySeconds,
            autoAdvance: true,
            moves: []
          })
        }  
  
        currentGroup++;
        if(currentGroup >= moves.length) {
          currentGroup = 0;
        }  
      }

      if(hasCircuitRecovery) {
        sets.push({
          type: "circuit-recovery",
          time: routineRecoverySeconds,
          autoAdvance: true,
          moves: []
        })  
      }  
    }

    return {
      name,
      type,
      sets
    }
  }));

  // console.dir({
  //   name: routineName,
  //   circuits
  // }, { depth: null })

  return {
    name: routineName,
    circuits,
  }
}

export async function getRoutines(): Promise<Routine[]> {  
  const rawRoutines = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE!,
    sorts: [
      {property: "Created", direction: "descending"}
    ]
  })
  
  const routines = rawRoutines.results.map(page => {
    try {
      // @ts-ignore: routine is loaded
      const name = page.properties["Name"].title[0].plain_text;

      // @ts-ignore: routine is loaded
      const recoverySeconds = page.properties["Recovery"].number || 0;

      return {
        id: page.id,
        name,
        recoverySeconds
      }      
    }
    catch(e) {
      console.error(`Failed to load page:: ${page.id}`);
    }
  }).filter(routine => routine !== undefined);

  return routines as Routine[];
}