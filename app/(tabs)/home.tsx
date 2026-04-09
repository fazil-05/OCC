import {
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInter,
} from '@expo-google-fonts/inter';
import {
  Montserrat_900Black,
  useFonts as useMontserrat,
} from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryClubsModal } from '@/components/occ/CategoryClubsModal';
import { ClubDetailModal } from '@/components/occ/ClubDetailModal';
import { EventDetailModal } from '@/components/occ/EventDetailModal';
import { FeedPostCard } from '@/components/occ/FeedPostCard';
import { OCCAnimatedLogo } from '@/components/occ/OCCAnimatedLogo';
import { dash } from '@/constants/occ-dashboard-theme';
import {
  MOCK_EVENTS,
  MOCK_FEED_POSTS,
  MOCK_TRENDING_CARDS,
  MOCK_TRENDING_ROWS,
} from '@/constants/occ-mock-feed';
import { useAuth } from '@/context/auth-context';
import { useScroll } from '@/context/ScrollContext';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.79;
const CARD_H = CARD_W * 1.4;
const PAD = 16;

// The gap between cards — positive value = breathing room between cards
const CARD_GAP = -10;
// How far each card advances the scroll
const STEP = CARD_W + CARD_GAP;
// Left/right padding so the active card is perfectly centered on screen
const SIDE_PAD = (width - CARD_W) / 2;

// Infinite-loop: render 3 copies.
// Start in the middle copy so there's room to loop both directions.
const LOOPED_CARDS = [
  ...MOCK_TRENDING_CARDS,
  ...MOCK_TRENDING_CARDS,
  ...MOCK_TRENDING_CARDS,
];

// Pre-compute exact snap offsets so every card lands perfectly centred.
// snapToOffsets is more reliable than snapToInterval for centred layouts.
const SNAP_OFFSETS = LOOPED_CARDS.map((_, i) => i * STEP);

type FeedTab = 'forYou' | 'following' | 'all';

