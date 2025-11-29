// app/(tabs)/ProfilePage.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const DARK_GREEN = "#254117";
const API_BASE = "https://group8-backend-0037104cd0e1.herokuapp.com";

// ----- types -----
type UserProfile = {
  userId: number;
  userName: string | null;
  userEmail: string;
  profilePicture?: string | null;
};

type Friendship = any; // we only need "other user" display info

// ----- helpers -----
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

// dummy data (you can later replace with real events)
const samplePastEvents = [
  { id: "1", title: "Concert at the Park", date: "2025-11-01" },
  { id: "2", title: "Art Expo 2025", date: "2025-10-21" },
];
const sampleUpcomingEvents = [
  { id: "3", title: "Festival of Lights", date: "2025-12-15" },
  { id: "4", title: "Winter Gala", date: "2026-01-10" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getJwt();
      if (!token) {
        console.warn("No JWT found; user probably not logged in");
        setLoading(false);
        return;
      }

      // 1) profile
      const profRes = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profRes.ok) {
        const data: UserProfile = await profRes.json();
        setProfile(data);
      } else {
        console.warn("Profile error", profRes.status);
      }

      // 2) friendships (we'll treat these as "friends list")
      const frRes = await fetch(`${API_BASE}/api/friendships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (frRes.ok) {
        const list: Friendship[] = await frRes.json();
        setFriends(list);
        console.log("Friendships:", list);
      } else {
        console.warn("Friendships error", frRes.status);
      }
    } catch (e) {
      console.warn("Failed to load profile/friends", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderFriend = ({ item }: { item: Friendship }) => {
    // Try to find "the other user" in a generic way
    const otherUser =
      item.friend ||
      item.otherUser ||
      item.requester ||
      item.addressee ||
      item.user ||
      null;

    const name =
      otherUser?.userName || otherUser?.name || "Friend";
    const email = otherUser?.userEmail || otherUser?.email || "";

    return (
      <ThemedText style={styles.listItem}>
        {name}
        {email ? ` — ${email}` : ""}
      </ThemedText>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
        <ThemedText style={{ marginTop: 8 }}>Loading profile…</ThemedText>
      </ThemedView>
    );
  }

  const initials =
    profile?.userName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <ThemedView style={styles.container}>
      {/* Avatar */}
      <View style={styles.profileImagePlaceholder}>
        {profile?.profilePicture ? (
          <Image
            source={{ uri: profile.profilePicture }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
        ) : (
          <ThemedText style={styles.initials}>{initials}</ThemedText>
        )}
      </View>

      {/* Name + email */}
      <ThemedText type="title" style={styles.username}>
        {profile?.userName || "Your Name"}
      </ThemedText>
      <ThemedText style={styles.emailText}>
        {profile?.userEmail || ""}
      </ThemedText>

      {/* View friend requests button */}
      <TouchableOpacity
        style={styles.requestsButton}
        onPress={() => router.push("/friendRequests")}
      >
        <ThemedText style={styles.requestsButtonText}>
          View friend requests
        </ThemedText>
      </TouchableOpacity>

      {/* Upcoming events */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Upcoming Events
      </ThemedText>
      <FlatList
        data={sampleUpcomingEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedText style={styles.listItem}>
            {item.title} - {item.date}
          </ThemedText>
        )}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Past events */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Past Events
      </ThemedText>
      <FlatList
        data={samplePastEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedText style={styles.listItem}>
            {item.title} - {item.date}
          </ThemedText>
        )}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Friends list */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Friends
      </ThemedText>
      <FlatList
        data={friends}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        renderItem={renderFriend}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <ThemedText style={styles.listItem}>
            You don’t have any friends yet.
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_GREEN,
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: DARK_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0B3D0B",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  initials: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },
  username: {
    textAlign: "center",
    color: "white",
    marginBottom: 4,
  },
  emailText: {
    textAlign: "center",
    color: "#dde",
    marginBottom: 16,
  },
  requestsButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#0d6efd",
    marginBottom: 16,
  },
  requestsButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
    color: "white",
  },
  list: {
    maxHeight: 140,
  },
  listItem: {
    fontSize: 16,
    color: "white",
  },
  separator: {
    height: 8,
  },
});

