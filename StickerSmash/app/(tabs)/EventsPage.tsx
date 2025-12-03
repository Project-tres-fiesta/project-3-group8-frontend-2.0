// app/(tabs)/EventsPage.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

export interface Event {
  id: string;
  name: string;

  // Date & Time
  localDate: string;
  localTime: string;
  dateTime: string;

  // Venue Info
  venueName: string;
  venueCity: string;
  venueState: string;
  venueCountry: string;

  // Pricing
  minPrice: number | null;
  maxPrice: number | null;
  currency: string | null;

  // Classification
  category: string;
  genre: string;
  source: string;

  // Media
  imageUrl: string;

  // URLs
  url: string;
}

interface EventsPageProps {}

async function getJwt(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem("jwt");
      }
      return null;
    } else {
      return await SecureStore.getItemAsync("jwt");
    }
  } catch (e) {
    console.warn("Error reading JWT", e);
    return null;
  }
}

const EventsPage: React.FC<EventsPageProps> = () => {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getUserId = async (token: string): Promise<number | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);

      const data = await res.json();
      console.log("User profile:", data);
      console.log("Fetched user ID:", data.userId);
      return data.userId;
    } catch (err) {
      console.error("Error fetching profile for user ID:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events/popular`);
        const data = await res.json();
        console.log("Stored events data:", data);
        setEvents(data.events || []);
        console.log("Events set to state:", data.events || []);
      } catch (err: any) {
        console.error("Error fetching stored events:", err);
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async (
    eventPayload: any,
    token: string,
    userId: number
  ) => {
    try {
      // 1️⃣ Store the event first
      const eventRes = await fetch(`${API_BASE}/api/events/stored`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventPayload),
      });

      if (!eventRes.ok)
        throw new Error(`Backend error adding event: ${eventRes.status}`);

      const storedEvent = await eventRes.json();
      console.log("Stored event:", storedEvent);

      // 2️⃣ Now create the user-event relationship
      const userEventRes = await fetch(`${API_BASE}/api/user-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          eventId: storedEvent.event.id,
          isAttending: true,
          wantsToGo: true,
        }),
      });

      if (!userEventRes.ok)
        throw new Error(
          `Failed to add user event: ${userEventRes.status}`
        );

      const userEventData = await userEventRes.json();
      console.log("Created user event ID:", userEventData.id);

      return { storedEvent, userEventId: userEventData.id };
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: "/event-details",
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
        {/* You could render the real image here with item.imageUrl */}
        <ThemedView style={styles.placeholderImage} />
        <ThemedText
          type="headline"
          style={styles.cardTitle}
          numberOfLines={2}
        >
          {item.name}
        </ThemedText>
        <ThemedText
          type="caption"
          style={styles.cardSubtitle}
          numberOfLines={1}
        >
          {item.venueName || "Venue TBD"}
        </ThemedText>
        <ThemedText type="caption" style={styles.cardDate}>
          {item.localDate} {item.localTime}
        </ThemedText>
      </ThemedView>

      <View style={styles.cardContent}>
        <ThemedText type="bodyLarge" style={styles.viewSeats}>
          VIEW SEATS
        </ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={async () => {
            const token = await getJwt();
            if (!token) {
              console.error("No JWT token found");
              return;
            }

            const userId = await getUserId(token);
            if (!userId) {
              console.error("Could not fetch user ID");
              return;
            }

            await addEvent(
              {
                title: item.name,
                description: item.name + " event",
                eventDate: item.localDate,
                eventTime: item.localTime ?? "00:00:00",
                eventUrl: item.url,
                externalEventId: item.id,
                externalSource: "ticketmaster",
                category: item.category,
                genre: item.genre,
                imageUrl: item.imageUrl,
                minPrice: item.minPrice ?? null,
                maxPrice: item.maxPrice ?? null,
                currency: item.currency ?? "USD",
                venueName: item.venueName,
                venueCity: item.venueCity,
                venueState: item.venueState,
                venueCountry: item.venueCountry,
              },
              token,
              userId
            );
          }}
        >
          <ThemedText type="body" style={styles.addButtonText}>
            Add Event
          </ThemedText>
        </TouchableOpacity>
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
          <ActivityIndicator size="large" />
          <ThemedText type="body" style={styles.loadingText}>
            Loading events...
          </ThemedText>
        </ThemedView>
      )}

      {error && !loading && (
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
          !loading && !error ? (
            <ThemedView style={styles.emptyState}>
              <Ionicons name="ticket-outline" size={64} color="#1E90FF" />
              <ThemedText type="headline" style={styles.emptyTitle}>
                No events found
              </ThemedText>
              <ThemedText type="body" style={styles.emptySubtitle}>
                Check back soon for upcoming events
              </ThemedText>
            </ThemedView>
          ) : null
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontWeight: "900",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
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
    overflow: "hidden",
    position: "relative",
  },
  placeholderImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1E90FF",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardTitle: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    color: "white",
    fontWeight: "900",
  },
  cardSubtitle: {
    position: "absolute",
    bottom: 36,
    left: 20,
    right: 20,
    color: "white",
  },
  cardDate: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,
    color: "white",
  },
  cardContent: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewSeats: {
    color: "#1E90FF",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 32,
  },
  errorTitle: {
    textAlign: "center",
  },
  errorText: {
    textAlign: "center",
    opacity: 0.8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 48,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
  addButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default EventsPage;
