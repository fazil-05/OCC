import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/auth-context';
import { dash } from '@/constants/occ-dashboard-theme';
import { OCC } from '@/constants/occ';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const bounceAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
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

  const onLogin = async () => {
    if (busy) return;
    setBusy(true);
    await signIn(email, password);
    router.replace('/(tabs)/home');
    setBusy(false);
  };

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 20, paddingBottom: 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Auth Container */}
          <View style={styles.authContainer}>
            {/* Branding Header */}
            <View style={styles.header}>
              <View>
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
              </View>
              
              <View style={styles.topRightNav}>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.navLinkMuted}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.joinBtn} onPress={() => router.push('/register')}>
                  <Text style={styles.joinBtnText}>Join Us</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeSection}>
              <Text style={styles.h1}>Hi there!</Text>
              <Text style={styles.subText}>Welcome to OCC. Community Dashboard</Text>
            </View>

            {/* Google Login */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={styles.googleBtnText}>Log in with Google</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Your email"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* CTA Section */}
            <TouchableOpacity
              style={[styles.loginBtn, busy && styles.loginBtnDisabled]}
              disabled={busy}
              onPress={onLogin}
              activeOpacity={0.8}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Log in</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerLinkRow}>
              <Text style={styles.footerMutedText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 40 },
  authContainer: { paddingHorizontal: 28 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline',
    marginBottom: 40 
  },
  topRightNav: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  navLinkMuted: { fontSize: 13, fontWeight: '700', color: '#718096' },
  joinBtn: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  joinBtnText: { fontSize: 13, fontWeight: '700', color: '#1A202C' },
  brandRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  brandMark: {
    fontFamily: 'MontBlack',
    fontSize: 28,
    color: '#1A202C',
    letterSpacing: -1,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: dash.purple,
    marginBottom: 6,
  },
  brandSub: {
    fontFamily: 'InterSemi',
    fontSize: 12,
    color: '#718096',
    marginTop: -2,
  },
  welcomeSection: { marginBottom: 32 },
  h1: {
    fontFamily: 'MontBlack',
    fontSize: 44,
    color: '#1A202C',
    letterSpacing: -1.5,
  },
  subText: {
    fontFamily: 'InterSemi',
    fontSize: 15,
    color: '#4A5568',
    marginTop: 4,
  },
  googleBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  googleBtnText: {
    fontFamily: 'InterSemi',
    fontSize: 15,
    color: '#4A5568',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  line: { flex: 1, height: 1, backgroundColor: '#EDF2F7' },
  orText: {
    fontFamily: 'InterSemi',
    fontSize: 13,
    color: '#A0AEC0',
    textTransform: 'lowercase',
  },
  form: { gap: 16, marginBottom: 32 },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'InterSemi',
    color: '#1A202C',
    backgroundColor: '#fff',
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -8 },
  forgotText: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: '#4299E1',
  },
  loginBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.3,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  footerMutedText: {
    fontFamily: 'InterSemi',
    fontSize: 14,
    color: '#718096',
  },
  footerLink: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: '#1A202C',
  },
  visualContainer: { marginTop: 40, paddingHorizontal: 20 },
  visualCard: { 
    height: 480, 
    borderRadius: 32, 
    overflow: 'hidden', 
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20
  },
  visualImage: { width: '100%', height: '100%' },
  visualOverlay: { position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 32 },
  visualContent: { gap: 12 },
  visualTitle: { 
    fontFamily: 'InterBold', 
    fontSize: 32, 
    color: '#fff', 
    letterSpacing: -0.5,
    lineHeight: 40
  },
  statsBadge: { 
    position: 'absolute', 
    top: 24, 
    right: 24, 
    backgroundColor: 'rgba(255,255,255,0.92)', 
    borderRadius: 20, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)'
  },
  statsIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  statsTitle: { fontSize: 13, fontWeight: '800', color: '#1A202C' },
  statsSub: { fontSize: 11, color: '#718096', fontWeight: '600' },
});
