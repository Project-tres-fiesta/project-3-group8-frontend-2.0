import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "../../components/themed-view";
import { ThemedText } from "../../components/themed-text";

const API_BASE = "https://group8-backend-0037104cd0e1.herokuapp.com";
// const API_BASE = "http://localhost:8080";

type User = {
  userId: number;
  userName: string | null;
  userEmail: string;
  profilePicture?: string | null;
};

type FriendshipDto = {
  id: number;
  user1Id: number;
  user2Id: number;
  status: string; // "pending" | "accepted" | "rejected"
  requestedBy: number;
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

const UsersScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingTo, setSendingTo] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getJwt();
      if (!token) {
        Alert.alert("Not logged in", "Please log in first.");
        setLoading(false);
        return;
      }

      const authHeaders = { Authorization: `Bearer ${token}` };

      // 1) fetch my profile
      const meRes = await fetch(`${API_BASE}/api/users/profile`, {
        headers: authHeaders,
      });
      if (!meRes.ok) throw new Error(`Profile error: ${meRes.status}`);
      const meData: User = await meRes.json();
      setMe(meData);

      // 2) fetch all users
      const usersRes = await fetch(`${API_BASE}/api/users`, {
        headers: authHeaders,
      });
      if (!usersRes.ok) throw new Error(`Users error: ${usersRes.status}`);
      const allUsers: User[] = await usersRes.json();

      // 3) fetch existing friends (full user objects)
      const friendsRes = await fetch(
        `${API_BASE}/api/friendships/friends-users`,
        { headers: authHeaders }
      );

      let friendIds = new Set<number>();
      if (friendsRes.ok) {
        const friends: User[] = await friendsRes.json();
        friendIds = new Set(friends.map((u) => u.userId));
      }

      // 4) fetch pending friend requests for me
      const pendingRes = await fetch(`${API_BASE}/api/friendships/pending`, {
        headers: authHeaders,
      });

      let pendingIds = new Set<number>();
      if (pendingRes.ok) {
        const pending: FriendshipDto[] = await pendingRes.json();
        pendingIds = new Set(
          pending.map((f) =>
            f.user1Id === meData.userId ? f.user2Id : f.user1Id
          )
        );
      }

      // 5) filter:
      //    - not me
      //    - not already friend
      //    - no pending request either way
      const filtered =
        meData == null
          ? allUsers
          : allUsers.filter(
              (u) =>
                u.userId !== meData.userId &&
                !friendIds.has(u.userId) &&
                !pendingIds.has(u.userId)
            );

      setUsers(filtered);
    } catch (e: any) {
      console.warn("Failed to load users", e?.message ?? e);
      Alert.alert("Error", "Could not load users. Check your network/backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const onAddFriend = async (toUserId: number) => {
    try {
      const token = await getJwt();
      if (!token) {
        Alert.alert("Not logged in", "Please log in first.");
        return;
      }

      setSendingTo(toUserId);

      const res = await fetch(`${API_BASE}/api/friendships`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUserId,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      Alert.alert("Request sent", "Your friend request is pending.");
      // refresh so that user disappears from the list
      await load();
    } catch (e: any) {
      const msg = e?.message || "Failed to send friend request.";
      Alert.alert("Error", msg);
    } finally {
      setSendingTo(null);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <ThemedView isCard style={styles.row}>
      <Image
        source={{
          uri: item.profilePicture ?? "https://placehold.co/64x64?text=🙋",
        }}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <ThemedText type="bodyLarge" style={styles.name}>
          {item.userName ?? "(no name)"}
        </ThemedText>
        <ThemedText type="caption" style={styles.email}>
          {item.userEmail}
        </ThemedText>
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          sendingTo === item.userId && styles.btnDisabled,
        ]}
        onPress={() => onAddFriend(item.userId)}
        disabled={sendingTo === item.userId}
      >
        {sendingTo === item.userId ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText type="body" style={styles.btnText}>
            Add friend
          </ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView
        style={[
          styles.container,
          { paddingTop: insets.top, justifyContent: "center" },
        ]}
      >
        <View style={styles.center}>
          <ActivityIndicator />
          <ThemedText type="body" style={{ marginTop: 8 }}>
            Loading users…
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Find Friends
        </ThemedText>
        <ThemedText type="caption" style={styles.headerSubtitle}>
          Browse EventLink users and send friend requests
        </ThemedText>
      </View>

      {users.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={48} color="#1E90FF" />
          <ThemedText type="headline" style={{ marginTop: 12 }}>
            No users to add
          </ThemedText>
          <ThemedText type="body" style={{ opacity: 0.7, marginTop: 4 }}>
            You might already be friends with everyone here.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => String(u.userId)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </ThemedView>
  );
};

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
  headerSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  name: {
    fontWeight: "600",
  },
  email: {
    opacity: 0.7,
    marginTop: 2,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  sep: {
    height: 8,
  },
});

export default UsersScreen;
