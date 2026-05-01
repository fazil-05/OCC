import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function GoogleAuthDummyRoute() {
  const router = useRouter();

  useEffect(() => {
    // The polling mechanism in useGoogleAuth will handle the actual logic and navigation.
    // If we land here, just wait a brief moment and push to home if nothing happens.
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
