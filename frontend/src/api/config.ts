/**
 * In development, use the Vite proxy (relative /api).
 * In production on Vercel, set VITE_API_URL to your backend URL (e.g. https://your-backend.onrender.com).
 */
export const API_BASE =
  typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "";
