import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';

export default function GroupsPage() {
    const token = localStorage.getItem("jwt");

    const getUserId = async (token: string): Promise<number | null> => {
  try {
    const res = await fetch("http://localhost:8080/api/users/profile", {
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
    const res = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
        body: JSON.stringify({groupName: groupName, userId: userId}),
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
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  React.useEffect(() => {
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

      const res = await fetch(`http://localhost:8080/api/groupMembers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: {
            groupId: groupId,   // the group the user wants to join
            userId: userId  // the logged-in user's ID
        } })
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      console.log(`User ${userId} added to group ${groupId}`);
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>

      <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>

      {/* Display groups */}
      <View style={{ marginTop: 20 }}>
        {groups.map((group: any) => (
          <View key={group.groupId} style={{ padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 }}>
            <Text style={{ fontSize: 16 }}>{group.groupName}</Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#4A90E2', padding: 8, borderRadius: 6, marginTop: 6, alignItems: 'center' }}
              onPress={() => joinGroup(group.groupId)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Join Group</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a New Group</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleCreateGroup}>
                <Text style={styles.saveText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  createButton: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center' },
  createButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { padding: 10 },
  cancelText: { fontSize: 16, color: 'red' },
  saveButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 8 },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
