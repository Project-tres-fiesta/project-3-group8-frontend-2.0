import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "../../components/themed-view";
import { ThemedText } from "../../components/themed-text";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

export default function GroupsPage() {
  const router = useRouter();
  const token = localStorage.getItem("jwt");

  const getUserId = async (token: string): Promise<number | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);

      const data = await res.json();
      return data.userId;
    } catch (err) {
      console.error("Error fetching profile for user ID:", err);
      return null;
    }
  };

  const createGroup = async (groupName: string, userId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupName: groupName, userId: userId }),
      });
      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error creating group:", err);
      return null;
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<any[]>([]);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    const userId = await getUserId(token!);
    if (!userId) return;
    await createGroup(groupName, userId);
    setGroupName("");
    setModalVisible(false);
    fetchGroups();
  };

  const joinGroup = async (groupId: number) => {
    try {
      const userId = await getUserId(token!);
      if (!userId) return;

      const res = await fetch(`${API_BASE}/api/groupMembers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: {
            groupId: groupId,
            userId: userId,
          },
        }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      console.log(`User ${userId} added to group ${groupId}`);
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Your Groups
      </ThemedText>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText type="bodyLarge" style={styles.createButtonText}>
          Create Group
        </ThemedText>
      </TouchableOpacity>

      <ScrollView
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {groups.map((group: any) => (
          <ThemedView key={group.groupId} isCard style={styles.groupCard}>
            <TouchableOpacity
              onPress={() =>
                router.push(`/GroupDetailsPage?groupId=${group.groupId}`)
              }
              style={styles.groupHeader}
              activeOpacity={0.8}
            >
              <ThemedText type="bodyLarge" style={styles.groupName}>
                {group.groupName}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => joinGroup(group.groupId)}
              activeOpacity={0.85}
            >
              <ThemedText type="body" style={styles.joinButtonText}>
                Join Group
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ))}
      </ScrollView>

      {/* Create Group Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ThemedView isCard style={styles.modalContent}>
            <ThemedText type="headline" style={styles.modalTitle}>
              Create a New Group
            </ThemedText>

            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor="#888"
              value={groupName}
              onChangeText={setGroupName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreateGroup}
              >
                <Text style={styles.saveText}>Create</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000", // match dark theme
  },
  title: {
    fontWeight: "900",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  groupCard: {
    marginBottom: 14,
    padding: 14,
    backgroundColor: "#111",
    borderRadius: 14,
  },
  groupHeader: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  groupName: {
    fontWeight: "700",
  },
  joinButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#111",
  },
  modalTitle: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "#1a1a1a",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#ff4d4f",
  },
  saveButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});