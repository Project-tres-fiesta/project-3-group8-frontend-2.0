import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';

interface Event {
  id: string;
  title: string;
  date: string;
}

const bookedEvents: Event[] = [
  { id: '1', title: 'Concert Night', date: '2025-12-04' },
  { id: '2', title: 'Football Game', date: '2025-12-10' },
];


const BookedEventsPage: React.FC = () => {

  const getUserId = async (token: string): Promise<number | null> => {
  try {
    const res = await fetch("http://localhost:8080/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    console.log("User profile:", data);
    console.log("Fetched user ID:", data.userId);
    return data.userId; // assuming backend returns { id: number, ... }
  } catch (err) {
    console.error("Error fetching profile for user ID:", err);
    return null;
  }
};

  const [userEvents, setUserEvents] = useState(null);
//const [profile, setProfile] = useState(null);

useEffect(() => {
  const fetchBookedEvents = async () => {
    const token = localStorage.getItem("jwt");
      const id = await getUserId(token!);
      if (!id) return;

      console.log("Token sent to backend:", token);

      try {
        const res = await fetch(`http://localhost:8080/api/user-events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Backend error: ${res.status}`);
        const data = await res.json();
        console.log("User events:", data);
        setUserEvents(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    // Fetch booked events logic here
    // For now, we use the static bookedEvents array
  }
  fetchBookedEvents();
  console.log("BookedEventsPage mounted");
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Booked Events</Text>
      <FlatList
  data={userEvents}
  keyExtractor={(item) => item.event.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.event.title}</Text>
      <Text style={styles.eventDate}>{item.event.eventDate + " " + item.event.eventTime}</Text>
      <Text>{item.event.venueName + ": " + item.event.venueCity + " " + item.event.venueState + " " + item.event.venueCountry}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.event.eventUrl)}>
        <Text>{item.event.eventUrl}</Text>
      </TouchableOpacity>
      <Image source={item.event.imageUrl} style={{width: 400, height: 200,}} />
    </View>
  )}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  eventCard: { padding: 15, backgroundColor: '#e6f0ff', marginBottom: 10, borderRadius: 6 },
  eventTitle: { fontSize: 18, fontWeight: '600' },
  eventDate: { color: '#666', fontSize: 14 },
});

export default BookedEventsPage;
