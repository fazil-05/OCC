import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { dash } from '@/constants/occ-dashboard-theme';

const { width, height } = Dimensions.get('window');

type Club = {
  id: string;
  name: string;
  memberCount: number;
  avatarUrl: string;
  verified?: boolean;
};

type Props = {
  categoryName: string;
  visible: boolean;
  onClose: () => void;
  clubs: Club[];
};

export function CategoryClubsModal({ categoryName, visible, onClose, clubs }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragNotch} />
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>{categoryName} Clubs</Text>
                <Text style={styles.headerSub}>Find your perfect community</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={22} color={dash.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Row */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={dash.textMuted} />
            <TextInput
              placeholder={`Search in ${categoryName}...`}
              placeholderTextColor={dash.textMuted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Club List */}
          <ScrollView
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <View key={club.id} style={styles.clubCard}>
                  <View style={styles.cardImageContainer}>
                    <Image source={{ uri: club.avatarUrl }} style={styles.cardCover} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.85)']}
                      style={styles.cardOverlay}
                    />
                    
                    <View style={styles.cardContent}>
                      <View>
                        <View style={styles.nameRow}>
                          <Text style={styles.clubNameOnCard}>{club.name}</Text>
                          {club.verified && (
                            <Ionicons name="checkmark-circle" size={14} color="#3B82F6" style={{ marginLeft: 6 }} />
                          )}
                        </View>
                        <Text style={styles.memberTextOnCard}>
                          <Ionicons name="people" size={12} color="rgba(255,255,255,0.8)" /> {club.memberCount.toLocaleString()} MEMBERS
                        </Text>
                      </View>
                      
                      <TouchableOpacity style={styles.joinBtnCard}>
                        <Text style={styles.joinTextCard}>JOIN</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.empty}>
                <Ionicons name="people-outline" size={48} color={dash.border} />
                <Text style={styles.emptyText}>No clubs found matching "{searchQuery}"</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.createBtn}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.createText}>CREATE NEW CLUB</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' },
  sheet: {
    height: '94%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: { padding: 20, paddingBottom: 10, alignItems: 'center' },
  dragNotch: { width: 40, height: 4, borderRadius: 2, backgroundColor: dash.border, marginBottom: 16 },
  headerRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: dash.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: dash.textSoft, fontWeight: '600', marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#F9FAFB',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInput: { flex: 1, fontSize: 14, color: dash.text, fontWeight: '600' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 140 },
  clubCard: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  cardImageContainer: { width: '100%', height: 180, position: 'relative' },
  cardCover: { width: '100%', height: '100%' },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  clubNameOnCard: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  memberTextOnCard: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.7)', marginTop: 4, letterSpacing: 0.8 },
  joinBtnCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  joinTextCard: { fontSize: 13, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: dash.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  createBtn: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  createText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
});
