import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";

const API_BASE = "https://group8-backend-0037104cd0e1.herokuapp.com";

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

type Friendship = any;

const FriendRequestsScreen: React.FC = () => {
  const [pending, setPending] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<number | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getJwt();
      if (!token) {
        Alert.alert("Not logged in", "Please log in first.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/friendships/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error: ${res.status}`);
      }

      const data: Friendship[] = await res.json();
      console.log("Pending friendships:", data);
      setPending(data);
    } catch (e: any) {
      console.warn("Failed to load pending friendships", e?.message ?? e);
      Alert.alert("Error", "Could not load friend requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const actOnRequest = async (friendshipId: number, action: "accept" | "reject") => {
    try {
      const token = await getJwt();
      if (!token) {
        Alert.alert("Not logged in", "Please log in first.");
        return;
      }

      setActingOn(friendshipId);

      const res = await fetch(`${API_BASE}/api/friendships/${friendshipId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error: ${res.status}`);
      }

      const updated = await res.json();
      console.log("Updated friendship:", updated);

      await loadPending();
      Alert.alert(
        action === "accept" ? "Friend added" : "Request rejected",
        action === "accept"
          ? "You are now friends!"
          : "You rejected this friend request."
      );
    } catch (e: any) {
      const msg = e?.message || "Failed to update friend request.";
      Alert.alert("Error", msg);
    } finally {
      setActingOn(null);
    }
  };

  const renderItem = ({ item }: { item: Friendship }) => {
    const otherUser =
      item.requester ||
      item.fromUser ||
      item.sender ||
      item.user ||
      item.requesterUser ||
      null;

    const displayName =
      otherUser?.userName || otherUser?.name || "Unknown user";
    const email = otherUser?.userEmail || otherUser?.email || "";

    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{displayName}</Text>
          {email ? <Text style={styles.email}>{email}</Text> : null}
          <Text style={styles.statusText}>wants to be your friend</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => actOnRequest(item.id, "accept")}
            disabled={actingOn === item.id}
          >
            {actingOn === item.id ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.btnText}>Accept</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            onPress={() => actOnRequest(item.id, "reject")}
            disabled={actingOn === item.id}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading friend requests…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pending}
      keyExtractor={(item, idx) => String(item.id ?? idx)}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      contentContainerStyle={
        pending.length === 0 ? styles.emptyContainer : undefined
      }
      ListEmptyComponent={
        <Text style={styles.empty}>No pending friend requests.</Text>
      }
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
  name: { fontSize: 16, fontWeight: "600" },
  email: { fontSize: 13, color: "#666", marginTop: 2 },
  statusText: { fontSize: 12, color: "#999", marginTop: 2 },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  acceptBtn: {
    backgroundColor: "#28a745",
  },
  rejectBtn: {
    backgroundColor: "#dc3545",
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  sep: { height: 1, backgroundColor: "#eee" },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  empty: { color: "#666" },
});

export default FriendRequestsScreen;
