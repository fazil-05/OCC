import { ClubDetailModal } from '@/components/occ/ClubDetailModal';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScroll } from '@/context/ScrollContext';

const { width } = Dimensions.get('window');

const SPACING = { xs: 6, sm: 10, md: 16, lg: 20, xl: 24 };
const CARD_GAP = 12;
const HORIZONTAL_PAD = SPACING.md;
const COLUMN_WIDTH = (width - HORIZONTAL_PAD * 2 - CARD_GAP) / 2;
const BANNER_WIDTH = width - HORIZONTAL_PAD * 2;
const BANNER_ITEM_WIDTH = BANNER_WIDTH + SPACING.sm; // card width + gap
const AUTO_SCROLL_MS = 3500;

const CLUB_CATEGORIES = ['ALL CLUBS', 'ELITE SPORTS', 'GLOBAL MUSIC', 'ART & DESIGN', 'TECHNOLOGY'];

type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  eliteCount: number;
};

const CLUBS_DATA: Club[] = [
  { id: '1', name: 'GAMING CLUB', category: 'ART & DESIGN', description: 'Organize gaming tournaments, LAN parties, and esports events across the campus ecosystem.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', eliteCount: 1 },
  { id: '2', name: 'FASHION', category: 'ART & DESIGN', description: 'High-end showcases, brand deals, and elite styling sessions.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', eliteCount: 2 },
  { id: '3', name: 'FITNESS', category: 'ELITE SPORTS', description: 'Extreme group workouts, professional nutrition, and athletic challenges.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', eliteCount: 5 },
  { id: '4', name: 'PHOTOGRAPHY', category: 'ART & DESIGN', description: 'International photo walks, exhibitions, and exclusive paid shoots.', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80', eliteCount: 3 },
  { id: '5', name: 'SPORTS FOOTBALL', category: 'ELITE SPORTS', description: 'Professional turf bookings, weekly matches, and scouting tournaments.', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', eliteCount: 1 },
  { id: '6', name: 'MUSIC', category: 'GLOBAL MUSIC', description: 'Elite open mics, studio sessions, and industry collaborations.', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', eliteCount: 2 },
  { id: '7', name: 'BIKERS', category: 'ELITE SPORTS', description: 'Sunrise miles with the crew. High-performance distance rides. Next ride: Nandi 🏍️', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', eliteCount: 6 },
  { id: '8', name: 'AI & ROBOTICS', category: 'TECHNOLOGY', description: 'Building the future of human-agent collaboration and deep-tech innovation.', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', eliteCount: 12 },
  { id: '9', name: 'WEB3 VENTURES', category: 'TECHNOLOGY', description: 'DeFi protocols, smart contract architecture, and the decentralized web.', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80', eliteCount: 8 },
];

const BANNER_CARDS = [
  { id: 'b1', title: 'FIND YOUR PEOPLE.', subtitle: "Exclusive communities curated for the industry's movers and shakers.", image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', highlight: 'PEOPLE.' },
  { id: 'b2', title: 'THE ARTIST BLOCK.', subtitle: 'Collaborate with top designers, painters and creators on campus.', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80', highlight: 'BLOCK.' },
  { id: 'b3', title: 'TECH VENTURES.', subtitle: 'Build the next big thing with our global network of developers.', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80', highlight: 'VENTURES.' },
];

function BannerCarousel() {
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const isUserScrolling = useRef(false);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isUserScrolling.current) return;

      const next = (indexRef.current + 1) % BANNER_CARDS.length;
      indexRef.current = next;
      setActiveDot(next);

      scrollRef.current?.scrollTo({ x: next * BANNER_ITEM_WIDTH, animated: true });
    }, AUTO_SCROLL_MS);

    return () => clearInterval(timer);
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_ITEM_WIDTH);
    if (idx !== indexRef.current) {
      indexRef.current = idx;
      setActiveDot(idx);
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled={false}
      snapToInterval={BANNER_ITEM_WIDTH}
      snapToAlignment="start"
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      onScrollBeginDrag={() => (isUserScrolling.current = true)}
      onScrollEndDrag={() => (isUserScrolling.current = false)}
      onMomentumScrollEnd={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingHorizontal: SPACING.md }}
    >
      {BANNER_CARDS.map((card) => (
        <View key={card.id} style={styles.bannerItem}>
          <ImageBackground source={{ uri: card.image }} style={styles.bannerImage} imageStyle={{ borderRadius: 28 }}>
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.95)']} style={styles.bannerGradient}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>
                  {card.title.split(card.highlight)[0]}
                  <Text style={{ color: '#7C3AED' }}>{card.highlight}</Text>
                </Text>
                <Text style={styles.bannerSub} numberOfLines={2}>
                  {card.subtitle}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      ))}
    </ScrollView>
  );
}

export default function ClubsPage() {
  const insets = useSafeAreaInsets();
  const { handleScroll, handleScrollEnd } = useScroll();
  const [selectedCategory, setSelectedCategory] = useState('ALL CLUBS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const filteredClubs = CLUBS_DATA.filter((club) => {
    const matchesCategory = selectedCategory === 'ALL CLUBS' || club.category === selectedCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.root}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <View style={[styles.header, { paddingTop: insets.top + 10, marginBottom: 0 }]} />

        {/* Hero Banner Section */}
        <BannerCarousel />

        {/* Categories Bar */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CLUB_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryBtn, selectedCategory === cat && styles.activeCategoryBtn]}
              >
                <Text style={[styles.categoryBtnText, selectedCategory === cat && styles.activeCategoryBtnText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dynamic Grid Section */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridTitle}>DISCOVER CLUBS ({filteredClubs.length})</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.clubGrid}>
          {filteredClubs.map((club) => (
            <TouchableOpacity key={club.id} style={styles.clubCard} onPress={() => setSelectedClub(club)}>
              <View style={styles.cardImageWrap}>
                <Image source={{ uri: club.image }} style={styles.cardImage} contentFit="cover" />
                <View style={styles.eliteBadge}>
                  <View style={styles.eliteDot} />
                  <Text style={styles.eliteBadgeText}>{club.eliteCount} ELITE</Text>
                </View>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.cardGradient}>
                  <Text style={styles.clubName}>{club.name}</Text>
                  <Text style={styles.clubDesc} numberOfLines={1}>
                    {club.description}
                  </Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Club Detail Modal */}
      <ClubDetailModal visible={!!selectedClub} onClose={() => setSelectedClub(null)} club={selectedClub} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: SPACING.md, marginBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brandMark: { fontFamily: 'MontBold', fontSize: 32, color: '#0F172A', letterSpacing: -1 },
  brandSub: { fontFamily: 'InterSemi', fontSize: 13, color: '#64748B', marginTop: -4 },
  notiBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  notiDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7C3AED', borderWidth: 2, borderColor: '#fff' },
  pageTitle: { fontFamily: 'ArchivoHeavyItalic', fontSize: 38, color: '#0F172A', letterSpacing: -1.5, marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  searchInput: { flex: 1, marginLeft: 12, fontFamily: 'InterSemi', fontSize: 15, color: '#1E293B' },
  bannerItem: { width: BANNER_WIDTH, marginRight: SPACING.sm },
  bannerImage: { width: '100%', aspectRatio: 1.8, overflow: 'hidden' },
  bannerGradient: { flex: 1, justifyContent: 'flex-end', padding: 24, borderRadius: 28 },
  bannerContent: { maxWidth: '85%' },
  bannerTitle: { color: '#fff', fontSize: 28, fontFamily: 'ArchivoHeavyItalic', letterSpacing: -0.5 },
  bannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'InterBold', marginTop: 8, lineHeight: 18 },
  categoryContainer: { marginTop: 12, marginBottom: 16 },
  categoryScroll: { paddingHorizontal: SPACING.md, gap: 10 },
  categoryBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9' },
  activeCategoryBtn: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  categoryBtnText: { fontFamily: 'InterBold', fontSize: 11, color: '#64748B', letterSpacing: 0.5 },
  activeCategoryBtnText: { color: '#fff' },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, marginBottom: 16 },
  gridTitle: { fontFamily: 'InterBold', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5 },
  seeAllText: { fontFamily: 'InterBold', fontSize: 10, color: '#7C3AED', letterSpacing: 0.5 },
  clubGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: CARD_GAP },
  clubCard: { width: COLUMN_WIDTH, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5 },
  cardImageWrap: { width: '100%', height: COLUMN_WIDTH * 1.4, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  eliteBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6 },
  eliteDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7C3AED' },
  eliteBadgeText: { color: '#fff', fontSize: 9, fontFamily: 'InterBold', letterSpacing: 0.5 },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', justifyContent: 'flex-end', padding: 14 },
  clubName: { color: '#fff', fontSize: 16, fontFamily: 'ArchivoHeavyItalic', letterSpacing: 0.2 },
  clubDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'InterSemi', marginTop: 4 },
});