import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { OccScreenScaffold } from '@/components/occ/OccScreenScaffold';
import { dash } from '@/constants/occ-dashboard-theme';

const MOCK_ANNOUNCEMENTS = [
  {
    id: 'a1',
    club: 'Bikers Club',
    body: 'Dawn Ride To Nandi starts in 2 hours. Bring your riding gear!',
    time: '2m ago',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80',
    reactions: 42,
  },
  {
    id: 'a2',
    club: 'Music Hub',
    body: 'Open Deck Friday — guest list is now FULL. See you all at 9PM!',
    time: '1h ago',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=120&q=80',
    reactions: 128,
  },
];

const MOCK_MESSAGES = [
  {
    id: 'm1',
    user: 'Alex Moss',
    body: 'Yo! You coming for the photo jam tomorrow?',
    time: '10m ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    online: true,
  },
  {
    id: 'm2',
    user: 'Sarah Jenkins',
    body: 'Sent you the project files for the Design Club.',
    time: '45m ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    online: false,
  },
];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab ] = useState<'announcements' | 'social'>('announcements');
  const router = useRouter();

  // Helper for type-safe navigation
  const navigateTo = (path: string, params: Record<string, string>) => {
    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    router.push(`${path}?${query}` as any);
  };

  return (
    <OccScreenScaffold
      title="Notifications"
      subtitle="Exclusive updates & community chats.">
      
      <View style={styles.container}>
        {/* Authoritative Segmented Control */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            onPress={() => setActiveTab('announcements')}
            style={[styles.tabItem, activeTab === 'announcements' && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, activeTab === 'announcements' && styles.tabTextActive]}>ANNOUNCEMENTS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('social')}
            style={[styles.tabItem, activeTab === 'social' && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, activeTab === 'social' && styles.tabTextActive]}>SOCIAL HUB</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {activeTab === 'announcements' ? (
            MOCK_ANNOUNCEMENTS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.9}
                onPress={() => navigateTo(`/announcement/${item.id}`, { name: item.club, image: item.image })}
                style={styles.messageRow}
              >
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: item.image }} style={styles.userAvatar} />
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.userName}>{item.club}</Text>
                    <Text style={styles.messageTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.messageBody} numberOfLines={1}>{item.body}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </TouchableOpacity>
            ))
          ) : (
            MOCK_MESSAGES.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.9}
                onPress={() => navigateTo(`/chat/${item.id}`, { name: item.user, avatar: item.avatar })}
                style={styles.messageRow}
              >
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                  {item.online && <View style={styles.onlineBadge} />}
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.userName}>{item.user}</Text>
                    <Text style={styles.messageTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.messageBody} numberOfLines={1}>{item.body}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </TouchableOpacity>
            ))
          )}

          <View style={styles.footerInfo}>
             <Ionicons name="shield-checkmark" size={14} color="#94A3B8" />
             <Text style={styles.footerInfoText}>You are caught up with all cluster activity.</Text>
          </View>
        </ScrollView>
      </View>
    </OccScreenScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: dash.purple,
  },
  list: {
    paddingBottom: 100,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarContainer: {
    position: 'relative',
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontFamily: 'MontBold',
    fontSize: 15,
    color: '#0F172A',
  },
  messageTime: {
    fontFamily: 'InterSemi',
    fontSize: 11,
    color: '#94A3B8',
  },
  messageBody: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: '#64748B',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    opacity: 0.6,
  },
  footerInfoText: {
    fontFamily: 'InterSemi',
    fontSize: 12,
    color: '#64748B',
  },
});
