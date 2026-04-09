import { dash } from '@/constants/occ-dashboard-theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_ANNOUNCEMENTS = [
  { id: '1', text: 'Dawn Ride To Nandi starts in 2 hours. Bring your riding gear! 🏍️', time: '8:00 AM', reactions: [] },
  { id: '2', text: 'Guest list for tomorrow is now live. Check the link in bio.', time: 'Yesterday', reactions: ['🔥', '❤️'] },
  { id: '3', text: 'Important: Meeting point changed to Gate 2.', time: '2 days ago', reactions: ['👍'] },
];

const EMOJIS = ['❤️', '🔥', '👍', '🙌', '✨', '🎈'];

export default function ClubAnnouncementsScreen() {
  const { name, image } = useLocalSearchParams<{ name: string, image: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(MOCK_ANNOUNCEMENTS);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [activeMsgId, setActiveMsgId] = useState<string | null>(null);

  const addReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const next = m.reactions.includes(emoji)
          ? m.reactions.filter(e => e !== emoji)
          : [...m.reactions, emoji];
        return { ...m, reactions: next };
      }
      return m;
    }));
    setReactionModalVisible(false);
  };

  const onLongPressMessage = (id: string) => {
    setActiveMsgId(id);
    setReactionModalVisible(true);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Authoritative Club Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={dash.text} />
        </TouchableOpacity>
        <Image source={{ uri: image }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name || 'Club'}</Text>
          <Text style={styles.headerStatus}>Announcements Only</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="information-circle-outline" size={22} color={dash.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="megaphone-outline" size={16} color={dash.purple} />
        <Text style={styles.infoText}>Only members can view. Replies are disabled.</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.announcementGroup}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onLongPress={() => onLongPressMessage(item.id)}
              style={styles.announcementBubble}
            >
              <Text style={styles.announcementText}>{item.text}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>

              {item.reactions.length > 0 && (
                <View style={styles.reactionPillRow}>
                  {item.reactions.map(e => (
                    <View key={e} style={styles.reactionPill}>
                      <Text style={styles.reactionEmoji}>{e}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={[styles.disabledInput, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text style={styles.disabledText}>Only admins can send messages</Text>
      </View>

      {/* Instagram-style Long-Press Reaction Modal */}
      <Modal
        visible={reactionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReactionModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setReactionModalVisible(false)}
        >
          <View style={styles.emojiModalCard}>
            {EMOJIS.map(e => (
              <TouchableOpacity
                key={e}
                onPress={() => activeMsgId && addReaction(activeMsgId, e)}
                style={styles.emojiModalBtn}
              >
                <Text style={styles.emojiModalText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerAvatar: { width: 40, height: 40, borderRadius: 12 },
  headerInfo: { flex: 1, marginLeft: 12 },
  headerName: { fontFamily: 'MontBold', fontSize: 16, color: '#0F172A' },
  headerStatus: { fontFamily: 'InterSemi', fontSize: 12, color: dash.purple },
  headerAction: { padding: 8 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    padding: 10,
    justifyContent: 'center',
    gap: 8,
  },
  infoText: { fontFamily: 'InterSemi', fontSize: 12, color: dash.purple },
  listContent: { padding: 16, gap: 24 },
  announcementGroup: { gap: 8 },
  announcementBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
  },
  announcementText: { fontFamily: 'InterRegular', fontSize: 15, color: '#1E293B', lineHeight: 22 },
  messageTime: { fontSize: 10, color: '#94A3B8', marginTop: 8 },
  reactionPillRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -10,
    right: 8,
    gap: 4,
  },
  reactionPill: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reactionEmoji: { fontSize: 12 },
  disabledInput: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  disabledText: {
    fontFamily: 'InterSemi',
    fontSize: 13,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiModalCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 99,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  emojiModalBtn: {
    padding: 4,
  },
  emojiModalText: {
    fontSize: 28,
  },
});
