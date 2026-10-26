const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TOKEN_KEY = "md_admin_token";

const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
const setToken = (t) => {
  try {
    t
      ? sessionStorage.setItem(TOKEN_KEY, t)
      : sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked */
  }
};

// Generic call to the Supabase REST API. admin:true sends the admin's login token.
export async function rest(path, { method = "GET", body, admin = false } = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${(admin && getToken()) || KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Admin login (Supabase Auth, email + password)
export async function adminSignIn(email, password) {
  const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) return { error: true };
  setToken(data.access_token);
  return { error: false };
}

export const adminSignOut = () => setToken(null);
