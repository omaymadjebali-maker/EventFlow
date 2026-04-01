const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export async function apiFetch(path, { token, method = "GET", body } = {}) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const msg = data?.message || (data?.errors?.[0]?.msg ?? "Request failed");
    throw new Error(msg);
  }

  return data;
}
