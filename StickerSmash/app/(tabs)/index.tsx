import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      let token;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('jwt');
      } else {
        token = await SecureStore.getItemAsync('jwt');
      }
      
      setHasToken(!!token);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return hasToken ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/login" />
  );
}
