// app/apiClient.ts
import axios from "axios";
import { Platform } from "react-native";
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
  withCredentials: true,
});

// --- get token from the right storage depending on platform ---

async function getToken(): Promise<string | null> {
  // Web: use localStorage (where your login code stores it)
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("jwt");
    }
    return null;
  }

  // Native (Android/iOS): SecureStore
  try {
    return await SecureStore.getItemAsync("jwt");
  } catch (e) {
    console.warn("SecureStore error", e);
    return null;
  }
}

// Attach Authorization header *if* we have a token
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getUsers() {
  const res = await apiClient.get("/api/users");
  return res.data;
}

export default apiClient;

