import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dash } from '@/constants/occ-dashboard-theme';

const { width, height } = Dimensions.get('window');

type Event = {
  id: string;
  title: string;
  clubName: string;
  dateLabel: string;
  imageUrl: string;
  description?: string;
  location?: string;
  attendees?: number;
};

export function EventDetailModal({
  event,
  visible,
  onClose,
}: {
  event: Event | null;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  if (!event) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.sheet}>
          {/* Absolute Top corner Close Button */}
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {/* Header Image */}
            <View style={styles.imageHeader}>
              <Image source={{ uri: event.imageUrl }} style={styles.heroImage} contentFit="cover" />
              
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>HAPPENING SOON</Text>
              </View>
            </View>

            {/* Content Body */}
            <View style={styles.content}>
              <Text style={styles.clubName}>{event.clubName.toUpperCase()}</Text>
              <Text style={styles.title}>{event.title}</Text>

              {/* Info Row Pills */}
              <View style={styles.infoRow}>
                <View style={styles.infoPill}>
                  <Ionicons name="calendar-outline" size={16} color={dash.purple} />
                  <Text style={styles.infoPillText}>{event.dateLabel}</Text>
                </View>
                <View style={styles.infoPill}>
                  <Ionicons name="location-outline" size={16} color={dash.purple} />
                  <Text style={styles.infoPillText}>{event.location || 'College Campus'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>About Event</Text>
              <Text style={styles.desc}>
                {event.description ||
                  "Get ready for an incredible experience! Join us for this exclusive event hosted by our club. Perfect opportunity to network, learn, and have fun with fellow members. Don't miss out on the energy!"}
              </Text>

              <View style={styles.attendeesSection}>
                <View style={styles.avatarStack}>
                  {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={[styles.stackAvatar, { marginLeft: i === 1 ? 0 : -12 }]}>
                      <Image 
                        source={{ uri: `https://i.pravatar.cc/100?u=${i + event.id}` }} 
                        style={styles.avatarImg} 
                      />
                    </View>
                  ))}
                  <View style={styles.moreCount}>
                    <Text style={styles.moreCountText}>+{event.attendees || 42}</Text>
                  </View>
                </View>
                <Text style={styles.attendeeText}>people are attending</Text>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.remindBtn}>
              <Ionicons name="notifications-outline" size={20} color={dash.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinBtnText}>SECURE MY SPOT</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' },
  sheet: {
    height: '92%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  imageHeader: { width: '100%', height: height * 0.35, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  topFade: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  liveBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  content: { padding: 24 },
  clubName: { fontSize: 13, fontWeight: '800', color: dash.purple, letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: dash.text, lineHeight: 34, marginBottom: 20 },
  infoRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  infoPillText: { fontSize: 14, fontWeight: '700', color: dash.text },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },
  sectionHeader: { fontSize: 18, fontWeight: '900', color: dash.text, marginBottom: 12 },
  desc: { fontSize: 15, color: dash.textSoft, lineHeight: 24, fontWeight: '500' },
  attendeesSection: { flexDirection: 'row', alignItems: 'center', marginTop: 32, gap: 12 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  stackAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#fff' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 16 },
  moreCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: dash.purple,
    marginLeft: -12,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreCountText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  attendeeText: { fontSize: 13, fontWeight: '600', color: dash.textMuted },
  footer: {
    padding: 20,
    paddingBottom: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  remindBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtn: {
    flex: 1,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  joinBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});
