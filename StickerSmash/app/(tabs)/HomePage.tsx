import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getUsers } from '../api/apiClient';  // Updated import path here
import { useLocalSearchParams } from "expo-router";


const HomePage: React.FC = () => {
  
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    //getUsers().then(setUsers).catch(console.error);
  }, []);
  
  const { code, state } = useLocalSearchParams();

  useEffect(() => {
    if (code) {
      console.log("GitHub Code:", code);
      // send to backend
    }
  }, [code]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to EventLink</Text>
      <Text style={styles.description}>
        Discover events & buy tickets.
      </Text>
      <Text style={styles.description}>
        Browse upcoming games and events. See which events your friends are going to and never miss out on the fun.
      </Text>

      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>Buy Tickets Easily</Text>
        <Text style={styles.featureDescription}>
          Secure your seat with a few clicks and manage your orders smoothly.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>Friends & Social</Text>
        <Text style={styles.featureDescription}>
          Know what events your friends plan to attend and join them for a great time.
        </Text>
      </View>

      
      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>User List (from backend)</Text>
        {users.length === 0 ? (
          <Text style={styles.featureDescription}>Loading users...</Text>
        ) : (
          <View>
            {users.map(u => (
              <Text key={u.userId} style={styles.featureDescription}>
                {u.userName} ({u.userEmail})
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    marginVertical: 6,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    width: '100%',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
  },
});

export default HomePage;
