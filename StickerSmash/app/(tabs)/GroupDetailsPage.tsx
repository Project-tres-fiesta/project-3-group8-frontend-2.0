import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://group8-backend-0037104cd0e1.herokuapp.com';

// Types
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
  const token = localStorage.getItem('jwt'); // Replace with actual JWT

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (!groupId) return;

        // ------------------------
        // Fetch Event IDs for Group
        // ------------------------
        const resEvents = await fetch(`${API_BASE}/api/groupEvents/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resEvents.ok) throw new Error(`Error fetching group events: ${resEvents.status}`);
        const eventIds: number[] = await resEvents.json();

        // Fetch full event details
        const eventPromises = eventIds.map(async (eventId) => {
          const eventRes = await fetch(`${API_BASE}/api/events/stored/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!eventRes.ok) throw new Error(`Error fetching event ${eventId}`);
          const data = await eventRes.json();
          return data.event; // backend wraps event object under `event`
        });
        const eventDetails = await Promise.all(eventPromises);
        setEvents(eventDetails);

        // ------------------------
        // Fetch User IDs for Group
        // ------------------------
        const resUsers = await fetch(`${API_BASE}/api/groupMembers/group/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUsers.ok) throw new Error(`Error fetching group users: ${resUsers.status}`);
        const userIds: number[] = await resUsers.json();

        // Fetch full user details
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
        console.error('Error fetching group data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.groupTitle}>Group ID: {groupId}</Text>

      {/* Events Section */}
      <Text style={styles.sectionTitle}>Events</Text>
      {events.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          {event.imageUrl && <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />}
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDesc}>{event.description}</Text>
          <Text style={styles.eventInfo}>Category: {event.category}</Text>
          <Text style={styles.eventInfo}>Genre: {event.genre}</Text>
          <Text style={styles.eventInfo}>
            Date: {event.eventDate} {event.eventTime}
          </Text>
          <Text style={styles.eventInfo}>
            Venue: {event.venueName}, {event.venueCity}, {event.venueState}, {event.venueCountry}
          </Text>
          {event.eventUrl && (
            <TouchableOpacity onPress={() => Linking.openURL(event.eventUrl)}>
              <Text style={styles.eventLink}>View Tickets / Event Page</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Users Section */}
      <Text style={styles.sectionTitle}>Members</Text>
      {users.map((user) => (
        <View key={user.userId} style={styles.userCard}>
          {user.profilePicture && <Image source={{ uri: user.profilePicture }} style={styles.userImage} />}
          <View>
            <Text style={styles.userName}>{user.userName}</Text>
            <Text style={styles.userEmail}>{user.userEmail}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  groupTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  eventCard: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  eventImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 10 },
  eventTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  eventDesc: { fontSize: 14, marginBottom: 6 },
  eventInfo: { fontSize: 14, marginBottom: 2 },
  eventLink: { color: '#4A90E2', marginTop: 6, fontWeight: 'bold' },
  userCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: '#555' },
});
