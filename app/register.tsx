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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/auth-context';
import { dash } from '@/constants/occ-dashboard-theme';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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

  const onRegister = async () => {
    if (busy) return;
    setBusy(true);
    // UI-only registration (requires collegeName per type)
    await register({
      fullName,
      email,
      password,
      confirmPassword,
      collegeName: 'Your College', // Placeholder as it's required by payload
    });
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
            { paddingTop: insets.top + 20, paddingBottom: 60 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding */}
          <View style={styles.header}>
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

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.h1}>Welcome!</Text>
            <Text style={styles.subText}>Create your OCC account to get started</Text>
          </View>

          {/* Google Register */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={styles.googleBtnText}>Sign up with Google</Text>
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
              placeholder="Full name"
              placeholderTextColor="#A0AEC0"
              value={fullName}
              onChangeText={setFullName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.otpActionBtn} activeOpacity={0.7}>
              <Ionicons name="mail-outline" size={18} color="#4A5568" />
              <Text style={styles.otpActionBtnText}>Send verification code</Text>
            </TouchableOpacity>

            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>Email verification code</Text>
              <View style={styles.otpRow}>
                {otp.map((digit: string, idx: number) => (
                  <View key={idx} style={styles.otpBox}>
                    <TextInput
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.referralGroup}>
              <TextInput
                style={styles.input}
                placeholder="CLUB REFERRAL CODE"
                placeholderTextColor="#A0AEC0"
                autoCapitalize="characters"
                value={referralCode}
                onChangeText={setReferralCode}
              />
              <Text style={styles.fieldHint}>Ask your Club Leader for their code</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={[styles.signupBtn, busy && styles.signupBtnDisabled]}
              disabled={busy}
              onPress={onRegister}
              activeOpacity={0.8}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupBtnText}>Sign up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerLinkRow}>
              <Text style={styles.footerMutedText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.footerLink}>Log in</Text>
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
  scroll: { paddingHorizontal: 28 },
  header: { marginBottom: 32 },
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
  form: { gap: 18, marginBottom: 40 },
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
  otpActionBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
  },
  otpActionBtnText: {
    fontFamily: 'InterSemi',
    fontSize: 14,
    color: '#4A5568',
  },
  otpSection: { gap: 12 },
  otpLabel: {
    fontFamily: 'InterSemi',
    fontSize: 12,
    color: '#1A202C',
    marginLeft: 4,
  },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#1A202C',
    textAlign: 'center',
    width: '100%',
  },
  referralGroup: { gap: 8 },
  fieldHint: {
    fontFamily: 'InterSemi',
    fontSize: 11,
    color: '#718096',
    marginLeft: 4,
  },
  ctaSection: { gap: 24 },
  signupBtn: {
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
  signupBtnDisabled: { opacity: 0.7 },
  signupBtnText: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.3,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
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
});
