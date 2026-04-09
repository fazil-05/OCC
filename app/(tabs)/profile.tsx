import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { OccScreenScaffold } from '@/components/occ/OccScreenScaffold';
import { useAuth } from '@/context/auth-context';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user: authUser, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: 'FAZIL',
    college: 'UNKNOWN COLLEGE',
    joinedDate: '4/4/2026',
    email: 'fazil80883@gmail.com',
    phone: '6586023109',
    bio: '',
    profilePicture: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&q=80',
  });

  const stats = [
    { label: 'CLUBS', value: '4' },
    { label: 'EVENTS', value: '1' },
    { label: 'GIGS', value: '1' },
  ];

  const clusters = [
    {
      id: '1',
      name: 'BIKERS',
      label: '10 ELITE',
      desc: 'Weekend rides, bike checks, mountain roads.',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'
    },
    {
      id: '2',
      name: 'MUSIC',
      label: '8 ELITE',
      desc: 'Open mics, studio sessions, collabs.',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80'
    },
  ];

  const handlePickProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setForm(prev => ({ ...prev, profilePicture: result.assets[0].uri }));
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive', onPress: async () => {
          await signOut();
          router.replace('/login');
        }
      },
    ]);
  };

  return (
    <OccScreenScaffold title="Profile">

      <View style={styles.mainGrid}>

        {/* 1. UNIFIED IDENTITY HUB (One Card) */}
        <View style={styles.identitySection}>
          <Text style={styles.sectionOverline}>IDENTITY MANAGEMENT</Text>

          <View style={styles.unifiedHeaderRow}>
            <View style={styles.userInfoSide}>
              <Image source={{ uri: form.profilePicture }} style={styles.topAvatar} />
              <View style={styles.userMeta}>
                <Text style={styles.userName}>{form.name}</Text>
                <Text style={styles.userCollege}>{form.college}</Text>
                <Text style={styles.userJoined}>Joined {form.joinedDate}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.headerEditBtn}
              onPress={() => setIsEditing(true)}
            >
              <Feather name="edit-3" size={14} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {/* Integrated Statistics Row */}
          <View style={styles.managedStatsRowUnified}>
            {stats.map((s, idx) => (
              <View key={idx} style={styles.statBoxUnified}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 12, opacity: 0.2 }} />

          {/* Identity Details Display Block */}
          <View style={[styles.detailsForm, { paddingTop: 0 }]}>

            {/* Poised BIO Card */}
            <View style={[styles.readOnlyRow, { marginBottom: 8 }]}>
              <Text style={styles.readOnlyLabel}>BIO</Text>
              <Text style={[styles.displayValue, styles.displayBio]}>
                {form.bio || "Tell your community what you're into."}
              </Text>
            </View>

            {/* Account (Read-Only) card stays for technical parity */}
            <View style={styles.readOnlyRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.readOnlyLabel}>ACCOUNT (READ-ONLY)</Text>
                <View style={styles.readOnlyInner}>
                  <View style={styles.readOnlyField}>
                    <Feather name="mail" size={12} color="#94A3B8" />
                    <Text style={styles.readOnlyValue}>{form.email}</Text>
                  </View>
                  <View style={styles.readOnlyField}>
                    <Feather name="phone" size={12} color="#94A3B8" />
                    <Text style={styles.readOnlyValue}>{form.phone}</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Feather name="log-out" size={14} color="#EF4444" />
              <Text style={styles.logoutBtnText}>LOGOUT HUB PROFILE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. MY CLUSTERS SECTION */}
        <View style={styles.clustersSection}>
          <Text style={styles.sectionOverline}>MY CLUSTERS</Text>
          <View style={styles.clustersScroll}>
            {clusters.map((cluster) => (
              <View key={cluster.id} style={styles.clusterCard}>
                <Image source={{ uri: cluster.image }} style={styles.clusterImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.clusterOverlay}
                >
                  <View style={styles.clusterTopRow}>
                    <View style={styles.eliteBadge}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.eliteText}>{cluster.label}</Text>
                    </View>
                  </View>
                  <View style={styles.clusterBottomInfo}>
                    <Text style={styles.clusterName}>{cluster.name}</Text>
                    <Text style={styles.clusterDesc}>{cluster.desc}</Text>
                    <TouchableOpacity style={styles.diveInBtn}>
                      <Text style={styles.diveInText}>DIVE IN</Text>
                      <Ionicons name="chevron-forward" size={12} color="#000" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

      </View>

      {/* Footer Info */}
      <View style={{ alignItems: 'center', marginTop: 40, paddingBottom: 20, opacity: 0.5 }}>
        <Text style={{ fontFamily: 'InterBold', fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>OCC HUB SECURITY VERIFIED PROFILE</Text>
      </View>

      {/* Edit Modal - Bottom Sheet Architecture */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>EDIT IDENTITY</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={28} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>

              {/* Photo Management within Modal */}
              <View style={styles.photoManagement}>
                <Image source={{ uri: form.profilePicture }} style={styles.midAvatar} />
                <View style={styles.photoActions}>
                  <Text style={styles.photoLabel}>PROFILE PHOTO</Text>
                  <View style={styles.photoBtnRow}>
                    <TouchableOpacity style={styles.uploadBtn} onPress={handlePickProfilePicture}>
                      <Feather name="upload-cloud" size={14} color="#000" />
                      <Text style={styles.uploadBtnText}>Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeBtn}>
                      <Text style={styles.removeBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text style={styles.inputLabel}>FULL HUB NAME</Text>
              <TextInput
                style={styles.textInput}
                value={form.name}
                onChangeText={v => setForm(p => ({ ...p, name: v }))}
              />

              <Text style={styles.inputLabel}>COLLEGE NAME</Text>
              <TextInput
                style={styles.textInput}
                value={form.college}
                onChangeText={v => setForm(p => ({ ...p, college: v }))}
              />

              <Text style={styles.inputLabel}>HUB BIO</Text>
              <TextInput
                style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
                multiline
                placeholder="Tell your community what you're into."
                value={form.bio}
                onChangeText={v => setForm(p => ({ ...p, bio: v }))}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={() => setIsEditing(false)}>
                <Text style={styles.saveBtnText}>SAVE HUB PROFILE</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </OccScreenScaffold>
  );
}

const styles = StyleSheet.create({
  userInfoSide: {
    flex: 3, // MAXIMUM PRIORITY
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topAvatar: {
    width: 84,
    height: 84,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
  },
  userMeta: {
    flex: 1,
    minWidth: 100, // ANCHOR TEXT
  },
  headerEditBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  userName: {
    fontFamily: 'ArchivoHeavyItalic',
    fontSize: 18,
    color: '#0F172A',
  },
  userCollege: {
    fontFamily: 'InterBold',
    fontSize: 9,
    color: '#7C3AED',
    textTransform: 'uppercase',
  },
  userJoined: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: '#94A3B8',
  },
  statsSide: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  statBox: {
    width: 44,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statLabel: {
    fontFamily: 'InterBold',
    fontSize: 7,
    color: '#94A3B8',
    marginBottom: 1,
  },
  statValue: {
    fontFamily: 'MontBlack',
    fontSize: 14,
    color: '#0F172A',
  },
  mainGrid: {
    flexDirection: 'column',
    gap: 24,
  },
  identitySection: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
  },
  unifiedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionOverline: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: '#7C3AED',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionMainTitle: {
    fontFamily: 'ArchivoHeavyItalic',
    fontSize: 28,
    color: '#0F172A',
    marginBottom: 24,
  },
  unifiedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  managedStatsRowUnified: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  statBoxUnified: {
    flex: 1,
    height: 54,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  photoManagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  midAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoActions: {
    flex: 1,
  },
  photoLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: '#7C3AED',
    letterSpacing: 1,
    marginBottom: 4,
  },
  photoHint: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 12,
  },
  photoBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  uploadBtnText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: '#0F172A',
  },
  removeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  removeBtnText: {
    fontFamily: 'InterSemi',
    fontSize: 11,
    color: '#94A3B8',
  },
  detailsForm: {
    gap: 16,
  },
  readOnlyRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  readOnlyLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    color: '#7C3AED',
    letterSpacing: 1,
    marginBottom: 12,
  },
  readOnlyInner: {
    flexDirection: 'column',
    gap: 12,
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readOnlyValue: {
    fontFamily: 'InterSemi',
    fontSize: 13,
    color: '#1E293B',
  },
  inputLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 8,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: 'InterSemi',
    fontSize: 15,
    color: '#1E293B',
  },
  textArea: {
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  displayValue: {
    fontFamily: 'InterSemi',
    fontSize: 15,
    color: '#0F172A',
  },
  displayBio: {
    marginTop: 8,
    lineHeight: 22,
    color: '#64748B',
  },
  managedEditToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#7C3AED',
    height: 54,
    borderRadius: 12,
    marginTop: 24,
  },
  saveChangesText: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: '#FFF',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    height: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalHeaderTitle: {
    fontFamily: 'ArchivoHeavyItalic',
    fontSize: 24,
    color: '#0F172A',
    letterSpacing: -1,
  },
  modalForm: {
    paddingBottom: 40,
    gap: 16,
  },
  saveBtn: {
    height: 56,
    backgroundColor: '#7C3AED', // Brand Green
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: '#FFF',
    letterSpacing: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
  },
  logoutBtnText: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  clustersSection: {
    gap: 16,
  },
  clustersScroll: {
    gap: 16,
  },
  clusterCard: {
    height: 280,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  clusterImage: {
    width: '100%',
    height: '100%',
  },
  clusterOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    justifyContent: 'space-between',
  },
  clusterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eliteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
  eliteText: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: '#FFF',
    letterSpacing: 1,
  },
  clusterBottomInfo: {
    gap: 4,
  },
  clusterName: {
    fontFamily: 'ArchivoHeavyItalic',
    fontSize: 32,
    color: '#FFF',
    letterSpacing: -0.5,
  },
  clusterDesc: {
    fontFamily: 'InterMedium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  diveInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  diveInText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: '#000',
  },
});
