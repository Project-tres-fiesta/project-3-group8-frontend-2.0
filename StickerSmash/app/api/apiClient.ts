// app/apiClient.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

/**
 * Android emulators cannot reach localhost on your computer.
 * Use 10.0.2.2 for Android emulator; use http://localhost:8080 for iOS simulator.
 */
const DEV_BASE = "http://10.0.2.2:8080"; // local backend
const PROD_BASE = "https://group8-backend-0037104cd0e1.herokuapp.com";

const baseURL =
  process.env.NODE_ENV === "development" ? DEV_BASE : PROD_BASE;

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 👈 important for session cookies from OAuth
});

// If you later add JWT support (not required yet)
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function getUsers() {
  const res = await apiClient.get("/api/users");
  return res.data;
}

export default apiClient;
