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
        {/* EventLink hero branding */}
        <View style={styles.logoContainer}>
          <ThemedText type="titleLarge" style={styles.logoText}>
            EventLink
          </ThemedText>
          <ThemedText
            type="caption"
            lightColor="#1E90FF"
            darkColor="#4DA3FF"
          >
            Discover amazing events near you
          </ThemedText>
        </View>

        <ThemedText type="headline" style={styles.subtitle}>
          Sign in to discover events
        </ThemedText>

        <View style={styles.buttonContainer}>
          <GoogleLoginWeb />
          <GitHubTestLogin />
        </View>

        <ThemedView style={styles.footer}>
          <ThemedText type="caption">
            By signing in, you agree to our Terms of Service
          </ThemedText>
        </ThemedView>
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
    padding: 24,
    paddingTop: 80,
    gap: 32,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    backgroundColor: 'transparent',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
    maxWidth: 320,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});
