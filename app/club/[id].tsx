import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ClubDetailModal } from '@/components/occ/ClubDetailModal';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth, authHeaders, API_URL } from '@/context/auth-context';

export default function ClubDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const [club, setClub] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    
    const fetchClub = async () => {
      try {
        const res = await fetch(`${API_URL}/api/clubs`, { headers: authHeaders(token) });
        if (res.ok) {
          const data = await res.json();
          const found = data.clubs?.find((c: any) => c.id === id || c.slug === id);
          if (found) {
            setClub(found);
          }
        }
      } catch (e) {
        console.log('[ClubDetailPage] Error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id, token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  // We use the existing Modal component but handle the visible/onClose 
  // to behave like a page navigation if hit directly.
  return (
    <ClubDetailModal 
      visible={true} 
      onClose={() => router.back()} 
      club={club} 
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }
});
