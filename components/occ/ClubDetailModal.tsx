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
import { useAuth, authHeaders, API_URL, resolveUrl } from '@/context/auth-context';
import { FeedPostCard } from '@/components/occ/FeedPostCard';

const dummySocialSeed = (entityId: string, salt: string) => {
  let h = 2166136261;
  const s = `${salt}:${entityId}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 1 + (Math.abs(h) % 799);
};

const displayClubMembers = (clubId: string, realMembers: number, storedBase?: number | null, slug?: string) => {
  // Website often uses slug for public seeds to remain consistent even if IDs rotate
  const seedKey = slug || clubId;
  const base = (storedBase != null && storedBase >= 100 && storedBase < 800)
    ? storedBase
    : dummySocialSeed(seedKey, "club-followers");
  return base + Math.max(0, realMembers);
};

const displayPostLikes = (postId: string, realLikes: number) => {
  return dummySocialSeed(postId, "post-likes") + Math.max(0, realLikes);
};

const { width, height } = Dimensions.get('window');

type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  coverImage?: string;
  eliteCount?: number;
  memberCount?: number;
  memberDisplayBase?: number | null;
  slug?: string;
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
  club: Club | null;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabKey>('FEED');
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  const [livePosts, setLivePosts] = React.useState<any[]>([]);
  const [liveEvents, setLiveEvents] = React.useState<any[]>([]);
  const [liveGigs, setLiveGigs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!visible || !club) return;
    
    const fetchClubData = async () => {
      setLoading(true);
      // Clear previous data while fetching new
      setLivePosts([]);
      setLiveEvents([]);
      setLiveGigs([]);
      
      try {
        const [postsRes, gigsRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}/api/posts?clubId=${club.id}`, { headers: authHeaders(token) }),
          fetch(`${API_URL}/api/gigs`, { headers: authHeaders(token) }),
          fetch(`${API_URL}/api/events`, { headers: authHeaders(token) })
        ]);

        if (postsRes.ok) {
          const d = await postsRes.json();
          // Filter by ID or Slug for fallback support
          const rawPosts = d.posts || [];
          const filteredPosts = rawPosts.filter((p: any) => 
            p.clubId === club.id || (p.club && p.club.slug === club.slug)
          );
          setLivePosts(filteredPosts.length > 0 ? filteredPosts : rawPosts.slice(0, 0)); // Keep empty if no match
        }
        if (gigsRes.ok) {
          const d = await gigsRes.json();
          setLiveGigs((d.gigs || []).filter((g: any) => 
            (club.id && g.clubId === club.id) || 
            (club.slug && g.club && g.club.slug === club.slug)
          ));
        }
        if (eventsRes.ok) {
          const d = await eventsRes.json();
          setLiveEvents((d.events || []).filter((e: any) => 
            (club.id && e.clubId === club.id) || 
            (e.club && club.slug && e.club.slug === club.slug)
          ));
        }
      } catch (e) {
        console.log('[ClubDetailModal] Fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, [visible, club?.id]);

  useEffect(() => {
    if (!visible) return;

    const handleHardwareBack = () => {
      onClose();
      return true;
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
             {livePosts.length > 0 ? livePosts.map((post) => (
                <FeedPostCard 
                  key={post.id} 
                  post={{
                    ...post,
                    likes: displayPostLikes(post.id, post.likesCount || 0),
                    comments: post.comments?.length || 0,
                    author: {
                      name: post.user?.fullName || 'Member',
                      avatarUrl: resolveUrl(post.user?.avatar) || 'https://i.pravatar.cc/100',
                      handle: club.slug || 'member',
                      verified: post.user?.role === 'CLUB_HEADER'
                    },
                    imageUrl: resolveUrl(post.imageUrl || (post.imageUrls && post.imageUrls[0])) || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1080&q=90'
                  }} 
                  width={width} 
                />
             )) : (
              <Text style={styles.emptyText}>No posts yet.</Text>
             )}
          </View>
        );
      case 'EVENTS':
        return (
          <View style={styles.tabPane}>
             {liveEvents.length > 0 ? liveEvents.map((ev) => (
               <EventCard key={ev.id} item={{
                  id: ev.id,
                  imageUrl: resolveUrl(ev.imageUrl) || resolveUrl(club.coverImage) || resolveUrl(club.image) || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                  day: ev.date ? new Date(ev.date).getDate() : '??',
                  month: ev.date ? new Date(ev.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '??',
                  category: club.name.toUpperCase(),
                  title: ev.title,
                  subtitle: ev.description || '',
                  location: ev.venue || 'CAMPUS',
                  time: ev.date ? new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '4:45 PM',
                  registered: false
               }} />
             )) : (
               <Text style={styles.emptyText}>No upcoming events found.</Text>
             )}
          </View>
        );
      case 'GIGS':
        return (
          <View style={styles.tabPane}>
             {liveGigs.length > 0 ? liveGigs.map((gig) => (
               <View key={gig.id} style={styles.gigCard}>
                  <View style={styles.gigCardHeader}>
                     <View style={styles.gigBadge}>
                        <Text style={styles.gigBadgeText}>{gig.category || 'GIG OPPORTUNITY'}</Text>
                     </View>
                     <Text style={styles.gigDeadline}>ENDS {gig.deadline ? new Date(gig.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase() : '01 MAY'}</Text>
                  </View>
                  
                  <Text style={styles.gigCardTitle}>{gig.title}</Text>
                  <Text style={styles.gigCardSub}>{gig.description}</Text>
                  
                  <View style={styles.gigFooter}>
                     <View>
                        <Text style={styles.gigPayLabel}>STIPEND / PAY</Text>
                        <Text style={styles.gigPayValue}>
                           {gig.payMin && gig.payMax 
                             ? `₹${gig.payMin.toLocaleString('en-IN')} - ₹${gig.payMax.toLocaleString('en-IN')}` 
                             : (gig.stipend || 'Competitive')}
                        </Text>
                     </View>
                     <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
                        <Text style={styles.applyBtnText}>APPLY NOW</Text>
                     </TouchableOpacity>
                  </View>
               </View>
             )) : (
              <Text style={styles.emptyText}>No active gigs for this club.</Text>
             )}
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
          <TouchableOpacity style={styles.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View style={styles.heroCardContainer}>
              <View style={styles.heroCard}>
                <View style={styles.officialHeader}>
                  <View style={styles.iconCircle}>
                     <Ionicons name="game-controller" size={14} color="#7C3AED" />
                  </View>
                  <Text style={styles.officialText}>OFFICIAL CLUB</Text>
                </View>

                <Text style={styles.clubTitle}>{club.name}</Text>
                
                <View>
                  <Text 
                    style={styles.clubDesc} 
                    numberOfLines={showFullDesc ? undefined : 2}
                  >
                    {club.description}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setShowFullDesc(!showFullDesc)}
                    style={styles.moreToggle}
                  >
                    <Text style={styles.moreToggleText}>{showFullDesc ? 'LESS' : 'MORE...'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

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
                       <Text style={styles.memberCountText}>
                         {displayClubMembers(club.id, club.memberCount || 0, club.memberDisplayBase, club.slug).toLocaleString('en-IN')} MEMBERS ACTIVE
                       </Text>
                    </View>

                   <TouchableOpacity style={styles.memberStatusBtn} activeOpacity={0.8}>
                      <Text style={styles.memberStatusText}>MEMBER </Text>
                      <Ionicons name="checkmark" size={12} color="#7C3AED" />
                   </TouchableOpacity>
                </View>

                <Text style={styles.bgTitleText} numberOfLines={1}>{club.name.split(' ')[0]} {"\n"} CLUB</Text>
              </View>
            </View>

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
    paddingTop: 60,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 24,
    paddingBottom: 20,
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
  backBtn: {
    position: 'absolute',
    top: 50,
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
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
    paddingVertical: 40,
    fontFamily: 'InterSemi',
  },
});
