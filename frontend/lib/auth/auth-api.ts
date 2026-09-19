const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: AuthUser;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message ?? "Login failed");
  }

  return response.json();
}

export async function refresh(): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Refresh token expired");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Authentication required");
  }

  const data = (await response.json()) as AuthResponse;

  return data.user;
}
