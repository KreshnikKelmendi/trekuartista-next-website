const STORAGE_KEY = "trekuartista_admin_session";

const ADMIN_USERNAME = "trekuartista1";
const ADMIN_PASSWORD = "18192021";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "authenticated";
}

export function setAdminAuthed(): void {
  localStorage.setItem(STORAGE_KEY, "authenticated");
}

export function clearAdminAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; field: "username" | "password" | "form"; message: string };

export function validateAdminLogin(
  username: string,
  password: string
): AdminLoginResult {
  const user = username.trim();

  if (!user) {
    return {
      ok: false,
      field: "username",
      message: "Username is required.",
    };
  }

  if (!password) {
    return {
      ok: false,
      field: "password",
      message: "Password is required.",
    };
  }

  if (user !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return {
      ok: false,
      field: "form",
      message: "Invalid username or password.",
    };
  }

  return { ok: true };
}
