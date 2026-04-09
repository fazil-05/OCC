import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { dash } from '@/constants/occ-dashboard-theme';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const { user, ready } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);
  
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Fade in the whole thing
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 2. Continuous branding bounce (alive pattern)
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. 2.5 second cinematic delay before entry
    const timer = setTimeout(() => {
      setSplashFinished(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!splashFinished || !ready) {
    return (
      <View style={styles.splashRoot}>
        <StatusBar style="dark" />
        <Animated.View style={[styles.splashContent, { opacity: fadeAnim }]}>
          <View style={styles.brandRow}>
            <Text style={styles.brandMark}>occ</Text>
            <Animated.View 
              style={[
                styles.brandDot, 
                { transform: [{ translateY: bounceAnim }] }
              ]} 
            />
          </View>
          <Text style={styles.brandSub}>Off Campus Clubs</Text>
        </Animated.View>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/hero" />;
}

const styles = StyleSheet.create({
  splashRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  brandMark: {
    fontFamily: 'MontBlack',
    fontSize: 56,
    color: '#000000',
    letterSpacing: -2,
  },
  brandDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: dash.purple,
    marginBottom: 10,
  },
  brandSub: {
    fontFamily: 'InterSemi',
    fontSize: 16,
    color: '#718096',
    letterSpacing: 1,
    marginTop: -8,
  },
});
