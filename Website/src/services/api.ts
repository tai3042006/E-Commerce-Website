const TOKEN_KEY = "clofit:token";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getAuthToken() ? { "x-auth-token": getAuthToken()! } : {}),
});

/** Thin wrapper around fetch that attaches the auth token and parses JSON. */
export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const r = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error ?? "request_failed");
  return data;
}
