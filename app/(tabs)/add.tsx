import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import { dash } from '@/constants/occ-dashboard-theme';

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!image) {
      Alert.alert('Missing Photo', 'Please select an image first.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success!', 'Your post has been shared.', [
        { text: 'OK', onPress: () => router.push('/(tabs)/home') },
      ]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color={dash.text} />
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <Pressable 
          onPress={handlePost} 
          disabled={loading || !image}
          style={[styles.postButton, (!image || loading) && { opacity: 0.5 }]}
        >
          <Text style={styles.postButtonText}>{loading ? '...' : 'Share'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholder}>
              <View style={styles.iconCircle}>
                <Ionicons name="camera" size={32} color={dash.purple} />
              </View>
              <Text style={styles.placeholderText}>Tap to add a photo</Text>
              <Text style={styles.placeholderSubText}>Share your moments with the club</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.captionContainer}>
          <TextInput
            placeholder="Write a caption..."
            placeholderTextColor={dash.textSoft}
            multiline
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />
        </View>

        <View style={styles.optionsList}>
          <View style={styles.optionItem}>
            <Ionicons name="location-outline" size={20} color={dash.text} />
            <Text style={styles.optionLabel}>Add Location</Text>
            <Ionicons name="chevron-forward" size={18} color={dash.textSoft} />
          </View>
          <View style={styles.optionItem}>
            <Ionicons name="people-outline" size={20} color={dash.text} />
            <Text style={styles.optionLabel}>Tag People</Text>
            <Ionicons name="chevron-forward" size={18} color={dash.textSoft} />
          </View>
          <View style={[styles.optionItem, { borderBottomWidth: 0 }]}>
            <Ionicons name="megaphone-outline" size={20} color={dash.text} />
            <Text style={styles.optionLabel}>Share to Cluster</Text>
            <Ionicons name="chevron-forward" size={18} color={dash.textSoft} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: dash.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: dash.surface,
    borderBottomWidth: 1,
    borderBottomColor: dash.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: dash.text,
  },
  closeBtn: {
    padding: 4,
  },
  postButton: {
    backgroundColor: dash.purple,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: dash.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: dash.purpleSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: dash.text,
  },
  placeholderSubText: {
    fontSize: 14,
    color: dash.textMuted,
  },
  captionContainer: {
    backgroundColor: dash.surface,
    padding: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: dash.border,
  },
  input: {
    fontSize: 16,
    color: dash.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsList: {
    backgroundColor: dash.surface,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: dash.border,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: dash.border,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: dash.text,
  },
});
