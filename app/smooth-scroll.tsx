import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');
const ITEM_SIZE = height * 0.72; // Tall cinematic cards
const ITEM_SPACING = (height - ITEM_SIZE) / 2;

const DATA = [
  {
    id: '1',
    title: 'THE RUGGED PATH',
    subtitle: 'Adventure awaits in the hills',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    tag: 'NEW RELEASE',
  },
  {
    id: '2',
    title: 'URBAN JUNGLE',
    subtitle: 'Finding peace in the chaos',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
    tag: 'SPECIAL',
  },
  {
    id: '3',
    title: 'SILENT WATERS',
    subtitle: 'Reflections of the deep blue',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    tag: 'EXCLUSIVE',
  },
  {
    id: '4',
    title: 'NEON NIGHTS',
    subtitle: 'Cyberpunk energy after dark',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80',
    tag: 'PREMIUM',
  },
];

export default function SmoothScrollingCards() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        style={StyleSheet.absoluteFill}
      />

      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: ITEM_SPACING,
          paddingHorizontal: 20,
        }}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];

          // 1. Scale Animation (Center Card pop)
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.85, 1.05, 0.85],
            extrapolate: 'clamp',
          });

          // 2. Fade Animation
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          // 3. Parallax Effect for Image
          const translateY = scrollY.interpolate({
            inputRange,
            outputRange: [ITEM_SIZE / 3, 0, -ITEM_SIZE / 3],
            extrapolate: 'clamp',
          });

          // 4. Slight Tilt/Rotation Effect
          const rotateY = scrollY.interpolate({
            inputRange,
            outputRange: ['15deg', '0deg', '-15deg'],
            extrapolate: 'clamp',
          });

          return (
            <View style={{ height: ITEM_SIZE, justifyContent: 'center' }}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    opacity,
                    transform: [
                      { perspective: 1000 },
                      { scale },
                      { rotateY }
                    ],
                  },
                ]}
              >
                {/* Image Container with Parallax clipping */}
                <View style={styles.imageContainer}>
                  <Animated.Image
                    source={{ uri: item.image }}
                    style={[
                      styles.cardImage,
                      {
                        transform: [{ translateY }],
                      },
                    ]}
                  />
                  
                  {/* Glass Top Badge */}
                  <View style={styles.badge}>
                    <Ionicons name="flash" size={12} color="#fff" />
                    <Text style={styles.badgeText}>{item.tag}</Text>
                  </View>

                  {/* Bottom Text Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.textOverlay}
                  >
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                    
                    {/* Interaction Buttons like the reference image */}
                    <View style={styles.interactionRow}>
                        <View style={styles.glassButton}><Ionicons name="add" size={24} color="#fff" /></View>
                        <View style={[styles.glassButton, { marginLeft: 12 }]}><Ionicons name="play" size={20} color="#fff" /></View>
                    </View>
                  </LinearGradient>
                </View>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  card: {
    height: ITEM_SIZE * 0.9,
    borderRadius: 32,
    backgroundColor: '#1c1c1c',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2, // Taller image for parallax
    position: 'absolute',
    top: -ITEM_SIZE * 0.15,
  },
  badge: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  textOverlay: {
    padding: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  interactionRow: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  glassButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
