// API base URL — points to the Express server when running locally
// Falls back gracefully when server is unavailable (e.g., in Lovable preview)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Helper for making authenticated API requests.
 * Automatically attaches the JWT token from localStorage.
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * Checks if the backend server is reachable.
 * Used to decide between API calls and mock fallback.
 */
let _serverAvailable: boolean | null = null;

export async function isServerAvailable(): Promise<boolean> {
  if (_serverAvailable !== null) return _serverAvailable;

  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(2000),
    });
    _serverAvailable = res.ok;
  } catch {
    _serverAvailable = false;
  }

  return _serverAvailable;
}
