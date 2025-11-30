import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface Event {
  id: string;
  name: string;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
  };
  images?: Array<{
    url: string;
    ratio?: string;
  }>;
  _embedded?: {
    venues?: Array<{
      name: string;
      city?: { name: string };
      state?: { name: string };
      country?: { name: string };
    }>;
  };
}

interface EventsPageProps {}

const API_KEY = 'BZWNLgbulJGpWGUNixb7Vh991xWPOzgs';

const EventsPage: React.FC<EventsPageProps> = () => {
  const insets = useSafeAreaInsets();
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
    router.push({
      pathname: '/event-details',
      params: { event: JSON.stringify(event) },
    });
  };

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.8}
      onPress={() => handleEventPress(item)}
    >
      <ThemedView isCard style={styles.cardImageContainer}>
        <ThemedView style={styles.imageOverlay} />
        {item.images && item.images[0] ? (
          <ThemedView style={[styles.eventImage]} />
        ) : (
          <ThemedView style={styles.placeholderImage} />
        )}
        <ThemedText type="headline" style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedText type="caption" style={styles.cardSubtitle} numberOfLines={1}>
          {item._embedded?.venues?.[0]?.name || 'Venue TBD'}
        </ThemedText>
        <ThemedText type="caption" style={styles.cardDate}>
          {item.dates.start.localDate}
          {item.dates.start.localTime && ` • ${item.dates.start.localTime.substring(0, 5)}`}
        </ThemedText>
      </ThemedView>
      <View style={styles.cardContent}>
        <ThemedText type="bodyLarge" style={styles.viewSeats}>
          VIEW SEATS
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Upcoming Events
        </ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#1E90FF" />
        </TouchableOpacity>
      </View>

      {loading && (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <ThemedText type="body" style={styles.loadingText}>
            Loading events...
          </ThemedText>
        </ThemedView>
      )}

      {error && (
        <ThemedView style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <ThemedText type="headline" style={styles.errorTitle}>
            Oops!
          </ThemedText>
          <ThemedText type="body" style={styles.errorText}>
            {error}
          </ThemedText>
        </ThemedView>
      )}

      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedView style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color="#1E90FF" />
            <ThemedText type="headline" style={styles.emptyTitle}>
              No events found
            </ThemedText>
            <ThemedText type="body" style={styles.emptySubtitle}>
              Check back soon for upcoming events
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontWeight: '900',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
    flexGrow: 1,
  },
  eventCard: {
    marginBottom: 20,
  },
  cardImageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  eventImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E90FF',
  },
  placeholderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E90FF',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardTitle: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    color: 'white',
    fontWeight: '900',
  },
  cardSubtitle: {
    position: 'absolute',
    bottom: 36,
    left: 20,
    right: 20,
    color: 'white',
  },
  cardDate: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    color: 'white',
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewSeats: {
    color: '#1E90FF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 48,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default EventsPage;
