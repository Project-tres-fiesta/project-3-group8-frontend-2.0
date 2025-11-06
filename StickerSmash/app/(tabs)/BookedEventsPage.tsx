import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Booked Events</Text>
      <FlatList
        data={bookedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
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
