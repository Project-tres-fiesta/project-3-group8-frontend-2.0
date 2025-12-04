// app/(tabs)/profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedView } from "../../components/themed-view";
import { ThemedText } from "../../components/themed-text";
import { Ionicons } from "@expo/vector-icons";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

type Profile = {
  userId: number;
  userName: string | null;
  userEmail: string;
  profilePicture?: string | null;
};

async function getJwt(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem("jwt");
      }
      return null;
    } else {
      return await SecureStore.getItemAsync("jwt");
    }
  } catch (e) {
    console.warn("Error reading JWT", e);
    return null;
  }
}

async function clearJwt() {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("jwt");
      }
    } else {
      await SecureStore.deleteItemAsync("jwt");
    }
  } catch (e) {
    console.warn("Error clearing JWT", e);
  }
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const token = await getJwt();
      console.log("Token sent to backend:", token);

      if (!token) {
        console.warn("No JWT token found – user probably not logged in.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Backend error: ${res.status}`);
        const data: Profile = await res.json();
        console.log("User profile:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    getProfile();
  }, []);

  const handleSignOut = async () => {
    await clearJwt();
    Alert.alert("Signed out", "You have been signed out.");
    router.replace("/"); // goes back to index -> redirect to login
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollContent}>
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.avatarContainer}>
            <Ionicons name="person" size={80} color="#1E90FF" />
          </ThemedView>
          <ThemedText type="title" style={styles.profileName}>
            {profile?.userName || "User"}
          </ThemedText>
          <ThemedText type="body" style={styles.profileHandle}>
            {profile?.userEmail || "Not logged in"}
          </ThemedText>
        </ThemedView>

        {/* Stats (dummy for now) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              12
            </ThemedText>
            <ThemedText type="caption">Tickets</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              5
            </ThemedText>
            <ThemedText type="caption">Friends</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              23
            </ThemedText>
            <ThemedText type="caption">Events</ThemedText>
          </View>
        </View>

        {/* Menu Items */}
        <ThemedView isCard style={styles.menuSection}>
          {/* NEW: Friend Requests entry */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/friendRequests")}
          >
            <Ionicons name="person-add-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>
              Friend Requests
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="ticket-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>
              My Tickets
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="card-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>
              Payment Methods
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>
              Notifications
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </ThemedView>

        {/* Account Section */}
        <ThemedView
          isCard
          style={[styles.menuSection, styles.accountSection]}
        >
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>
              Settings
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <ThemedText type="bodyLarge" style={styles.logoutText}>
              Sign Out
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 40,
    paddingTop: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontWeight: "900",
    fontSize: 32,
  },
  profileHandle: {
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#1E90FF",
  },
  menuSection: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  accountSection: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logoutText: {
    flex: 1,
    marginLeft: 16,
    color: "#FF3B30",
  },
});