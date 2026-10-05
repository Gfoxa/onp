export function nextPublishedAt(status: "DRAFT" | "PUBLISHED" | "ARCHIVED", current: Date | null, now = new Date()) {
  if (status !== "PUBLISHED") return null;
  return current ?? now;
}
