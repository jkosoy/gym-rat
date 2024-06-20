import { existsSync, mkdirSync, writeFileSync } from "fs";
import { relative, resolve } from "path";
import { exit, title } from "process";
// @ts-ignore: Argv works fine
import { argv } from "yargs";
import { slugToTitleCase } from "./helpers/strings";

const name = argv['_'][0] || '';
if(!name || name === '') {
  console.error(`No name passed. Please use: yarn context [name-of-context]`);
  exit();
}

const titleCaseName = slugToTitleCase(name);
const path = resolve(__dirname,`../app/contexts/${titleCaseName}Context`);

if(existsSync(path)) {
  console.error(`Context already exists: ${titleCaseName}`);
  exit();
}

console.log(`⚙️   Creating ${titleCaseName} context...`);
mkdirSync(path);

writeFileSync(`${path}/index.ts`, `
import { ${titleCaseName}Context, ${titleCaseName}Provider } from "./${titleCaseName}Context";
export { ${titleCaseName}Context, ${titleCaseName}Provider }
`);

writeFileSync(`${path}/${titleCaseName}Context.tsx`, `
import { createContext, PropsWithChildren } from "react";

type ${titleCaseName}ContextProps = {}

export const ${titleCaseName}Context = createContext<${titleCaseName}ContextProps>({} as ${titleCaseName}ContextProps)

export function ${titleCaseName}Provider({children}: PropsWithChildren<${titleCaseName}ContextProps>) {
    return (
        <${titleCaseName}Context.Provider value={{
        }}>
            {children}
        </${titleCaseName}Context.Provider>
    )
}
`);

const relativePath = relative(__dirname, path);
console.log(`🎉  ${titleCaseName} component generated at ${relativePath}/${titleCaseName}.tsx`);

console.log(`⚙️   Creating use${titleCaseName} convenience hook...`);
const hookPath = resolve(__dirname,`../app/hooks/use${titleCaseName}.ts`);

if(existsSync(hookPath)) {
  console.warn(`Hook already exists: use${titleCaseName}. Exiting.`);
  exit();
}

writeFileSync(`${hookPath}`, `
import { useContext } from "react";
import { ${titleCaseName}Context } from "@/app/contexts/${titleCaseName}Context";

export function use${titleCaseName}() {
    return useContext(${titleCaseName}Context);
}
`);
  
const hookRelativePath = relative(__dirname, hookPath);
console.log(`🎉  use${titleCaseName} hook generated at ${hookRelativePath}`);