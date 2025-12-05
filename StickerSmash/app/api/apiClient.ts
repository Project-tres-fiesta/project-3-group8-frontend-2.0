import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Android emulators cannot reach localhost on your computer.
 * Use 10.0.2.2 for Android emulator; use http://localhost:8080 for web/iOS simulator.
 */
const ANDROID_DEV_BASE = "http://10.0.2.2:8080";
const WEB_DEV_BASE = "http://localhost:8080";
const PROD_FALLBACK = "https://group8-backend-0037104cd0e1.herokuapp.com";

// 1️⃣ Prefer env var if present (works locally + on Heroku frontend)
let baseURL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? Platform.OS === "android"
      ? ANDROID_DEV_BASE
      : WEB_DEV_BASE
    : PROD_FALLBACK);

console.log("📡 apiClient baseURL =", baseURL);

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Will get token from the right storage depending on platform 

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

// Attach Authorization header for token
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