function TrendingClubCard({
  c,
  index,
  scrollX,
  onPress,
}: {
  c: any;
  index: number;
  scrollX: any;
  onPress: (club: any) => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * STEP,
      index * STEP,
      (index + 1) * STEP,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    const zIndex = Math.round(
      interpolate(scrollX.value, inputRange, [1, 10, 1], Extrapolate.CLAMP)
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolate.CLAMP
    );

    return { transform: [{ scale }], zIndex, opacity };
  });

  return (
    <Animated.View style={[styles.trendCard, animatedStyle]}>
      <Pressable onPress={() => onPress(c)} style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: c.coverUrl }}
          style={styles.trendImageBackground}
          imageStyle={{ borderRadius: 24 }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={styles.trendGradient}
          >
            <View style={styles.trendInfoBox}>
              <Text style={styles.trendName}>{c.name}</Text>
              <Text style={styles.trendMeta}>{c.memberLabel}</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.joinCluster}>
                <Text style={styles.joinClusterText}>+ JOIN CLUB</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { handleScroll, handleScrollEnd } = useScroll();

  const [montserratLoaded] = useMontserrat({ Montserrat_900Black });
  const [interLoaded] = useInter({ Inter_600SemiBold, Inter_700Bold });

  const [refreshing, setRefreshing] = useState(false);
  const [feedTab, setFeedTab] = useState<FeedTab>('forYou');
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  // Start index points at index 0 of the middle copy
  const currentIndex = useRef(MOCK_TRENDING_CARDS.length);

  // ── Must be declared at the top level of the component, NOT inline in JSX ──
  const onCarouselScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [selectedClubData, setSelectedClubData] = useState<any>(null);
  const [clubModalVisible, setClubModalVisible] = useState(false);

  useEffect(() => {
    if (montserratLoaded && interLoaded) {
      SplashScreen.hideAsync();
    }
  }, [montserratLoaded, interLoaded]);

  const displayName = user?.fullName?.trim() || 'Guest';
  const firstName = displayName.split(/\s+/)[0] ?? displayName;

  const handleOpenEvent = (ev: any) => {
    setSelectedEvent(ev);
    setEventModalVisible(true);
  };

  const handleOpenCategory = (cat: string) => {
    // Map the row name to the specific club ID or name for filtering
    setSelectedCategory(cat);
    setCategoryModalVisible(true);
  };

  const handleOpenClub = (c: any) => {
    // Wrap trending card data to match ClubDetailModal's expected format
    const formatted = {
      id: c.id,
      name: c.name,
      category: c.category || 'ELITE CLUB',
      description: 'Explore the high-fidelity ecosystem of this exclusive club cluster.',
      image: c.coverUrl,
      eliteCount: parseInt(c.memberLabel) || 120
    };
    setSelectedClubData(formatted);
    setClubModalVisible(true);
  };

  const CLUBS_MAP: Record<string, any[]> = {
    'Bikers': [
      { id: 'b1', name: 'Bikers OCC', memberCount: 158, avatarUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=90', verified: true },
      { id: 'b2', name: 'Cruisers Bangalore', memberCount: 84, avatarUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=90', verified: false },
    ],
    'Music': [
      { id: 'm1', name: 'Studio 7', memberCount: 482, avatarUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=90', verified: true },
      { id: 'm2', name: 'Electronic Night', memberCount: 1205, avatarUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=90', verified: true },
    ],
    'Sports Football': [
      { id: 'sf1', name: 'Goal Diggers', memberCount: 519, avatarUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=90', verified: true },
      { id: 'sf2', name: 'Turf Legends', memberCount: 231, avatarUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=90', verified: false },
    ],
    'Photography': [
      { id: 'p1', name: 'PhotoWalk Club', memberCount: 570, avatarUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=90', verified: true },
      { id: 'p2', name: 'Shutter Elite', memberCount: 142, avatarUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=90', verified: false },
    ],
    'Fitness': [
      { id: 'f1', name: 'X-TREME FIT', memberCount: 841, avatarUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=90', verified: true },
      { id: 'f2', name: 'YOGA FLOW', memberCount: 220, avatarUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=90', verified: false },
    ],
    'Fashion': [
      { id: 'fa1', name: 'Fashion Row', memberCount: 312, avatarUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=90', verified: true },
      { id: 'fa2', name: 'Vogue Society', memberCount: 95, avatarUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=90', verified: false },
    ],
  };

  // ── Infinite auto-scroll ──────────────────────────────────────────────────
  useEffect(() => {
    const TOTAL = MOCK_TRENDING_CARDS.length;
    const startX = TOTAL * STEP;

    // Silently jump to the middle copy on mount
    scrollViewRef.current?.scrollTo({ x: startX, animated: false });
    scrollX.value = startX;

    const interval = setInterval(() => {
      currentIndex.current += 1;

      scrollViewRef.current?.scrollTo({
        x: currentIndex.current * STEP,
        animated: true,
      });

      // When we finish the middle copy, silently reset to the first copy.
      // Wait 420 ms for the scroll animation to complete first.
      if (currentIndex.current >= TOTAL * 2) {
        setTimeout(() => {
          currentIndex.current = TOTAL;
          scrollViewRef.current?.scrollTo({
            x: currentIndex.current * STEP,
            animated: false,
          });
          scrollX.value = currentIndex.current * STEP;
        }, 420);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 450));
    setRefreshing(false);
  }, []);

  // If fonts aren't ready, show nothing (Splash screen stays visible)
  // MOVED AFTER HOOKS to prevent Render Error
  if (!montserratLoaded || !interLoaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={dash.purple} />
        }
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 60,
          paddingTop: insets.top - 5,
          backgroundColor: '#FFFFFF',
        }}>

        {/* Premium Floating Header */}
        <View style={styles.floatingHeaderContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(250,250,255,0.9)']}
            style={styles.headerGlassPill}
          >
            <View style={styles.brandRowGlass}>
              <OCCAnimatedLogo />
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.profileGlassBtn}
            >
              <Image
                source={{
                  uri:
                    user?.avatar ??
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
                }}
                style={styles.profileGlassImg}
              />
              <View style={styles.glassIndicator} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Trending Section title */}
        <View style={[styles.sectionTitleRow, { paddingHorizontal: PAD, marginTop: 10 }]}>
          <View style={styles.sectionTitleLeft}>
            <Text style={styles.sectionTitle}>Trending Clubs</Text>
          </View>
        </View>

        {/* ── Carousel ─────────────────────────────────────────────────────── */}
        <View style={styles.stackedContainer}>
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToOffsets={SNAP_OFFSETS}
            snapToAlignment="center"
            scrollEventThrottle={16}
            onScroll={onCarouselScroll}
            style={styles.trendingScrollView}
            contentContainerStyle={styles.trendingHScroll}
          >
            {LOOPED_CARDS.map((c, index) => (
              <TrendingClubCard
                key={`${c.id}-${index}`}
                c={c}
                index={index}
                scrollX={scrollX}
                onPress={handleOpenClub}
              />
            ))}
          </Animated.ScrollView>
        </View>

        {/* Upcoming events */}
        <View
          style={[
            styles.sectionTitleRow,
            { paddingHorizontal: PAD, marginTop: 4, backgroundColor: '#FFFFFF' },
          ]}
        >
          <View style={styles.sectionTitleLeft}>
            <Ionicons name="calendar-outline" size={20} color={dash.text} />
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
          </View>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>SEE ALL</Text>
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: PAD, gap: 12, backgroundColor: '#FFFFFF' }}>
          {MOCK_EVENTS.map((ev) => (
            <Pressable
              key={ev.id}
              onPress={() => handleOpenEvent(ev)}
              style={({ pressed }) => [styles.eventRow, pressed && { opacity: 0.95 }]}
            >
              <Image source={{ uri: ev.imageUrl }} style={styles.eventThumb} contentFit="cover" />
              <View style={styles.eventText}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {ev.title}
                </Text>
                <Text style={styles.eventClub}>{ev.clubName}</Text>
                <Text style={styles.eventWhen}>{ev.dateLabel}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Club Types */}
        <View style={[styles.sectionTitleRow, { paddingHorizontal: PAD, marginTop: 26 }]}>
          <View style={styles.sectionTitleLeft}>
            <Ionicons name="grid-outline" size={20} color={dash.text} />
            <Text style={styles.sectionTitle}>CLUB TYPES</Text>
          </View>
          <Pressable hitSlop={8} onPress={() => router.push('/clubs')}>
            <Text style={styles.link}>MORE</Text>
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: PAD, gap: 4 }}>
          {MOCK_TRENDING_ROWS.map((row) => (
            <TouchableOpacity
              key={row.id}
              onPress={() => handleOpenCategory(row.name)}
              style={styles.trendRow}
            >
              <Image source={{ uri: row.avatarUrl }} style={styles.trendRowAvatar} />
              <View style={{ flex: 1 }}>
                <View style={styles.trendRowName}>
                  <Text style={styles.trendRowTitle}>{row.name}</Text>
                </View>
                <Text style={styles.trendRowMeta}>Explore this category</Text>
              </View>
              <View style={styles.joinSmall}>
                <Text style={styles.joinSmallText}>Open</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feed filter chips */}
        <View style={[styles.filterRow, { paddingHorizontal: PAD, marginTop: 28 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {(
              [
                { key: 'forYou' as const, label: 'FOR YOU' },
                { key: 'following' as const, label: 'FOLLOWING' },
                { key: 'all' as const, label: 'ALL CLUBS' },
              ] as const
            ).map(({ key, label }) => {
              const on = feedTab === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setFeedTab(key)}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable style={styles.filterIconBtn} hitSlop={8}>
            <Ionicons name="options-outline" size={22} color={dash.text} />
          </Pressable>
        </View>

        <Text style={[styles.feedHeading, { paddingHorizontal: PAD }]}>Feed</Text>
        <Text style={[styles.feedHint, { paddingHorizontal: PAD }]}>
          {feedTab === 'forYou' && 'For you — based on your interests'}
          {feedTab === 'following' && 'Latest from the clubs you follow'}
          {feedTab === 'all' && 'Everything happening on campus'}
        </Text>

        <View style={{ marginTop: 8 }}>
          {MOCK_FEED_POSTS.map((post) => (
            <FeedPostCard key={post.id} post={post} width={width} />
          ))}
        </View>
      </ScrollView>

      <CategoryClubsModal
        categoryName={selectedCategory ?? ''}
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        clubs={selectedCategory ? (CLUBS_MAP[selectedCategory] || []) : []}
      />

      <EventDetailModal
        event={selectedEvent}
        visible={eventModalVisible}
        onClose={() => setEventModalVisible(false)}
      />

      <ClubDetailModal
        visible={clubModalVisible}
        club={selectedClubData}
        onClose={() => setClubModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  floatingHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 100,
  },
  headerGlassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4, // Slimmer profile
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  brandRowGlass: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandCircleGlass: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: dash.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextCol: { gap: 1 },
  brandOffGlass: { fontSize: 14, fontWeight: '900', color: dash.text, letterSpacing: -0.5 },
  brandSubGlass: { fontSize: 8, fontWeight: '800', color: dash.purple, letterSpacing: 1 },
  profileGlassBtn: { position: 'relative' },
  profileGlassImg: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#fff' },
  glassIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: dash.live,
    borderWidth: 2,
    borderColor: '#fff',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
    letterSpacing: -1.2,
    textTransform: 'uppercase',
  },
  link: { fontSize: 12, fontWeight: '700', color: dash.purple, letterSpacing: 0.5 },

  // ── Carousel ───────────────────────────────────────────────────────────────
  stackedContainer: {
    backgroundColor: '#FFFFFF',
    overflow: 'visible',
  },
  trendingScrollView: {
    overflow: 'visible',
  },
  trendingHScroll: {
    // SIDE_PAD = (screenWidth - cardWidth) / 2
    // This ensures the first and last card are centred when snapped
    paddingLeft: SIDE_PAD,
    paddingRight: SIDE_PAD,
    paddingTop: 8,
    paddingBottom: 20,
  },
  trendCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 24,
    backgroundColor: 'transparent',
    overflow: 'visible',
    // Positive right margin = gap between cards, next card peeks in from the side
    marginRight: CARD_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 8,
  },
  trendImageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 24,
  },
  trendGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    borderRadius: 24,
  },
  // ──────────────────────────────────────────────────────────────────────────

  trendInfoBox: { gap: 2 },
  trendName: {
    fontSize: 22,
    fontFamily: 'Montserrat_900Black',
    color: '#fff',
    letterSpacing: -0.2,
    textTransform: 'uppercase'
  },
  trendMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5
  },
  joinCluster: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  joinClusterText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8
  },
  eventRow: {
    flexDirection: 'row',
    backgroundColor: dash.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: dash.border,
    height: 100,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  eventThumb: { width: 100, height: 100, backgroundColor: dash.border },
  eventText: { flex: 1, padding: 12, justifyContent: 'center' },
  eventTitle: { fontSize: 15, fontWeight: '800', color: dash.text },
  eventClub: {
    fontSize: 12,
    fontWeight: '700',
    color: dash.purple,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  eventWhen: { fontSize: 12, color: dash.textMuted, marginTop: 4 },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 12,
  },
  trendRowAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: dash.border },
  trendRowName: { flexDirection: 'row', alignItems: 'center' },
  trendRowTitle: { fontSize: 15, fontWeight: '700', color: dash.text },
  trendRowMeta: { fontSize: 12, color: dash.textMuted, marginTop: 2 },
  joinSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: dash.purpleSoft,
  },
  joinSmallText: { fontSize: 12, fontWeight: '800', color: dash.purple },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterScroll: { flexGrow: 0, gap: 8, paddingRight: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: dash.surface,
    borderWidth: 1,
    borderColor: dash.border,
  },
  chipOn: { backgroundColor: dash.black, borderColor: dash.black },
  chipText: { fontSize: 11, fontWeight: '800', color: dash.textMuted, letterSpacing: 0.6 },
  chipTextOn: { color: '#fff' },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: dash.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: dash.border,
  },
  feedHeading: { marginTop: 8, fontSize: 16, fontWeight: '800', color: dash.text },
  feedHint: { fontSize: 12, color: dash.textMuted, marginTop: 4, marginBottom: 4 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});