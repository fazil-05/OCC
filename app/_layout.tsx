import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
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

import { AuthProvider } from '@/context/auth-context';
import { ScrollProvider } from '@/context/ScrollContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
          <StackScreenContent />
          <StatusBar style="dark" />
        </ThemeProvider>
      </ScrollProvider>
    </AuthProvider>
  );
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
