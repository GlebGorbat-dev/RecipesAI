export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export function apiPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${p}`;
}

export function assetPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "").replace(/^\/+/, "");
  const pathStr = base ? `/${base}${p}` : p;
  if (typeof window !== "undefined") {
    return window.location.origin + pathStr;
  }
  return pathStr;
}
