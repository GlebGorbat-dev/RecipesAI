/** API base URL without trailing slash to avoid double slashes in paths */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
