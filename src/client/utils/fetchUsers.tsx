import BASE_URL from "../../config";

const USERS_URL = `${BASE_URL}/api/users`;

export interface User {
  id: number | string;
  name: string;
}

// tries the live api first, caches on success
// falls back to the last cached list if the request fails
export async function fetchUsersWithFallback(): Promise<User[]> {
  try {
    const res = await fetch(USERS_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: User[] = await res.json();
    localStorage.setItem("allUsers", JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = localStorage.getItem("allUsers");
    return cached ? JSON.parse(cached) : [];
  }
}