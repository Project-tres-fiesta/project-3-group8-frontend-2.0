import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollContent}>
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.avatarContainer}>
            <Ionicons name="person" size={80} color="#1E90FF" />
          </ThemedView>
          <ThemedText type="title" style={styles.profileName}>
            John Doe
          </ThemedText>
          <ThemedText type="body" style={styles.profileHandle}>
            @johndoe
          </ThemedText>
        </ThemedView>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              12
            </ThemedText>
            <ThemedText type="caption">Tickets</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              5
            </ThemedText>
            <ThemedText type="caption">Friends</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="titleLarge" style={styles.statNumber}>
              23
            </ThemedText>
            <ThemedText type="caption">Events</ThemedText>
          </View>
        </View>

        {/* Menu Items */}
        <ThemedView isCard style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="ticket-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>My Tickets</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="card-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>Payment Methods</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>Notifications</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </ThemedView>

        {/* Account Section */}
        <ThemedView isCard style={[styles.menuSection, styles.accountSection]}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#1E90FF" />
            <ThemedText type="bodyLarge" style={styles.menuText}>Settings</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <ThemedText type="bodyLarge" style={styles.logoutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 40,
    paddingTop: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontWeight: '900',
    fontSize: 32,
  },
  profileHandle: {
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#1E90FF',
  },
  menuSection: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  accountSection: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logoutText: {
    flex: 1,
    marginLeft: 16,
    color: '#FF3B30',
  },
});

