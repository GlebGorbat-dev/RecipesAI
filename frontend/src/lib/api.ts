/** API base URL without trailing slash to avoid double slashes in paths */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

/** Build full API URL for a path (e.g. apiPath("api/v1/auth/google")) */
export function apiPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${p}`;
}
