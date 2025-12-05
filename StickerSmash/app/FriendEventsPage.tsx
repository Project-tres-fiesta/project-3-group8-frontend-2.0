import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "../components/themed-view";
import { ThemedText } from "../components/themed-text";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

type FriendEvent = {
  id: number;
  title: string;
  description?: string | null;
  eventDate: string;
  eventTime: string;
  eventUrl?: string | null;
  category?: string | null;
  genre?: string | null;
  imageUrl?: string | null;
  venueName?: string | null;
  venueCity?: string | null;
  venueState?: string | null;
  venueCountry?: string | null;
};

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

export default function FriendEventsPage() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    friendId?: string;
    friendName?: string;
  }>();

  const friendId = params.friendId;
  const friendName = params.friendName || "Friend";

  const [events, setEvents] = useState<FriendEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendEvents = async () => {
      if (!friendId) {
        console.warn("No friendId provided in route params");
        setLoading(false);
        return;
      }

      try {
        const token = await getJwt();
        if (!token) {
          console.warn("No JWT token found – user probably not logged in.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${API_BASE}/api/user-events/user/${friendId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error(
            "Error fetching friend events:",
            res.status,
            await res.text().catch(() => "")
          );
          setEvents([]);
          return;
        }

        const data: FriendEvent[] = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching friend events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendEvents();
  }, [friendId]);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          {friendName}'s Events
        </ThemedText>
        <ThemedText type="caption" style={styles.subHeader}>
          Events they’ve saved / are attending
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <ThemedText type="body" style={{ marginTop: 8 }}>
            Loading events...
          </ThemedText>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="ticket-outline" size={48} color="#1E90FF" />
          <ThemedText type="headline" style={{ marginTop: 12 }}>
            No events yet
          </ThemedText>
          <ThemedText type="body" style={{ opacity: 0.7, marginTop: 4 }}>
            {friendName} hasn’t added any events yet.
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        >
          {events.map((ev) => (
            <ThemedView key={ev.id} isCard style={styles.eventCard}>
              <ThemedText type="headline" style={styles.eventTitle}>
                {ev.title}
              </ThemedText>

              {ev.category || ev.genre ? (
                <ThemedText type="caption" style={styles.eventMeta}>
                  {[ev.category, ev.genre].filter(Boolean).join(" • ")}
                </ThemedText>
              ) : null}

              <ThemedText type="body" style={styles.eventDate}>
                {ev.eventDate} {ev.eventTime}
              </ThemedText>

              {ev.venueName && (
                <ThemedText type="body" style={styles.eventVenue}>
                  {ev.venueName}
                  {ev.venueCity ? ` • ${ev.venueCity}` : ""}
                  {ev.venueState ? `, ${ev.venueState}` : ""}
                  {ev.venueCountry ? ` • ${ev.venueCountry}` : ""}
                </ThemedText>
              )}

              {ev.description && (
                <ThemedText type="body" style={styles.eventDesc}>
                  {ev.description}
                </ThemedText>
              )}

              {ev.eventUrl && (
                <TouchableOpacity onPress={() => Linking.openURL(ev.eventUrl!)}>
                  <ThemedText type="body" style={styles.linkText}>
                    View Event / Tickets
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 20 },
  headerTitle: { fontWeight: "900" },
  subHeader: { opacity: 0.7, marginTop: 4 },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  eventCard: {
    marginBottom: 16,
    padding: 16,
  },
  eventTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  eventMeta: {
    opacity: 0.8,
    marginBottom: 8,
  },
  eventDate: {
    fontWeight: "500",
    marginBottom: 4,
  },
  eventVenue: {
    opacity: 0.8,
    marginBottom: 8,
  },
  eventDesc: {
    opacity: 0.85,
    marginBottom: 8,
  },
  linkText: {
    color: "#1E90FF",
    fontWeight: "600",
  },
});