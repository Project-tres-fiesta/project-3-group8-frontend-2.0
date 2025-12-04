// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

// export default function GroupDetailsPage() {
//   const { groupId } = useLocalSearchParams<{ groupId: string }>(); // always string
//   console.log("GroupDetailsPage groupId:", groupId);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Group Details</Text>
//       <Text style={styles.groupIdText}>Group ID: {groupId}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   groupIdText: { fontSize: 18 }
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

// export default function GroupDetailsPage() {
//   const { groupId } = useLocalSearchParams<{ groupId: string }>();
//   const [events, setEvents] = useState<number[]>([]); // store the event IDs (or change to objects if backend returns more info)
//   const token = "YOUR_JWT_TOKEN_HERE"; // replace with actual token or AsyncStorage

//   useEffect(() => {
//     const fetchGroupEvents = async () => {
//       try {
//         const res = await fetch(`http://localhost:8080/api/groupEvents/${groupId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error(`Backend error: ${res.status}`);

//         const data = await res.json();
//         console.log("Group events fetched:", data);
//         setEvents(data); // store response in state
//       } catch (err) {
//         console.error("Error fetching group events:", err);
//       }
//     };

//     if (groupId) fetchGroupEvents();
//   }, [groupId]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Group ID: {groupId}</Text>
//       <Text style={styles.subtitle}>Events:</Text>

//       <FlatList
//         data={events}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => <Text style={styles.eventText}>{item}</Text>}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
//   subtitle: { fontSize: 18, marginBottom: 10 },
//   eventText: { fontSize: 16, marginBottom: 5 },
// });


// 

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

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

export default function GroupDetailsPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const token = "YOUR_JWT_TOKEN_HERE"; // replace with actual JWT

  useEffect(() => {
    const fetchGroupEvents = async () => {
      try {
        // Step 1: Get event IDs for the group
        const res = await fetch(`http://localhost:8080/api/groupEvents/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Backend error: ${res.status}`);
        const eventIds: number[] = await res.json();

        console.log("Event IDs for group:", eventIds);

        // Step 2: Fetch full details for each event
        const eventPromises = eventIds.map(async (eventId) => {
          const eventRes = await fetch(`http://localhost:8080/api/events/stored/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!eventRes.ok) throw new Error(`Error fetching event ${eventId}`);
          const data = await eventRes.json();
          console.log(`Event details for ID ${eventId}:`, data);
          return data.event; // your backend wraps the event object under `event`
        });

        const eventDetails = await Promise.all(eventPromises);
        setEvents(eventDetails);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) fetchGroupEvents();
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

      {events.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          {event.imageUrl && (
            <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
          )}
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDesc}>{event.description}</Text>
          <Text style={styles.eventInfo}>Category: {event.category}</Text>
          <Text style={styles.eventInfo}>Genre: {event.genre}</Text>
          <Text style={styles.eventInfo}>Date: {event.eventDate} {event.eventTime}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  groupTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
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
});
