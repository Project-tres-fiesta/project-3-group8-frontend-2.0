import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedView } from "../components/themed-view";
import { ThemedText } from "../components/themed-text";
import { Ionicons } from "@expo/vector-icons";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

type Friend = {
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

export default function FriendsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const token = await getJwt();
        if (!token) {
          console.warn("No JWT token found – user probably not logged in.");
          setFriends([]);
          return;
        }

        const res = await fetch(`${API_BASE}/api/friendships/friends-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Error fetching friends:", res.status);
          setFriends([]);
          return;
        }

        const data: Friend[] = await res.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const renderItem = ({ item }: { item: Friend }) => {
    const displayName = item.userName || item.userEmail;

    return (
      <TouchableOpacity
        style={styles.friendRow}
        onPress={() =>
          router.push({
            pathname: "/FriendEventsPage",
            params: {
              friendId: String(item.userId),
              friendName: displayName,
            },
          })
        }
      >
        <View style={styles.avatarContainer}>
          {item.profilePicture ? (
            <Image
              source={{ uri: item.profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={44} color="#1E90FF" />
          )}
        </View>
        <View style={styles.friendInfo}>
          <ThemedText type="bodyLarge" style={styles.friendName}>
            {displayName}
          </ThemedText>
          <ThemedText type="caption" style={styles.friendEmail}>
            {item.userEmail}
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Friends
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <ThemedText type="body" style={{ marginTop: 8 }}>
            Loading friends...
          </ThemedText>
        </View>
      ) : friends.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="people-outline" size={48} color="#1E90FF" />
          <ThemedText type="headline" style={{ marginTop: 12 }}>
            No friends yet
          </ThemedText>
          <ThemedText type="body" style={{ opacity: 0.7, marginTop: 4 }}>
            Send and accept friend requests to see them here.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => String(item.userId)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontWeight: "900",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontWeight: "600",
  },
  friendEmail: {
    opacity: 0.7,
  },
});