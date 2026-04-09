import React from 'react';
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
  const [activeTab, setActiveTab] = React.useState<TabKey>('FEED');

  if (!club) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'FEED':
        return (
          <View style={styles.tabPane}>
             {/* SYNCED WITH HOME DISCOVERY FEED */}
             {MOCK_FEED_POSTS.slice(0, 2).map((post) => (
                <FeedPostCard 
                  key={post.id} 
                  post={post} 
                  width={width} 
                />
             ))}
          </View>
        );
      case 'EVENTS':
        return (
          <View style={styles.tabPane}>
             <View style={styles.eventItem}>
                <View style={styles.eventDate}>
                  <Text style={styles.dateDay}>12</Text>
                  <Text style={styles.dateMonth}>OCT</Text>
                </View>
                <View style={styles.eventInfo}>
                   <Text style={styles.eventTitle}>BGMI Open Qualifier</Text>
                   <Text style={styles.eventSub}>Gaming Arena • 7:00 PM</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={{ marginLeft: 'auto' }} />
             </View>

             <View style={styles.eventItem}>
                <View style={[styles.eventDate, { backgroundColor: '#FFEDD5' }]}>
                  <Text style={[styles.dateDay, { color: '#F97316' }]}>15</Text>
                  <Text style={[styles.dateMonth, { color: '#F97316' }]}>OCT</Text>
                </View>
                <View style={styles.eventInfo}>
                   <Text style={styles.eventTitle}>PC Modding Workshop</Text>
                   <Text style={styles.eventSub}>Tech Lab B4 • 4:00 PM</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={{ marginLeft: 'auto' }} />
             </View>
          </View>
        );
      case 'GIGS':
        return (
          <View style={styles.tabPane}>
             <View style={styles.gigItem}>
                <View style={styles.gigHighlight} />
                <View>
                  <Text style={styles.gigTitle}>Tournament Organizer</Text>
                  <Text style={styles.gigPay}>₹2,500/Day • URGENT</Text>
                  <Text style={styles.gigSub}>Join our production team for the upcoming esports fest. Manage brackets or stream setup.</Text>
                </View>
             </View>

             <View style={styles.gigItem}>
                <View style={styles.gigHighlight} />
                <View>
                   <Text style={styles.gigTitle}>Content Mod (Discord)</Text>
                   <Text style={styles.gigPay}>EQUITY / PERKS</Text>
                   <Text style={styles.gigSub}>Help us scale the largest gaming community on campus. Looking for experienced mods.</Text>
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

                {/* Description */}
                <Text style={styles.clubDesc}>
                  {club.description} प्रोवाइडिंग मेंबर्स विथ ऑपच्र्युनिटीज टो कॉम्पीटे, शोकेस देर स्किल्स, एंड कनेक्ट विथ फेलो गेमर्स. BGMI E-FOOTBALL Free-Fire
                </Text>

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
                <Text style={styles.bgTitleText} numberOfLines={1}>GAMING {"\n"} CLUB</Text>
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

          {/* Close Handle / Overlay Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  sheet: {
    marginTop: height * 0.08,
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  heroCardContainer: {
    padding: 20,
    paddingTop: 30,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 24,
    minHeight: 320,
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
    maxWidth: '85%',
    marginBottom: 20,
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
    padding: 20,
    gap: 16,
  },
  richPostCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  postUserName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
  },
  postMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  postImageContainer: {
    width: '100%',
    height: 200,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postContent: {
    padding: 16,
    paddingBottom: 12,
  },
  postText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    gap: 20,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  eventDate: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: { fontSize: 18, fontWeight: '900', color: '#7C3AED' },
  dateMonth: { fontSize: 10, fontWeight: '900', color: '#7C3AED', opacity: 0.6 },
  eventInfo: { gap: 2 },
  eventTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  eventSub: { fontSize: 12, color: '#64748B' },
  
  gigItem: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  gigHighlight: {
    width: 4,
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  gigTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B' },
  gigPay: { fontSize: 13, color: '#7C3AED', fontWeight: '900', marginTop: 2 },
  gigSub: { fontSize: 13, color: '#64748B', lineHeight: 18, marginTop: 6, maxWidth: '95%' },

  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
