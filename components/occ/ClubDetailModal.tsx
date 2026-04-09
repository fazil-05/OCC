import React, { useEffect } from 'react';
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
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedPostCard } from '@/components/occ/FeedPostCard';
import { MOCK_FEED_POSTS } from '@/constants/occ-mock-feed';

const { width, height } = Dimensions.get('window');

type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  eliteCount: number;
};

type TabKey = 'FEED' | 'EVENTS' | 'GIGS';

function EventCard({ item }: { item: any }) {
  const [isRegistered, setIsRegistered] = React.useState(item.registered || false);

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventImgWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.eventImg} contentFit="cover" />
        <View style={styles.eventDateBadge}>
           <Text style={styles.eventDay}>{item.day}</Text>
           <Text style={styles.eventMonth}>{item.month}</Text>
        </View>
      </View>
      
      <View style={styles.eventBody}>
         <View style={styles.eventCatBadge}>
           <Text style={styles.eventCatText}>{item.category}</Text>
         </View>
         <Text style={styles.eventTitleText}>{item.title}</Text>
         <Text style={styles.eventSubText}>{item.subtitle}</Text>
         
         <View style={styles.eventInfoRow}>
            <View style={styles.eventPill}>
              <Ionicons name="location" size={12} color="#7C3AED" />
              <Text style={styles.eventPillText}>{item.location}</Text>
            </View>
            <View style={styles.eventPill}>
              <Ionicons name="calendar" size={12} color="#7C3AED" />
              <Text style={styles.eventPillText}>{item.time}</Text>
            </View>
         </View>

         <View style={styles.eventFooterRow}>
            <View>
               <Text style={styles.feeLabel}>ENTRY FEE</Text>
               <Text style={styles.feeValue}>₹0</Text>
            </View>
            <TouchableOpacity 
              style={[styles.regBtn, isRegistered && styles.regBtnActive]}
              onPress={() => setIsRegistered(!isRegistered)}
              activeOpacity={0.8}
            >
               <Text style={[styles.regBtnText, isRegistered && styles.regBtnTextActive]}>
                 {isRegistered ? 'REGISTERED ✓' : 'REGISTER →'}
               </Text>
            </TouchableOpacity>
         </View>
      </View>
    </View>
  );
}

