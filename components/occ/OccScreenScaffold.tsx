import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OCC } from '@/constants/occ';
import { dash } from '@/constants/occ-dashboard-theme';
import { useScroll } from '@/context/ScrollContext';

export const OCC_SCREEN_PAD = 16;

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** Extra bottom space above the tab bar (default matches home). */
  bottomTabPadding?: number;
};

export function OccScreenScaffold({ title, subtitle, children, bottomTabPadding = 96 }: Props) {
  const insets = useSafeAreaInsets();
  const { handleScroll, handleScrollEnd } = useScroll();
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: OCC_SCREEN_PAD,
          paddingBottom: insets.bottom + bottomTabPadding,
        }}>
        {title !== 'Alerts' && title !== 'Notifications' && title !== 'Profile' && title !== 'Projects' && (
          <>
            <Text style={styles.brandMark}>OCC</Text>
            <Text style={styles.brandSub}>{OCC.name}</Text>
          </>
        )}
        <Text style={[
          styles.pageTitle,
          (title === 'Alerts' || title === 'Notifications' || title === 'Profile' || title === 'Projects') && styles.alertsPageTitle
        ]}>
          {(title === 'Alerts' || title === 'Notifications' || title === 'Profile' || title === 'Projects') ? title.toUpperCase() : title}
        </Text>
        {subtitle ? <Text style={styles.pageSub}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </View>
  );
}

export const occScreenStyles = StyleSheet.create({
  card: {
    backgroundColor: dash.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: dash.border,
    padding: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: dash.text, marginBottom: 10 },
  input: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: dash.text,
    backgroundColor: dash.surface,
    borderWidth: 1,
    borderColor: dash.border,
  },
  label: { fontSize: 12, fontWeight: '700', color: dash.textMuted, marginBottom: 6 },
  primaryBtn: {
    backgroundColor: dash.black,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  link: { color: dash.purple, fontSize: 15, fontWeight: '700' },
  muted: { color: dash.textMuted, fontSize: 14 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: dash.bg },
  brandMark: {
    fontFamily: 'MontBold',
    fontSize: 28,
    color: dash.text,
    letterSpacing: 1
  },
  brandSub: {
    fontFamily: 'InterSemi',
    fontSize: 11,
    color: dash.textMuted,
    marginTop: 2
  },
  pageTitle: {
    fontFamily: 'MontBold',
    fontSize: 28,
    color: "#0F172A", // Darker for high fidelity
    marginTop: 18,
    letterSpacing: -0.5,
  },
  alertsPageTitle: {
    fontFamily: 'ArchivoHeavyItalic', // 900 BLACK ITALIC
    fontSize: 32,
    textTransform: 'uppercase',
    marginTop: 10,
    letterSpacing: -1.4, // AGGRESSIVE WIDTH SYNC
  },
  pageSub: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: dash.textMuted,
    marginTop: 0,
    lineHeight: 18,
    marginBottom: 4
  },
});
