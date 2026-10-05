import { resolve, isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";

export function resolveSqliteUrl(databaseUrl: string, workingDirectory = process.cwd()): string {
  if (!databaseUrl.startsWith("file:")) return databaseUrl;
  const connection = databaseUrl.slice("file:".length);
  if (connection.startsWith("//")) return databaseUrl;

  const queryIndex = connection.indexOf("?");
  const relativePath = queryIndex === -1 ? connection : connection.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : connection.slice(queryIndex);
  const absolutePath = isAbsolute(relativePath) ? relativePath : resolve(workingDirectory, relativePath);
  return `${pathToFileURL(absolutePath).href}${query}`;
}
