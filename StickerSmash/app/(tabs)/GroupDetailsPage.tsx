import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "../../components/themed-view";
import { ThemedText } from "../../components/themed-text";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

type Event = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  imageUrl: string;
  venueName: string;
  venueCity: string;
  venueState: string;
  venueCountry: string;
  category: string;
  genre: string;
  eventUrl: string;
};

type User = {
  userId: number;
  userName: string;
  userEmail: string;
  profilePicture: string;
};

export default function GroupDetailsPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (!groupId) return;

        // Events for group
        const resEvents = await fetch(`${API_BASE}/api/groupEvents/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resEvents.ok) {
          throw new Error(`Error fetching group events: ${resEvents.status}`);
        }
        const eventIds: number[] = await resEvents.json();

        const eventPromises = eventIds.map(async (eventId) => {
          const eventRes = await fetch(`${API_BASE}/api/events/stored/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!eventRes.ok) throw new Error(`Error fetching event ${eventId}`);
          const data = await eventRes.json();
          return data.event;
        });
        const eventDetails = await Promise.all(eventPromises);
        setEvents(eventDetails);

        // Users for group
        const resUsers = await fetch(
          `${API_BASE}/api/groupMembers/group/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resUsers.ok) {
          throw new Error(`Error fetching group users: ${resUsers.status}`);
        }
        const userIds: number[] = await resUsers.json();

        const userPromises = userIds.map(async (userId) => {
          const userRes = await fetch(`${API_BASE}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!userRes.ok) throw new Error(`Error fetching user ${userId}`);
          const data = await userRes.json();
          return data;
        });
        const userDetails = await Promise.all(userPromises);
        setUsers(userDetails);
      } catch (err) {
        console.error("Error fetching group data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, token]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.groupTitle}>
          Group ID: {groupId}
        </ThemedText>

        {/* Events Section */}
        <ThemedText type="headline" style={styles.sectionTitle}>
          Events
        </ThemedText>
        {events.length === 0 ? (
          <ThemedText type="body" style={styles.emptyText}>
            This group doesn’t have any events yet.
          </ThemedText>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              {event.imageUrl ? (
                <Image
                  source={{ uri: event.imageUrl }}
                  style={styles.eventImage}
                />
              ) : null}
              <Text style={styles.eventTitle}>{event.title}</Text>
              {event.description ? (
                <Text style={styles.eventDesc}>{event.description}</Text>
              ) : null}
              <Text style={styles.eventInfo}>
                {event.category} • {event.genre}
              </Text>
              <Text style={styles.eventInfo}>
                {event.eventDate} {event.eventTime}
              </Text>
              <Text style={styles.eventInfo}>
                {event.venueName}, {event.venueCity}, {event.venueState},{" "}
                {event.venueCountry}
              </Text>
              {event.eventUrl ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(event.eventUrl)}
                >
                  <Text style={styles.eventLink}>
                    View Tickets / Event Page
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))
        )}

        {/* Users Section */}
        <ThemedText type="headline" style={styles.sectionTitle}>
          Members
        </ThemedText>
        {users.length === 0 ? (
          <ThemedText type="body" style={styles.emptyText}>
            No members yet.
          </ThemedText>
        ) : (
          users.map((user) => (
            <View key={user.userId} style={styles.userCard}>
              {user.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={styles.userImage}
                />
              ) : (
                <View style={styles.defaultAvatar} />
              )}
              <View>
                <Text style={styles.userName}>{user.userName}</Text>
                <Text style={styles.userEmail}>{user.userEmail}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  groupTitle: {
    fontWeight: "900",
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "700",
  },
  emptyText: {
    opacity: 0.7,
  },
  eventCard: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
  },
  eventImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 6,
  },
  eventInfo: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 2,
  },
  eventLink: {
    marginTop: 6,
    color: "#1E90FF",
    fontWeight: "600",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  defaultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#333",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  userEmail: {
    fontSize: 13,
    color: "#aaa",
  },
});
