import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dash } from '@/constants/occ-dashboard-theme';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const CARD_W = width * 0.92;
const CARD_H = height * 0.72;
const CARD_GAP = 12;
const STEP = CARD_W + CARD_GAP;
const SIDE_PAD = (width - CARD_W) / 2;

const MOCK_GIGS = [
  {
    id: 'g1',
    title: 'Opportunity for Fashion Content Creators',
    club: 'Fashion',
    postedBy: 'Fashion',
    budget: '₹800 – ₹1,999',
    deadline: '01 May 2026',
    time: '01:20',
    status: 'Open',
    requirements: [
      'Love creating reels, outfit transitions, or aesthetic fashion content?',
      'Consistent posting',
      'Strong visual sense',
      'Trend awareness',
      'Grow your audience with us.',
    ],
  },
  {
    id: 'g2',
    title: 'Event Photographer',
    club: 'Bikers',
    postedBy: 'test',
    budget: '₹500 – ₹2,000',
    deadline: '12 May 2026',
    time: '11:00',
    status: 'Open',
    requirements: [
      'An event photographer documents gatherings like conferences, parties, and weddings by capturing candid moments.',
      'They specialize in visual storytelling through high-quality images, balancing technical skills in lighting and composition.',
      'Deliver memorable photos for the club cluster.',
    ],
  },
];

function GigCard({ gig }: { gig: any }) {
  const [expanded, setExpanded] = React.useState(false);
  const requirements = gig.requirements || [];

  return (
    <View style={[styles.gigCard, { height: expanded ? CARD_H : 400 }]}>
      <View style={styles.gigHeader}>
        <Text style={styles.gigTitle}>{gig.title}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{gig.status}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color="#666" />
        <Text style={styles.metaLabel}>Posted by</Text>
        <Text style={styles.metaValue}>{gig.postedBy}</Text>
      </View>
              
      <View style={[styles.metaRow, { marginTop: 4 }]}>
        <Ionicons name="shirt-outline" size={14} color={dash.purple} />
        <Text style={styles.metaValueClub}>{gig.club}</Text>
      </View>

      <View style={styles.budgetBox}>
        <View style={styles.budgetCol}>
          <Text style={styles.budgetLabel}>BUDGET</Text>
          <Text style={styles.budgetValue}>{gig.budget}</Text>
        </View>
        <View style={styles.dividerV} />
        <View style={styles.budgetCol}>
          <Text style={styles.budgetLabel}>DEADLINE</Text>
          <Text style={styles.deadlineValue}>{gig.deadline}</Text>
          <Text style={styles.deadlineTime}>{gig.time}</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.reqScroll}
      >
        <View style={styles.requirementsList}>
          {expanded && requirements.map((req: string, idx: number) => (
            <View key={idx} style={styles.reqItem}>
              <View style={styles.reqDot} />
              <Text style={styles.reqText}>{req}</Text>
            </View>
          ))}
          
          <TouchableOpacity 
            onPress={() => setExpanded(!expanded)} 
            style={styles.moreBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.moreBtnText}>
              {expanded ? 'HIDE DETAILS' : `SHOW DETAILED REQUIREMENTS (+${requirements.length})`}
            </Text>
            <Ionicons 
              name={expanded ? "chevron-up" : "chevron-down"} 
              size={14} 
              color={dash.purple} 
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
        <Text style={styles.applyBtnText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function GigsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top + 10 }}>
        {/* Floating Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.tabBadge}>E-CLUBS</Text>
              <Text style={styles.title}>Gigs marketplace</Text>
            </View>
          </View>
        </View>

        {/* Cinematic Gigs Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={STEP}
          snapToAlignment="center"
          scrollEventThrottle={16}
          contentContainerStyle={styles.carouselContainer}
        >
          {MOCK_GIGS.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { paddingHorizontal: 20, marginBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  tabBadge: { fontSize: 8, fontWeight: '900', color: dash.purple, letterSpacing: 1.5, marginBottom: 0, textTransform: 'uppercase' },
  title: { fontSize: 34, fontWeight: '900', color: dash.text, letterSpacing: -1.5, textTransform: 'uppercase', fontStyle: 'italic' },
  subtitle: { fontSize: 13, color: dash.textSoft, fontWeight: '500', lineHeight: 18, paddingLeft: 2 },
  carouselContainer: { 
    paddingLeft: SIDE_PAD,
    paddingRight: SIDE_PAD,
    paddingTop: 10,
    paddingBottom: 60, // Added more bottom padding for the glass navigation
  },
  gigCard: { 
    width: CARD_W, 
    backgroundColor: '#fff', 
    borderRadius: 36, 
    padding: 24,
    marginRight: CARD_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  gigHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  gigTitle: { flex: 1, fontSize: 20, fontWeight: '900', color: '#111', lineHeight: 26, marginRight: 10 },
  statusBadge: { backgroundColor: '#F0E7FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: dash.purple, fontSize: 10, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaLabel: { fontSize: 11, color: '#666', fontWeight: '500' },
  metaValue: { fontSize: 11, color: '#111', fontWeight: '800' },
  metaValueClub: { fontSize: 11, color: dash.purple, fontWeight: '800' },
  budgetBox: { 
    flexDirection: 'row', 
    backgroundColor: '#F9FAFF', 
    borderRadius: 20, 
    padding: 16, 
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F0F2FF',
    alignItems: 'center',
  },
  budgetCol: { flex: 1 },
  dividerV: { width: 1, height: '80%', backgroundColor: '#E5E7EB', marginHorizontal: 12 },
  budgetLabel: { fontSize: 8, fontWeight: '900', color: '#B0B5C9', letterSpacing: 0.5, marginBottom: 4 },
  budgetValue: { fontSize: 18, fontWeight: '900', color: '#059669' },
  deadlineValue: { fontSize: 12, fontWeight: '900', color: '#111' },
  deadlineTime: { fontSize: 10, fontWeight: '700', color: '#888', marginTop: 1 },
  reqScroll: { marginTop: 16, flex: 1 },
  requirementsList: { gap: 8 },
  reqItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 99, 
    borderWidth: 1, 
    borderColor: '#F3F4F6',
    gap: 10,
    backgroundColor: '#fff',
  },
  reqDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: dash.purple },
  reqText: { flex: 1, fontSize: 11, fontWeight: '600', color: '#444' },
  moreBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    paddingVertical: 12,
    backgroundColor: 'rgba(107, 70, 193, 0.05)',
    borderRadius: 14,
    marginTop: 4
  },
  moreBtnText: { fontSize: 10, fontWeight: '900', color: dash.purple, letterSpacing: 0.5 },
  applyBtn: { 
    marginTop: 12, 
    height: 56, 
    backgroundColor: '#0F172A', 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8
  },
  applyBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});
