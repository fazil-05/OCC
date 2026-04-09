import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { OccScreenScaffold, occScreenStyles } from '@/components/occ/OccScreenScaffold';
import { MOCK_TRENDING_ROWS } from '@/constants/occ-mock-feed';
import { dash } from '@/constants/occ-dashboard-theme';

const SUGGESTIONS = ['Nandi ride', 'Open mic', 'Photo walk', '5v5 football', 'DJ night'];

export default function SearchScreen() {
  const [q, setQ] = useState('');

  return (
    <OccScreenScaffold
      title="Search"
      subtitle="Find clubs, events, and people on campus.">
      <View style={[occScreenStyles.card, { marginTop: 16 }]}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={22} color={dash.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clusters, events…"
            placeholderTextColor={dash.textSoft}
            value={q}
            onChangeText={setQ}
          />
          {q.length > 0 ? (
            <Pressable onPress={() => setQ('')} hitSlop={8}>
              <Ionicons name="close-circle" size={22} color={dash.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Trending now</Text>
      <View style={styles.chipWrap}>
        {SUGGESTIONS.map((s) => (
          <Pressable key={s} style={styles.chip} onPress={() => setQ(s)}>
            <Text style={styles.chipText}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 22 }]}>Popular clusters</Text>
      <View style={{ marginTop: 10, gap: 10 }}>
        {MOCK_TRENDING_ROWS.map((row) => (
          <Pressable
            key={row.id}
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
            <View style={styles.rowIcon}>
              <Ionicons name="people" size={20} color={dash.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{row.name}</Text>
              <Text style={styles.rowMeta}>{row.memberCount.toLocaleString()} members</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={dash.textSoft} />
          </Pressable>
        ))}
      </View>
    </OccScreenScaffold>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: dash.text,
    paddingVertical: 8,
  },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: dash.textMuted, letterSpacing: 0.4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: dash.surface,
    borderWidth: 1,
    borderColor: dash.border,
  },
  chipText: { fontSize: 13, fontWeight: '700', color: dash.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: dash.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: dash.border,
    padding: 14,
    gap: 12,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: dash.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontSize: 16, fontWeight: '800', color: dash.text },
  rowMeta: { fontSize: 13, color: dash.textMuted, marginTop: 2 },
});
