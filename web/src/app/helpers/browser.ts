import { headers } from "next/headers";

export function isFirstRequest():boolean {
  const check = headers().get("accept")?.includes("text/html");
  return check === true;
}