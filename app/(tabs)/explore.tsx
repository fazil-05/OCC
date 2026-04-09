import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScroll } from '@/context/ScrollContext';
import { dash } from '@/constants/occ-dashboard-theme';
import { FeedPostCard } from '@/components/occ/FeedPostCard';
import { MOCK_FEED_POSTS, MOCK_EVENTS } from '@/constants/occ-mock-feed';
import { ClubDetailModal } from '@/components/occ/ClubDetailModal';
import { EventDetailModal } from '@/components/occ/EventDetailModal';

const { width } = Dimensions.get('window');

const EXPLORE_CLUBS = [
  { 
    id: 'c1', 
    name: 'Vanguard Elite', 
    category: 'ELITE SPORTS', 
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    members: '2.1k',
    eliteCount: 2100,
    description: 'The pinnacle of campus athletics. Join the vanguard for exclusive training sessions and competitive leagues.'
  },
  { 
    id: 'c2', 
    name: 'Neon Sound', 
    category: 'GLOBAL MUSIC', 
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    members: '1.5k',
    eliteCount: 1540,
    description: 'From deck sessions to underground jam nights. Neon Sound is the heartbeat of the campus music scene.'
  },
  { 
    id: 'c3', 
    name: 'Lens Society', 
    category: 'PHOTOGRAPHY', 
    image: 'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    members: '840',
    eliteCount: 840,
    description: 'Capturing moments that last. Join a community of visual storytellers and elite photographers.'
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { handleScroll, handleScrollEnd } = useScroll();
  const [activeSegment, setActiveSegment] = useState<'POSTS' | 'CLUBS' | 'EVENTS'>('POSTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);

  const handleOpenClub = (club: any) => {
    const formatted = {
      ...club,
      title: club.name,
    };
    setSelectedClub(formatted);
    setClubModalVisible(true);
  };

  const handleOpenEvent = (ev: any) => {
    setSelectedEvent(ev);
    setEventModalVisible(true);
  };

  // Search Logic
  const filteredPosts = [...MOCK_FEED_POSTS].reverse().filter(p => 
    p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClubs = EXPLORE_CLUBS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = MOCK_EVENTS.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 150 }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EXPLORE</Text>
          <Text style={styles.subtitle}>Discover the club ecosystem</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={dash.textMuted} />
            <TextInput 
              placeholder={`Search ${activeSegment.toLowerCase()}...`} 
              placeholderTextColor={dash.textSoft}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={dash.textSoft} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentContainer}>
          {['POSTS', 'CLUBS', 'EVENTS'].map((seg) => (
            <TouchableOpacity 
              key={seg} 
              style={[styles.segmentBtn, activeSegment === seg && styles.segmentBtnActive]}
              onPress={() => {
                setActiveSegment(seg as any);
                setSearchQuery(''); // Reset search when switching tabs
              }}
            >
              <Text style={[styles.segmentText, activeSegment === seg && styles.segmentTextActive]}>{seg}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Content */}
        {activeSegment === 'POSTS' && (
          <View style={styles.postSpace}>
            {filteredPosts.map((post) => (
              <FeedPostCard key={post.id} post={post} width={width} />
            ))}
            {filteredPosts.length === 0 && (
              <View style={styles.noResults}><Text style={styles.noResultsText}>No posts found for "{searchQuery}"</Text></View>
            )}
          </View>
        )}

        {activeSegment === 'CLUBS' && (
          <View style={styles.cardList}>
            {filteredClubs.map(club => (
              <TouchableOpacity key={club.id} activeOpacity={0.9} onPress={() => handleOpenClub(club)}>
                <ExploreClubCard club={club} />
              </TouchableOpacity>
            ))}
            {filteredClubs.length === 0 && (
              <View style={styles.noResults}><Text style={styles.noResultsText}>No clubs found for "{searchQuery}"</Text></View>
            )}
          </View>
        )}

        {activeSegment === 'EVENTS' && (
          <View style={styles.cardList}>
            {filteredEvents.map(ev => (
              <TouchableOpacity key={ev.id} activeOpacity={0.9} onPress={() => handleOpenEvent(ev)}>
                <ExploreEventCard event={ev} />
              </TouchableOpacity>
            ))}
            {filteredEvents.length === 0 && (
              <View style={styles.noResults}><Text style={styles.noResultsText}>No events found for "{searchQuery}"</Text></View>
            )}
          </View>
        )}
      </ScrollView>

      <ClubDetailModal 
        visible={clubModalVisible}
        club={selectedClub}
        onClose={() => setClubModalVisible(false)}
      />

      <EventDetailModal 
        visible={eventModalVisible}
        event={selectedEvent}
        onClose={() => setEventModalVisible(false)}
      />
    </View>
  );
}

function ExploreClubCard({ club }: { club: any }) {
  return (
    <View style={styles.wideCard}>
      <Image source={{ uri: club.image }} style={styles.wideCardImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.itemOverlay}>
        <View style={styles.itemContent}>
          <Text style={styles.wideCardCategory}>{club.category}</Text>
          <Text style={styles.wideCardTitle}>{club.name}</Text>
          <View style={styles.clubMetaRow}>
            <Ionicons name="people" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.wideCardMeta}>{club.members} Members</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function ExploreEventCard({ event }: { event: any }) {
  return (
    <View style={styles.wideCard}>
      <Image source={{ uri: event.imageUrl }} style={styles.wideCardImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.itemOverlay}>
        <View style={styles.itemContent}>
          <Text style={styles.wideCardCategory}>{event.clubName}</Text>
          <Text style={styles.wideCardTitle}>{event.title}</Text>
          <View style={styles.clubMetaRow}>
            <Ionicons name="calendar" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.wideCardMeta}>{event.dateLabel}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 24, marginBottom: 15 },
  title: { fontSize: 34, fontWeight: '900', color: dash.text, letterSpacing: -1.5, fontStyle: 'italic' },
  subtitle: { fontSize: 13, color: dash.textSoft, fontWeight: '600', marginTop: 2 },
  segmentContainer: { 
    flexDirection: 'row', 
    marginHorizontal: 24, 
    backgroundColor: '#F3F4FB', 
    borderRadius: 14, 
    padding: 4, 
    marginBottom: 20 
  },
  segmentBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  segmentBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  segmentText: { fontSize: 11, fontWeight: '800', color: dash.textSoft, letterSpacing: 0.5 },
  segmentTextActive: { color: dash.text },
  searchContainer: { paddingHorizontal: 24, marginBottom: 20 },
  searchBar: { height: 50, backgroundColor: '#F3F4FB', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600', color: dash.text },
  postSpace: { marginTop: 0 },
  cardList: { paddingHorizontal: 16, gap: 16 },
  itemOverlay: { position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 20 },
  itemContent: { gap: 4 },
  wideCard: { height: 220, borderRadius: 28, overflow: 'hidden', backgroundColor: '#eee' },
  wideCardImage: { width: '100%', height: '100%' },
  wideCardCategory: { fontSize: 10, fontWeight: '900', color: dash.purple, letterSpacing: 1.5, textTransform: 'uppercase' },
  wideCardTitle: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  wideCardMeta: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.2 },
  clubMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  noResults: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  noResultsText: { fontSize: 14, fontWeight: '700', color: dash.textSoft, textAlign: 'center' },
});
