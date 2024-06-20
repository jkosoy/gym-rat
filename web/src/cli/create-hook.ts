import { existsSync, mkdirSync, writeFileSync } from "fs";
import { relative, resolve } from "path";
import { exit, title } from "process";
// @ts-ignore: Argv works fine
import { argv } from "yargs";
import { slugToTitleCase } from "./helpers/strings";

const name = argv['_'][0] || '';
if(!name || name === '') {
  console.error(`No name passed. Please use: yarn hook [name-of-hook]`);
  exit();
}

const titleCaseName = slugToTitleCase(name);
const path = resolve(__dirname,`../app/hooks/use${titleCaseName}.ts`);

if(existsSync(path)) {
  console.error(`Hook already exists: use${titleCaseName}`);
  exit();
}

console.log(`⚙️   Creating use${titleCaseName} hook...`);

writeFileSync(`${path}`, `
import { useState, useEffect } from "react";

export function use${titleCaseName}() {
}`);

const relativePath = relative(__dirname, path);
console.log(`🎉  ${titleCaseName} component generated at ${relativePath}`);