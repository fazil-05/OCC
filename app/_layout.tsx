import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { 
  useFonts, 
  Montserrat_900Black, 
  Montserrat_800ExtraBold,
  Montserrat_700Bold 
} from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_700Bold, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { ArchivoNarrow_700Bold_Italic } from '@expo-google-fonts/archivo-narrow';
import { 
  Archivo_900Black_Italic, 
  Archivo_700Bold_Italic,
  Archivo_800ExtraBold_Italic 
} from '@expo-google-fonts/archivo';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { ScrollProvider } from '@/context/ScrollContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TOKEN_KEY = 'occ-session-token';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [loaded, error] = useFonts({
    'MontBlack': Montserrat_900Black,
    'MontBold': Montserrat_800ExtraBold,
    'MontSemi': Montserrat_700Bold,
    'InterRegular': Inter_400Regular,
    'InterSemi': Inter_600SemiBold,
    'InterBold': Inter_700Bold,
    'ArchivoBlack': ArchivoBlack_400Regular,
    'ArchivoNarrowItalic': ArchivoNarrow_700Bold_Italic,
    'ArchivoHeavyItalic': Archivo_900Black_Italic,
    'ArchivoExtraBoldItalic': Archivo_800ExtraBold_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <ScrollProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <DeepLinkHandler />
          <StackScreenContent />
          <StatusBar style="dark" />
        </ThemeProvider>
      </ScrollProvider>
    </AuthProvider>
  );
}

/**
 * Handles incoming deep links for Google OAuth.
 * On Android, Chrome Custom Tabs may close BEFORE openAuthSessionAsync catches
 * the redirect, so the OS delivers the URL directly via Linking.
 * This component catches that URL and stores the token.
 */
function DeepLinkHandler() {
  const { refreshProfile } = useAuth();

  const handleUrl = async (url: string) => {
    console.log('[DeepLink] Incoming URL:', url);
    try {
      const parsed = Linking.parse(url);
      // Check for google-auth path with a token
      const token = parsed.queryParams?.token as string | undefined;
      const hasError = parsed.queryParams?.error as string | undefined;

      if (hasError) {
        console.warn('[DeepLink] Google auth error:', hasError);
        return;
      }

      if (token && (url.includes('google-auth') || url.includes('token='))) {
        console.log('[DeepLink] Google OAuth token received, storing...');
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await refreshProfile();
        router.replace('/(tabs)/home');
        console.log('[DeepLink] Navigated to home.');
      }
    } catch (e) {
      console.error('[DeepLink] Error handling URL:', e);
    }
  };

  useEffect(() => {
    // Handle URL that launched the app (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Handle URL while app is in foreground/background (Android)
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => subscription.remove();
  }, []);

  return null;
}

function StackScreenContent() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

