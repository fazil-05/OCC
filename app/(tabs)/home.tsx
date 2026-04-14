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
import { useAuth, authHeaders, API_URL, resolveUrl } from '@/context/auth-context';
import { usePusherChannel } from '@/hooks/usePusher';
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

type FeedTab = 'forYou' | 'following' | 'all';

function TrendingClubCard({
  c,
  index,
  scrollX,
  step,
  onPress,
}: {
  c: any;
  index: number;
  scrollX: any;
  step: number;
  onPress: (club: any) => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * step,
      index * step,
      (index + 1) * step,
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

  const memberCount = displayClubMembers(c.id, c.memberCount || 0, c.memberDisplayBase);
  const memberLabel = `${memberCount.toLocaleString('en-IN')} MEMBERS`;

  return (
    <Animated.View style={[styles.trendCard, animatedStyle]}>
      <Pressable onPress={() => onPress(c)} style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: resolveUrl(c.coverImage || c.imageUrl) || getFallbackImage(c.slug) }}
          style={styles.trendImageBackground}
          imageStyle={{ borderRadius: 24 }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={styles.trendGradient}
          >
            <View style={styles.trendInfoBox}>
              <Text style={styles.trendName}>{c.name}</Text>
              <Text style={styles.trendMeta}>{memberLabel}</Text>
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

// --- Social Display Logic (Mirrored from Backend) ---
const dummySocialSeed = (entityId: string, salt: string) => {
  let h = 2166136261;
  const s = `${salt}:${entityId}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 1 + (Math.abs(h) % 799);
};

const displayClubMembers = (clubId: string, realMembers: number, storedBase?: number | null) => {
  const base = (storedBase != null && storedBase >= 100 && storedBase < 800)
    ? storedBase
    : dummySocialSeed(clubId, "club-followers");
  return base + Math.max(0, realMembers);
};

const displayPostLikes = (postId: string, realLikes: number) => {
  return dummySocialSeed(postId, "post-likes") + Math.max(0, realLikes);
};

const getFallbackImage = (slug: string) => {
  const s = (slug || '').toUpperCase();
  if (s.includes('SPORT') || s.includes('FITNESS')) return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80';
  if (s.includes('MUSIC')) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80';
  if (s.includes('DESIGN') || s.includes('FASHION')) return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80';
  if (s.includes('TECH') || s.includes('CODE') || s.includes('DEV')) return 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80';
  if (s.includes('PHOTO') || s.includes('LENS')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80';
  if (s.includes('BIKE') || s.includes('RIDER') || s.includes('MOTOR')) return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&w=800&q=80';
  return 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?w=800&auto=format&fit=crop&q=80';
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, token, ready } = useAuth();
  const { handleScroll, handleScrollEnd } = useScroll();

  const [montserratLoaded] = useMontserrat({ Montserrat_900Black });
  const [interLoaded] = useInter({ Inter_600SemiBold, Inter_700Bold });

  const [refreshing, setRefreshing] = useState(false);
  const [feedTab, setFeedTab] = useState<FeedTab>('all');
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const currentIndex = useRef(0);

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

  const [livePosts, setLivePosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [liveClubs, setLiveClubs] = useState<any[]>([]);

  // Infinite Scroll Helpers for Carousel
  const loopedClubs = liveClubs.length > 0 ? [...liveClubs, ...liveClubs, ...liveClubs] : [];
  const snapOffsets = loopedClubs.map((_, i) => i * STEP);

  // REALTIME POSTS FEED PIPELINE
  // We extract all Club IDs the user is part of + global feed node
  const clubSubChannels = [
    'global-posts',
    ...(user?.memberships || []).map((m: any) => `club-${m.clubId}`)
  ];

  usePusherChannel(clubSubChannels, 'new-post', (payload) => {
    console.log('[WEBSOCKET] Real-time New Post Dropped!', payload);
    fetchLivePosts(feedTab); // Instantly silently inject the feed
  });

  const fetchLivePosts = async (tab: FeedTab) => {
    setLoadingPosts(true);
    try {
      // Determine endpoint based on tab
      // 'all' uses explore/posts
      // 'following' or 'forYou' uses the general posts endpoint
      const endpoint = tab === 'all' ? `${API_URL}/api/explore/posts` : `${API_URL}/api/posts`;
      
      const res = await fetch(endpoint, {
        headers: authHeaders(token)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.posts) {
          const formatted = data.posts.map((p: any) => ({
            id: p.id,
            author: { 
              name: p.user?.fullName || 'User', 
              avatarUrl: resolveUrl(p.user?.avatar) || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
              verified: p.user?.role === 'CLUB_HEADER' || p.user?.role === 'ADMIN',
              handle: p.club?.slug || p.user?.fullName?.split(' ')[0].toLowerCase() || 'member'
            },
            timeLabel: p.createdAt ? 'now' : '2h', // Simplification, could use date-fns
            imageUrl: resolveUrl(p.imageUrl || (p.imageUrls && p.imageUrls[0])) || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1080&q=90',
            caption: p.caption || p.content || '',
            likes: displayPostLikes(p.id, p.likesCount || 0),
            comments: p.comments?.length || p.commentsCount || 0,
          }));
          setLivePosts(formatted);
        }
      } else {
        console.log('Posts fetch failed:', res.status);
      }
    } catch (err) {
      console.log('Error fetching live posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const [liveEvents, setLiveEvents] = useState<any[]>([]);

  const fetchLiveEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        headers: authHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.events) {
          setLiveEvents(data.events.map((e: any) => ({
            id: e.id,
            title: e.title,
            clubName: e.club?.name || 'OCC Club',
            dateLabel: e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Soon',
            imageUrl: resolveUrl(e.imageUrl) || resolveUrl(e.club?.coverImage) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=90',
            description: e.description || '',
            location: e.location || 'Campus venue',
            attendees: e._count?.registrations || 42,
          })));
        }
      }
    } catch (err) {
      console.log('Error fetching events:', err);
    }
  };

  const fetchLiveClubs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clubs`, {
        headers: authHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.clubs) {
          setLiveClubs(data.clubs);
        }
      }
    } catch (err) {
      console.log('Error fetching live clubs:', err);
    }
  };

  useEffect(() => {
    if (ready) {
      fetchLivePosts(feedTab);
      fetchLiveEvents();
      fetchLiveClubs();
    }
  }, [feedTab, ready]);

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
    if (liveClubs.length === 0) return;

    const TOTAL = liveClubs.length;
    const startX = TOTAL * STEP;
    currentIndex.current = TOTAL;

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
  }, [liveClubs.length]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchLivePosts(feedTab),
      fetchLiveEvents()
    ]);
    setRefreshing(false);
  }, [feedTab]);

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
            snapToOffsets={snapOffsets}
            snapToAlignment="center"
            scrollEventThrottle={16}
            onScroll={onCarouselScroll}
            style={styles.trendingScrollView}
            contentContainerStyle={styles.trendingHScroll}
          >
            {loopedClubs.map((c, index) => (
              <TrendingClubCard
                key={`${c.id}-${index}`}
                c={c}
                index={index}
                scrollX={scrollX}
                step={STEP}
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
          {liveEvents.length > 0 ? liveEvents.slice(0, 3).map((ev) => (
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
          )) : !loadingPosts && (
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ textAlign: 'center', color: dash.textSoft, fontSize: 13 }}>No upcoming events found.</Text>
            </View>
          )}
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
          {liveClubs.slice(0, 6).map((club) => (
            <TouchableOpacity
              key={club.id}
              onPress={() => handleOpenClub(club)}
              style={styles.trendRow}
            >
              <Image source={{ uri: resolveUrl(club.coverImage || club.icon) || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=90' }} style={styles.trendRowAvatar} />
              <View style={{ flex: 1 }}>
                <View style={styles.trendRowName}>
                  <Text style={styles.trendRowTitle}>{club.name}</Text>
                </View>
                <Text style={styles.trendRowMeta}>{displayClubMembers(club.id, club.memberCount || 0, club.memberDisplayBase).toLocaleString('en-IN')} MEMBERS</Text>
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
          {livePosts.map((post) => (
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