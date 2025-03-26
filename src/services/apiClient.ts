// src/services/apiClient.ts

const BASE_URL = "https://prompt-pal-backend-c44b4d13347a.herokuapp.com/api";

const excludedRoutes = ["/login", "/signup"];

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = localStorage.getItem("access_token");
  const isExcluded = excludedRoutes.some((route) => endpoint.includes(route));

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (!isExcluded && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}