export function ClubDetailModal({
  club,
  visible,
  onClose,
}: {
  club: any | null;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState<TabKey>('FEED');
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  useEffect(() => {
    if (!visible) return;

    const handleHardwareBack = () => {
      onClose();
      return true; // CONSUME THE EVENT
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleHardwareBack
    );

    return () => {
      backHandlerSubscription.remove();
    };
  }, [visible, onClose]);

  if (!club) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'FEED':
        return (
          <View style={styles.tabPane}>
             {/* DYNAMIC CLUB-SPECIFIC POSTS */}
             {MOCK_FEED_POSTS.slice(0, 3).map((post, idx) => (
                <FeedPostCard 
                  key={`${club.id}-${idx}`} 
                  post={{
                    ...post,
                    author: {
                      name: club.name,
                      handle: club.name.toLowerCase().replace(/\s/g, '_'),
                      avatarUrl: club.image,
                      verified: true
                    },
                    imageUrl: [
                      club.image,
                      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
                    ][idx % 3]
                  }} 
                  width={width} 
                />
             ))}
          </View>
        );
      case 'EVENTS':
        return (
          <View style={styles.tabPane}>
             <EventCard item={{
                id: 'e1',
                imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                day: '12',
                month: 'APR',
                category: 'GAMING',
                title: 'BGMI Mega Tournament 2026',
                subtitle: 'Join us for the ultimate campus showdown.',
                location: 'MAIN AUDITORIUM',
                time: '4:45 PM',
                registered: true
             }} />
             <EventCard item={{
                id: 'e2',
                imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
                day: '19',
                month: 'APR',
                category: 'TECH',
                title: 'AI Workshop & Lan Party',
                subtitle: 'Deep dive into LLMs and network with mods.',
                location: 'LAB B4 HALL',
                time: '10:00 AM',
                registered: false
             }} />
          </View>
        );
      case 'GIGS':
        return (
          <View style={styles.tabPane}>
             <View style={styles.gigCard}>
                <View style={styles.gigCardHeader}>
                   <View style={styles.gigBadge}>
                      <Text style={styles.gigBadgeText}>GIG OPPORTUNITY</Text>
                   </View>
                   <Text style={styles.gigDeadline}>ENDS 01 MAY</Text>
                </View>
                
                <Text style={styles.gigCardTitle}>Opportunity for {club.name} Content Creators</Text>
                <Text style={styles.gigCardSub}>Love creating reels or aesthetic content? Join our production team and grow your audience with us.</Text>
                
                <View style={styles.gigFooter}>
                   <View>
                      <Text style={styles.gigPayLabel}>STIPEND / PAY</Text>
                      <Text style={styles.gigPayValue}>₹2,500 - ₹5,000</Text>
                   </View>
                   <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
                      <Text style={styles.applyBtnText}>APPLY NOW</Text>
                   </TouchableOpacity>
                </View>
             </View>

             <View style={styles.gigCard}>
                <View style={styles.gigCardHeader}>
                   <View style={[styles.gigBadge, { backgroundColor: '#FFEDD5'}]}>
                      <Text style={[styles.gigBadgeText, { color: '#F97316' }]}>URGENT HIRING</Text>
                   </View>
                   <Text style={styles.gigDeadline}>ENDS 28 APR</Text>
                </View>
                
                <Text style={styles.gigCardTitle}>Event Coordinator & Ops</Text>
                <Text style={styles.gigCardSub}>Help us manage the upcoming mega showcase. Experience in crowd control or stage ops preferred.</Text>
                
                <View style={styles.gigFooter}>
                   <View>
                      <Text style={styles.gigPayLabel}>STIPEND / PAY</Text>
                      <Text style={styles.gigPayValue}>₹8,000 - ₹12,000</Text>
                   </View>
                   <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
                      <Text style={styles.applyBtnText}>APPLY NOW</Text>
                   </TouchableOpacity>
                </View>
             </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.modalBg}>
        <View style={styles.sheet}>
          {/* BACK ACTION ON LEFT */}
          <TouchableOpacity style={styles.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {/* BRANDED HERO CARD SECTION */}
            <View style={styles.heroCardContainer}>
              <View style={styles.heroCard}>
                {/* Official Tag */}
                <View style={styles.officialHeader}>
                  <View style={styles.iconCircle}>
                     <Ionicons name="game-controller" size={14} color="#7C3AED" />
                  </View>
                  <Text style={styles.officialText}>OFFICIAL CLUB</Text>
                </View>

                {/* Title */}
                <Text style={styles.clubTitle}>{club.name}</Text>
                
                {/* Expandable Description */}
                <View>
                  <Text 
                    style={styles.clubDesc} 
                    numberOfLines={showFullDesc ? undefined : 2}
                  >
                    {club.description} प्रोवाइडिंग मेंबर्स विथ ऑपच्र्युनिटीज टो कॉम्पीटे, शोकेस देर स्किल्स, एंड कनेक्ट विथ फेलो गेमर्स. BGMI E-FOOTBALL Free-Fire {club.description}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setShowFullDesc(!showFullDesc)}
                    style={styles.moreToggle}
                  >
                    <Text style={styles.moreToggleText}>{showFullDesc ? 'LESS' : 'MORE...'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                {/* Status Row */}
                <View style={styles.statusRow}>
                   <View style={styles.membersRow}>
                      <View style={styles.avatarStack}>
                         {[1,2,3].map((i) => (
                           <View key={i} style={[styles.miniAvatar, { marginLeft: i === 1 ? 0 : -8 }]}>
                             <Image 
                               source={{ uri: `https://i.pravatar.cc/100?u=${i + club.id}` }} 
                               style={styles.avatarImg} 
                             />
                           </View>
                         ))}
                      </View>
                      <Text style={styles.memberCountText}>{club.eliteCount * 42} MEMBERS ACTIVE</Text>
                   </View>

                   <TouchableOpacity style={styles.memberStatusBtn} activeOpacity={0.8}>
                      <Text style={styles.memberStatusText}>MEMBER </Text>
                      <Ionicons name="checkmark" size={12} color="#7C3AED" />
                   </TouchableOpacity>
                </View>

                {/* Decoration background title */}
                <Text style={styles.bgTitleText} numberOfLines={1}>{club.name.split(' ')[0]} {"\n"} CLUB</Text>
              </View>
            </View>

            {/* TAB SYSTEM */}
            <View style={styles.tabBar}>
               {(['FEED', 'EVENTS', 'GIGS'] as TabKey[]).map((tab) => (
                 <TouchableOpacity 
                   key={tab} 
                   style={styles.tabItem} 
                   onPress={() => setActiveTab(tab)}
                 >
                   <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                   {activeTab === tab && <View style={styles.tabIndicator} />}
                 </TouchableOpacity>
               ))}
            </View>

            {/* TAB CONTENT */}
            {renderTabContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: '#FFF' },
  sheet: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroCardContainer: {
    padding: 20,
    paddingTop: 60, // Account for full-page header info
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 24,
    paddingBottom: 20, // Tighter finish
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  officialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  officialText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 2,
  },
  clubTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -2,
    lineHeight: 52,
    marginBottom: 14,
  },
  clubDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    maxWidth: '90%',
  },
  moreToggle: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  moreToggleText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  memberCountText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  memberStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  memberStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  bgTitleText: {
    position: 'absolute',
    right: -40,
    top: 40,
    fontSize: 140,
    fontWeight: '900',
    color: '#F1F5F9',
    opacity: 0.4,
    zIndex: -1,
    textTransform: 'uppercase',
  },
  
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 10,
  },
  tabItem: {
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.2,
  },
  tabTextActive: {
    color: '#7C3AED',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  
  tabPane: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 20,
  },
  
  // High-Fidelity Event Card
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  eventImgWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  eventImg: {
    width: '100%',
    height: '100%',
  },
  eventDateBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDay: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  eventMonth: { fontSize: 10, fontWeight: '900', color: '#64748B' },
  
  eventBody: {
    padding: 20,
  },
  eventCatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  eventCatText: { fontSize: 10, fontWeight: '900', color: '#7C3AED', letterSpacing: 0.5 },
  eventTitleText: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  eventSubText: { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  
  eventInfoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  eventPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  eventPillText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  
  eventFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  feeLabel: { fontSize: 9, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  feeValue: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  regBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  regBtnActive: {
    backgroundColor: '#EDE9FE',
  },
  regBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  regBtnTextActive: { color: '#7C3AED' },
  
  gigCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  gigCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gigBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
  },
  gigBadgeText: { fontSize: 10, fontWeight: '900', color: '#7C3AED', letterSpacing: 0.5 },
  gigDeadline: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.5 },
  gigCardTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 8 },
  gigCardSub: { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 20 },
  gigFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  gigPayLabel: { fontSize: 9, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  gigPayValue: { fontSize: 16, fontWeight: '900', color: '#7C3AED' },
  applyBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  applyBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  
  // Related Content Styles
  relatedSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1.5,
    marginBottom: 16,
    opacity: 0.8,
  },
  relatedScroll: {
    gap: 12,
  },
  relatedCard: {
    width: 140,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  relatedImg: {
    width: '100%',
    height: '100%',
  },
  relatedGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  relatedName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  
  momentsSection: {
    marginBottom: 30,
  },
  momentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  momentImg: {
    width: (width - 50) / 2,
    height: (width - 50) / 2,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },

  backBtn: {
    position: 'absolute',
    top: 50, // Safe area top
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 100,
  },
});
