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
  const [friendsCount, setFriendsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  useEffect(() => {
    const loadProfileAndStats = async () => {
      const token = await getJwt();
      console.log("Token sent to backend:", token);

      if (!token) {
        console.warn("No JWT token found – user probably not logged in.");
        return;
      }

      try {
        // 1) Profile
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Backend error: ${res.status}`);
        const data: Profile = await res.json();
        console.log("User profile:", data);
        setProfile(data);

        // 2) Friends list (for count)
        try {
          const friendsRes = await fetch(
            `${API_BASE}/api/friendships/friends-users`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (friendsRes.ok) {
            const friends = await friendsRes.json();
            setFriendsCount(Array.isArray(friends) ? friends.length : 0);
          } else {
            console.warn(
              "Failed to fetch friends for count:",
              friendsRes.status
            );
          }
        } catch (e) {
          console.warn("Error loading friends count", e);
        }

        // 3) User events (booked / saved)
        try {
          const eventsRes = await fetch(
            `${API_BASE}/api/user-events/user/${data.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (eventsRes.ok) {
            const events = await eventsRes.json();
            setEventsCount(Array.isArray(events) ? events.length : 0);
          } else {
            console.warn(
              "Failed to fetch user events for count:",
              eventsRes.status
            );
          }
        } catch (e) {
          console.warn("Error loading events count", e);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    loadProfileAndStats();
  }, []);

  const handleSignOut = async () => {
    await clearJwt();
    Alert.alert("Signed out", "You have been signed out.");
    router.replace("/"); // goes back to index -> redirect to login
  };

  const handleDeleteAccount = () => {
  console.log("[Profile] Delete Account pressed");

  const doDelete = async () => {
    try {
      const token = await getJwt();
      console.log("[Profile] JWT for delete:", token);

      if (!token) {
        Alert.alert(
          "Not logged in",
          "Please log in again before deleting your account."
        );
        return;
      }

      const res = await fetch(`${API_BASE}/api/users/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[Profile] Delete response status:", res.status);

      if (res.status === 204 || res.status === 200) {
        await clearJwt();
        Alert.alert("Account deleted", "Your account has been deleted.");
        router.replace("/");
      } else if (res.status === 401) {
        Alert.alert(
          "Unauthorized",
          "You are not authorized. Please log in again."
        );
      } else if (res.status === 404) {
        Alert.alert(
          "Not found",
          "Your account could not be found. It may have already been deleted."
        );
      } else {
        const text = await res.text().catch(() => "");
        Alert.alert(
          "Error",
          text || `Failed to delete account (status ${res.status}).`
        );
      }
    } catch (e: any) {
      console.error("Error deleting account:", e);
      Alert.alert(
        "Error",
        e?.message || "Something went wrong deleting your account."
      );
    }
  };

  if (Platform.OS === "web") {
    // Web: Alert buttons don't work, so use window.confirm
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Are you sure? This will permanently delete your account and related data."
      );
      if (ok) {
        void doDelete();
      }
    }
  } else {
    // Native: use React Native Alert with buttons
    Alert.alert(
      "Delete Account",
      "Are you sure? This will permanently delete your account and related data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("[Profile] Confirmed delete");
            void doDelete();
          },
        },
      ]
    );
  }
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

        {/* Stats (now real counts) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              {friendsCount}
            </ThemedText>
            <ThemedText type="caption">Friends</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              {eventsCount}
            </ThemedText>
            <ThemedText type="caption">Events</ThemedText>
          </View>
        </View>

        {/* Menu Items */}
        <ThemedView isCard style={styles.menuSection}>
          {/* Friend Requests */}
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

          {/* Friends list */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("../FriendsPage")}
          >
            <Ionicons name="people-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>
              Friends
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* My Events */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("../BookedEventsPage")}
          >
            <Ionicons name="ticket-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>
              My Events
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Notifications – still placeholder */}
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
          {/* Delete Account */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <ThemedText
              type="bodyLarge"
              style={[styles.menuText, { color: "#FF3B30" }]}
            >
              Delete Account
            </ThemedText>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}  testID="signOutButton" >
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