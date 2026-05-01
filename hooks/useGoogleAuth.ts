import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Ensure WebBrowser closes properly on iOS
WebBrowser.maybeCompleteAuthSession();

// Helper to generate a random string for CSRF/Poll keys
function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// React Native doesn't have btoa out of the box without polyfills
// A simpler base64 encoder string for the state
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const btoa = (input: string = '')  => {
  let str = input;
  let output = '';
  for (let block = 0, charCode, i = 0, map = chars;
  str.charAt(i | 0) || (map = '=', i % 1);
  output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
    charCode = str.charCodeAt(i += 3/4);
    if (charCode > 0xFF) {
      throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }
    block = block << 8 | charCode;
  }
  return output;
};

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async (): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Generate CSRF token and Poll Key natively
      const csrf = generateRandomString(32);
      const pollKey = generateRandomString(32);

      // 2. Build the state. pollKey is already alphanumeric-safe.
      // We also encode the returnUrl so the backend knows where to redirect back to close the browser.
      const returnUrl = 'OCC://google-auth';
      const state = `${csrf}:poll:${pollKey}:${btoa(returnUrl)}`;

      console.log('[Google Auth App] Generated pollKey:', pollKey);
      console.log('[Google Auth App] Return URL:', returnUrl);

      // 3. Open WebBrowser
      const API_URL = process.env.EXPO_PUBLIC_OCC_API_URL || 'https://occ-v2-prod.vercel.app';
      const authUrl = `${API_URL}/api/auth/google/start?mode=poll&state=${encodeURIComponent(state)}`;
      console.log('[Google Auth App] Opening:', authUrl);

      // We use the dynamically generated returnUrl as the scheme for Expo Go compatibility
      WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

      // 4. Poll every 2 seconds for up to 2 minutes (120 seconds = 60 attempts)
      const maxAttempts = 60;
      let attempts = 0;

      const token = await new Promise<string | null>((resolve, reject) => {
        const interval = setInterval(async () => {
          attempts++;
          try {
            console.log(`[Google Auth App] Polling attempt ${attempts}...`);
            const res = await fetch(`${API_URL}/api/auth/google/poll?key=${pollKey}`);
            console.log(`[Google Auth App] Poll status: ${res.status}`);
            
            if (res.status === 200) {
              const data = await res.json();
              if (data.token) {
                console.log('[Google Auth App] Token received via polling!');
                clearInterval(interval);
                resolve(data.token);
                return;
              }
            } else if (res.status === 410) {
              console.log('[Google Auth App] Poll session expired (410)');
              clearInterval(interval);
              reject(new Error('Session expired'));
              return;
            }
            
            if (attempts >= maxAttempts) {
              console.log('[Google Auth App] Poll timeout');
              clearInterval(interval);
              reject(new Error('Sign-in timed out. Please try again.'));
            }
          } catch (e) {
            console.log('[Google Auth App] Poll fetch error:', e);
            // Don't reject here, just try again on next poll until timeout
          }
        }, 2000);
      });

      console.log('[Google Auth App] Polling complete, dismissing browser...');
      // Close the browser on success or timeout
      WebBrowser.dismissBrowser();
      
      setLoading(false);
      return token;
      
    } catch (err: any) {
      console.error('[Google Auth App] Critical Error:', err);
      setError(err.message || 'An error occurred during sign-in.');
      WebBrowser.dismissBrowser();
      setLoading(false);
      return null;
    }
  };

  return { signInWithGoogle, loading, error };
}
