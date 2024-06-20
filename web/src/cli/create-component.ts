import { existsSync, mkdirSync, writeFileSync } from "fs";
import { relative, resolve } from "path";
import { exit, title } from "process";
// @ts-ignore: Argv works fine
import { argv } from "yargs";
import { slugToTitleCase } from "./helpers/strings";

const name = argv['_'][0] || '';
if(!name || name === '') {
  console.error(`No name passed. Please use: yarn component [name-of-component]`);
  exit();
}

const titleCaseName = slugToTitleCase(name);
const path = resolve(__dirname,`../app/components/${titleCaseName}`);

if(existsSync(path)) {
  console.error(`Component already exists: ${titleCaseName}`);
  exit();
}

console.log(`⚙️   Creating ${titleCaseName} component...`);
mkdirSync(path);

writeFileSync(`${path}/index.ts`, `
import { ${titleCaseName} } from "./${titleCaseName}";
export { ${titleCaseName} };
`);

writeFileSync(`${path}/${titleCaseName}.tsx`, `
import { PropsWithoutRef } from "react";
import styles from './${titleCaseName}.module.css';

type ${titleCaseName}Props = {}

export function ${titleCaseName}({}: PropsWithoutRef<${titleCaseName}Props>) {
  return (
    <div>${titleCaseName} component</div>
  );
}
`);
writeFileSync(`${path}/${titleCaseName}.module.css`, ``);

const relativePath = relative(__dirname, path);
console.log(`🎉  ${titleCaseName} component generated at ${relativePath}/${titleCaseName}.tsx`);