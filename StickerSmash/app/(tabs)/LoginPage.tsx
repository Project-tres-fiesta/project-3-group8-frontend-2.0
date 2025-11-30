import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import GitHubTestLogin from '@/components/GitHubLogin';
import GoogleLoginWeb from '@/components/GoogleLoginWeb';
import { ThemedText } from '@/components/themed-text';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          EventLink
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Sign in to continue
        </ThemedText>
        
        <View style={styles.buttonContainer}>
          <GoogleLoginWeb />
          <GitHubTestLogin />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 24,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
});
