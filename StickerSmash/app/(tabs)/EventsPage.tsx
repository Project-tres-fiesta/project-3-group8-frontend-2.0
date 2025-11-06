import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ListRenderItem } from 'react-native';

interface Event {
  id: string;
  title: string;
  date: string;
}

const events: Event[] = [
  { id: '1', title: 'Concert Night', date: '2025-12-04' },
  { id: '2', title: 'Football Game', date: '2025-12-10' },
  { id: '3', title: 'Art Exhibition', date: '2025-12-15' },
];

interface EventsPageProps {
  navigation: {
    navigate: (screen: string, params: { event: Event }) => void;
  };
}

const EventsPage: React.FC<EventsPageProps> = ({ navigation }) => {
  const handleEventPress = (event: Event) => {
    navigation.navigate('Checkout', { event });
  };

  const renderItem: ListRenderItem<Event> = ({ item }) => (
    <TouchableOpacity onPress={() => handleEventPress(item)} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  eventCard: { padding: 15, backgroundColor: '#f2f2f2', marginBottom: 10, borderRadius: 6 },
  eventTitle: { fontSize: 18, fontWeight: '600' },
  eventDate: { color: '#666', fontSize: 14 },
});

export default EventsPage;
