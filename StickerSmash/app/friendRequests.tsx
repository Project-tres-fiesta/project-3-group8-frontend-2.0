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

// Match the pattern used elsewhere (dev vs prod)
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

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

// --- Types -------------------------------------------------

type Friendship = {
  id: number;
  user1Id: number;
  user2Id: number;
  requestedBy: number;
  status: string;
  // we will enrich with this on the frontend:
  otherUser?: FriendUser;
};

type FriendUser = {
  userId: number;
  userName: string | null;
  userEmail: string;
  profilePicture?: string | null;
};

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

      // 1️⃣ Get current user profile so we know *my* userId
      const meRes = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) {
        const txt = await meRes.text().catch(() => "");
        throw new Error(txt || `Error fetching profile: ${meRes.status}`);
      }
      const me = await meRes.json();
      const myId: number = me.userId;

      // 2️⃣ Get pending friendships (FriendshipDto[])
      const res = await fetch(`${API_BASE}/api/friendships/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error: ${res.status}`);
      }

      const raw: Friendship[] = await res.json();
      console.log("Pending friendships:", raw);

      if (raw.length === 0) {
        setPending([]);
        return;
      }

      // 3️⃣ Enrich each friendship with the "other" user object
      const enriched: Friendship[] = await Promise.all(
        raw.map(async (f) => {
          // figure out which side is the other user
          const otherId = myId === f.user1Id ? f.user2Id : f.user1Id;

          try {
            const uRes = await fetch(`${API_BASE}/api/users/${otherId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!uRes.ok) {
              const txt = await uRes.text().catch(() => "");
              console.warn(
                `Failed to fetch user ${otherId}:`,
                uRes.status,
                txt
              );
              return f;
            }

            const user: FriendUser = await uRes.json();
            return { ...f, otherUser: user };
          } catch (err) {
            console.warn("Error fetching user for friendship", f.id, err);
            return f;
          }
        })
      );

      setPending(enriched);
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

  const actOnRequest = async (
    friendshipId: number,
    action: "accept" | "reject"
  ) => {
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
    // after enrichment, this should be set
    const otherUser = item.otherUser || null;

    const displayName =
      otherUser?.userName || otherUser?.userEmail || "Unknown user";
    const email = otherUser?.userEmail || "";

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