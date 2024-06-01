'use server'

import { Client } from "@notionhq/client";

export type Routine = {
  id: string,
  name: string,
}

export type Workout = {
  routine: Routine,
  circuits: Circuit[],
  recovery: number
}

export type Circuit = {
  name: string,
  sets: ExcerciseSet[]
}

export type ExcerciseSet = {
  high: number,
  low: number,
  moves: Move[]
}

export type Move = {
  name: string,
  equipment: string,
  amount?: number,
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// given a page with an inline database view, retrieve the id of said database view.
async function getIdForDatabaseBlock(blockId: string): string {
  const block = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 1
  });

  return block.results[0].id;
}

// workouts are a complex graph of embedded database blocks. let's walk the tree to retrieve them.
export async function getWorkout(routine: Routine): Promise<Workout> {
  const page = await notion.pages.retrieve({
    page_id: routine.id,        
  })

  const circuitId = await getIdForDatabaseBlock(routine.id);
  const circuits = await notion.databases.query({
    database_id: circuitId
  })

  /*
  const moves = Promise.all(circuits.results.map(async circuit => {
    // TODO: load moves
    
  }));
  */
  
  // now we'll build all of this into a clear workout.

  console.log(circuits.results.length);
}

export async function getRoutines(): Promise<Routine[]> {
  const records = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE!
  })
  
  const routines = records.results.map(page => {
    try {
      return {
        id: page.id,
        // @ts-ignore: Notion API is annoying
        name: page.properties.Name.title[0].plain_text
      }      
    }
    catch(e) {
      console.error(`Failed to load page:: ${page.id}`);
    }
  }).filter(routine => routine !== undefined);


  // TODO: delete me
  const foo = await getWorkout(routines[0]);


  return routines;
}