export function toAdminRows(rows: object[]) {
  return rows.map((row) => {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === "string" || typeof value === "number") result[key] = String(value);
      else if (value instanceof Date) result[key] = value.toISOString().slice(0, 10);
      else if (typeof value === "object" && value !== null && "name" in value && typeof value.name === "string") result[key] = value.name;
    }
    return result;
  });
}
