'use server'

import { Client } from "@notionhq/client";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

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
  const block = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 1
  });

  if(block.results.length > 0) {
    return block.results[0].id;
  }
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
  const rawCircuitsDB = await getDatabaseInPage(routine.id);

  const circuits:Circuit[] = await Promise.all(rawCircuitsDB!.results.map(async rawCircuit => {
    let moves:Move[] = [];
    const rawMovesDB = await getDatabaseInPage(rawCircuit.id);
    if(rawMovesDB) {
      moves = await Promise.all(rawMovesDB.results.map(async rawMove => {
          // @ts-ignore: if a set has moves in it this relationship will exist
        const referenceMoveId = rawMove.properties["Move"].relation[0].id;
        const name = await getReferenceMoveById(referenceMoveId);      

        // @ts-ignore: if no reps are passed maybe it's an AMRAP
        const reps = rawMove.properties["Amount"].number || -1;
        
        let equipment = "";
        
        // @ts-ignore: if a set has moves in it this equipment rollup will exist
        if(rawMove.properties["Equipment"].rollup.array[0].select) {
          // @ts-ignore: if a set has moves in it this equipment rollup will exist
          equipment = rawMove.properties["Equipment"].rollup.array[0].select.name
        }

        return {
          name,
          equipment,
          reps
        }
      }));
    }

    // @ts-ignore: circuit is loaded
    const name = rawCircuit.properties["Name"].title[0].plain_text;
    // @ts-ignore: circuit is loaded
    const totalSets = rawCircuit.properties["Sets"].number || 1;
    // @ts-ignore: circuit is loaded
    const activeSeconds = rawCircuit.properties["High"].number || 0;
    // @ts-ignore: circuit is loaded
    const recoverySeconds = rawCircuit.properties["Low"].number || 0;

    const sets:ExcerciseSet[] = Array(totalSets).fill({
      activeSeconds,
      recoverySeconds,
      moves
    });

    return {
      name,
      sets
    }
  }));

  const { id, name, recoverySeconds } = routine;

  return {
    name,
    circuits,
    recoverySeconds
  }
}

export async function getRoutines(): Promise<Routine[]> {
  await sleep(5000);

  return [
    {
      id: 'abc123',
      name: 'Local Workout routine',
      recoverySeconds: 500
    }
  ]

  // const rawRoutines = await notion.databases.query({
  //   database_id: process.env.NOTION_DATABASE!,
  //   sorts: [
  //     {property: "Created", direction: "descending"}
  //   ]
  // })
  
  // const routines = rawRoutines.results.map(page => {
  //   try {
  //     // @ts-ignore: routine is loaded
  //     const name = page.properties["Name"].title[0].plain_text;

  //     // @ts-ignore: routine is loaded
  //     const recoverySeconds = page.properties["Recovery"].number || 0;

  //     return {
  //       id: page.id,
  //       name,
  //       recoverySeconds
  //     }      
  //   }
  //   catch(e) {
  //     console.error(`Failed to load page:: ${page.id}`);
  //   }
  // }).filter(routine => routine !== undefined);

  // return routines;
}