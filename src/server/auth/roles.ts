export function isAdminRole(role: unknown): role is "ADMIN" {
  return role === "ADMIN";
}
