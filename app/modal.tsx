import { Link } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dash } from '@/constants/occ-dashboard-theme';
import { OCC } from '@/constants/occ';
import { OCC_SCREEN_PAD } from '@/components/occ/OccScreenScaffold';

export default function ModalScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar style="dark" />
      <View style={{ paddingHorizontal: OCC_SCREEN_PAD }}>
        <Text style={styles.brandMark}>OCC</Text>
        <Text style={styles.brandSub}>{OCC.name}</Text>
        <Text style={styles.title}>Modal</Text>
        <Text style={styles.sub}>Sample modal sheet using the same dashboard styling.</Text>
        <Link href="/" dismissTo asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Close & go home</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: dash.bg },
  brandMark: { fontSize: 22, fontWeight: '800', color: dash.text, letterSpacing: -0.5 },
  brandSub: { fontSize: 11, color: dash.textMuted, marginTop: 2, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: dash.text, marginTop: 20 },
  sub: { fontSize: 14, color: dash.textMuted, marginTop: 8, lineHeight: 20, marginBottom: 24 },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: dash.black,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
