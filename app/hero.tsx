import { dash } from '@/constants/occ-dashboard-theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function HeroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bounceAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
  }, [bounceAnim]);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <ImageBackground
        source={require('../assets/images/onboarding_bg.png')}
        style={styles.heroImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.8)', '#0F172A']}
          style={styles.heroOverlay}
        >
          <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
            <View style={styles.brandRow}>
              <Text style={styles.brandMark}>OCC</Text>
              <Animated.View 
                style={[
                  styles.brandDot, 
                  { transform: [{ translateY: bounceAnim }] }
                ]} 
              />
            </View>

            <Text style={styles.title}>
              DISCOVER{"\n"}
              YOUR CLUBS.
            </Text>

            <Text style={styles.subtitle}>
              The ultimate high-fidelity ecosystem for student creators, developers, and club leaders.
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.primaryBtn}
                activeOpacity={0.8}
                onPress={() => router.push('/register')}
              >
                <Text style={styles.primaryBtnText}>JOIN THE CLUSTER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                activeOpacity={0.7}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.secondaryBtnText}>SIGN IN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  heroImage: { flex: 1, width: '100%', height: '100%' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end' },
  content: { paddingHorizontal: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  brandMark: {
    fontFamily: 'MontBlack',
    fontSize: 32,
    color: '#fff',
    letterSpacing: -0.5
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: dash.purple,
    marginTop: 8
  },
  title: {
    fontFamily: 'ArchivoHeavyItalic', // High-impact platform font
    fontSize: 48,
    color: '#fff',
    letterSpacing: -2,
    lineHeight: 48,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'InterSemi',
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    marginBottom: 40,
    maxWidth: '85%',
  },
  actionRow: { gap: 14 },
  primaryBtn: {
    height: 64,
    backgroundColor: dash.purple,
    borderRadius: 32, // More refined pill shape
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: dash.purple,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // Micro-border
  },
  primaryBtnText: {
    fontFamily: 'InterBold',
    fontSize: 17,
    color: '#fff',
    letterSpacing: 1.2, // Authoritative spacing
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 32, // Pill shape consistency
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  secondaryBtnText: {
    fontFamily: 'InterBold',
    fontSize: 17,
    color: '#fff',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  }
});
