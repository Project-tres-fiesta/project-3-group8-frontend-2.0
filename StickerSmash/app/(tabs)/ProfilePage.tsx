import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const DARK_GREEN = '#254117';

const samplePastEvents = [
  { id: '1', title: 'Concert at the Park', date: '2025-11-01' },
  { id: '2', title: 'Art Expo 2025', date: '2025-10-21' },
];
const sampleUpcomingEvents = [
  { id: '3', title: 'Festival of Lights', date: '2025-12-15' },
  { id: '4', title: 'Winter Gala', date: '2026-01-10' },
];
const sampleFriends = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
];

export default function ProfilePage() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileImagePlaceholder}>
        <ThemedText style={styles.initials}>US</ThemedText>
      </View>
      <ThemedText type="title" style={styles.username}>
        User
      </ThemedText>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Upcoming Events
      </ThemedText>
      <FlatList
        data={sampleUpcomingEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedText style={styles.listItem}>
            {item.title} - {item.date}
          </ThemedText>
        )}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Past Events
      </ThemedText>
      <FlatList
        data={samplePastEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedText style={styles.listItem}>
            {item.title} - {item.date}
          </ThemedText>
        )}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Friends
      </ThemedText>
      <FlatList
        data={sampleFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ThemedText style={styles.listItem}>{item.name}</ThemedText>}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_GREEN,
    padding: 20,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0B3D0B', // darker green shade
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  initials: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
  },
  username: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
    color: 'white',
  },
  list: {
    maxHeight: 160,
  },
  listItem: {
    fontSize: 16,
    color: 'white',
  },
  separator: {
    height: 12,
  },
});
