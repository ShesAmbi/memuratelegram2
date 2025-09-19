export const API_BASE = process.env.REACT_APP_API_URL || "";

export async function fetchMe(token) {
  const res = await fetch("https://memuratelegram2.onrender.com/api/auth/me/", {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Not authorized");
  return res.json();
}
