import React from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "../../components/themed-view";
import { ThemedText } from "../../components/themed-text";

const HomePage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <ThemedView style={styles.heroSection}>
          <Ionicons name="ticket-outline" size={64} color="#1E90FF" />
          <ThemedText type="title" style={styles.title}>
            Welcome to EventLink
          </ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Discover events, see where your friends are going, and never miss
            the action.
          </ThemedText>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("//eventsPage")}
          >
            <ThemedText type="bodyLarge" style={styles.primaryButtonText}>
              Browse Events
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Feature cards */}
        <ThemedView isCard style={styles.card}>
          <Ionicons name="cart-outline" size={24} color="#1E90FF" />
          <ThemedText type="headline" style={styles.cardTitle}>
            Buy Tickets Easily
          </ThemedText>
          <ThemedText type="body" style={styles.cardText}>
            Secure your seat in just a few taps and keep track of the events
            you’re planning to attend.
          </ThemedText>
        </ThemedView>

        <ThemedView isCard style={styles.card}>
          <Ionicons name="people-outline" size={24} color="#1E90FF" />
          <ThemedText type="headline" style={styles.cardTitle}>
            Friends & Social
          </ThemedText>
          <ThemedText type="body" style={styles.cardText}>
            Add friends, see which games they’re going to, and join them for a
            great time.
          </ThemedText>
        </ThemedView>

        <ThemedView isCard style={styles.card}>
          <Ionicons name="map-outline" size={24} color="#1E90FF" />
          <ThemedText type="headline" style={styles.cardTitle}>
            Groups & Plans
          </ThemedText>
          <ThemedText type="body" style={styles.cardText}>
            Join groups, share events, and coordinate plans so everyone ends up
            in the same section.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 28,
    paddingTop: 12,
  },
  title: {
    marginTop: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.8,
  },
  primaryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#1E90FF",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    padding: 18,
    flexDirection: "column",
    gap: 8,
  },
  cardTitle: {
    fontWeight: "700",
  },
  cardText: {
    opacity: 0.85,
  },
});

export default HomePage;