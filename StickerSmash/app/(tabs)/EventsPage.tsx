import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ListRenderItem, ActivityIndicator } from 'react-native';

interface Event {
  id: string;
  name: string;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues?: Array<{
      name: string;
      city?: { name: string };
      state?: { name: string };
      country?: { name: string };
    }>;
  };
}

interface EventsPageProps {
  navigation: {
    navigate: (screen: string, params: { event: Event }) => void;
  };
}

const API_KEY = 'BZWNLgbulJGpWGUNixb7Vh991xWPOzgs';

const EventsPage: React.FC<EventsPageProps> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const todayISO = new Date().toISOString().split('.')[0] + 'Z';
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=20&sort=date,asc&startDateTime=${todayISO}&countryCode=US`;

        const response = await fetch(url);
        const data = await response.json();
        console.log('Ticketmaster API data:', data);

        if (response.ok && data._embedded && data._embedded.events && data._embedded.events.length > 0) {
          setEvents(data._embedded.events);
        } else if (data.errors) {
          setError(data.errors.map((e: any) => e.detail).join('\n'));
        } else {
          setError('No upcoming events found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventPress = (event: Event) => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Checkout', { event });
    }
  };

  const renderItem: ListRenderItem<Event> = ({ item }) => (
    <TouchableOpacity onPress={() => handleEventPress(item)} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventDate}>
        {item.dates.start.localDate} {item.dates.start.localTime || ''}
      </Text>
      {item._embedded?.venues && (
        <Text style={styles.eventVenue}>
          {item._embedded.venues[0].name}, {item._embedded.venues[0].city?.name || ''}{' '}
          {item._embedded.venues[0].state?.name || ''} {item._embedded.venues[0].country?.name || ''}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      {loading && <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 18 }} />}
      {error && (
        <Text style={{ color: 'red', paddingVertical: 10 }}>
          Error: {error}
        </Text>
      )}
      {!loading && !error && events.length === 0 && (
        <Text style={styles.noEventsText}>No upcoming events found.</Text>
      )}
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
  eventCard: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    borderRadius: 6,
  },
  eventTitle: { fontSize: 18, fontWeight: '600' },
  eventDate: { color: '#666', fontSize: 14 },
  eventVenue: { fontStyle: 'italic', fontSize: 14, marginTop: 4, color: '#444' },
  noEventsText: { fontSize: 16, color: '#888' },
});

export default EventsPage;
