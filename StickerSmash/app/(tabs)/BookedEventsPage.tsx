// app/(tabs)/BookedEventsPage.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://group8-backend-0037104cd0e1.herokuapp.com";

type UserEvent = {
  event: {
    id: number;
    title: string;
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueCity: string;
    venueState: string;
    venueCountry: string;
    eventUrl: string;
    imageUrl: string;
  };
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

const BookedEventsPage: React.FC = () => {
  const [userEvents, setUserEvents] = useState<UserEvent[] | null>(null);

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
    const fetchBookedEvents = async () => {
      const token = await getJwt();
      if (!token) {
        console.warn("No JWT token found; cannot fetch booked events.");
        return;
      }

      const id = await getUserId(token);
      if (!id) return;

      console.log("Token sent to backend:", token);

      try {
        const res = await fetch(`${API_BASE}/api/user-events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Backend error: ${res.status}`);
        const data = await res.json();
        console.log("User events:", data);
        setUserEvents(data);
      } catch (err) {
        console.error("Error fetching booked events:", err);
      }
    };

    fetchBookedEvents();
    console.log("BookedEventsPage mounted");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Booked Events</Text>
      <FlatList
        data={userEvents ?? []}
        keyExtractor={(item) => item.event.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.event.title}</Text>
            <Text style={styles.eventDate}>
              {item.event.eventDate + " " + item.event.eventTime}
            </Text>
            <Text>
              {item.event.venueName +
                ": " +
                item.event.venueCity +
                " " +
                item.event.venueState +
                " " +
                item.event.venueCountry}
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(item.event.eventUrl)}
            >
              <Text style={{ color: "#1E90FF" }}>{item.event.eventUrl}</Text>
            </TouchableOpacity>
            {!!item.event.imageUrl && (
              <Image
                source={{ uri: item.event.imageUrl }}
                style={{ width: 400, height: 200, marginTop: 8 }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  eventCard: {
    padding: 15,
    backgroundColor: "#e6f0ff",
    marginBottom: 10,
    borderRadius: 6,
  },
  eventTitle: { fontSize: 18, fontWeight: "600" },
  eventDate: { color: "#666", fontSize: 14, marginBottom: 4 },
});

export default BookedEventsPage;
