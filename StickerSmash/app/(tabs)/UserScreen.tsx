import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
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

const API_BASE = "https://group8-backend-0037104cd0e1.herokuapp.com";
//const API_BASE = "http://localhost:8080"; 

type User = {
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

const UsersScreen: React.FC = () => {
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

      // 1) fetch my profile
      const meRes = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) throw new Error(`Profile error: ${meRes.status}`);
      const meData: User = await meRes.json();
      setMe(meData);

      // 2) fetch all users
      const usersRes = await fetch(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersRes.ok) throw new Error(`Users error: ${usersRes.status}`);
      const allUsers: User[] = await usersRes.json();

      // 3) filter out myself
      const filtered =
        meData == null
          ? allUsers
          : allUsers.filter((u) => u.userId !== meData.userId);

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
        // 👇 this key must match your FriendRequestCreate DTO field name
        toUserId: toUserId,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed: ${res.status}`);
    }

    Alert.alert("Request sent", "Your friend request is pending.");
  } catch (e: any) {
    const msg = e?.message || "Failed to send friend request.";
    Alert.alert("Error", msg);
  } finally {
    setSendingTo(null);
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading users…</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.row}>
      <Image
        source={{
          uri:
            item.profilePicture ??
            "https://placehold.co/64x64?text=🙋",
        }}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.userName ?? "(no name)"}</Text>
        <Text style={styles.email}>{item.userEmail}</Text>
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
          <ActivityIndicator />
        ) : (
          <Text style={styles.btnText}>Add friend</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(u) => String(u.userId)}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      contentContainerStyle={
        users.length === 0 ? styles.emptyContainer : undefined
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={<Text style={styles.empty}>No users yet.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  name: { fontSize: 16, fontWeight: "600" },
  email: { fontSize: 13, color: "#666", marginTop: 2 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#0d6efd",
    borderRadius: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "600" },
  sep: { height: 1, backgroundColor: "#eee" },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { color: "#666" },
});

export default UsersScreen;
