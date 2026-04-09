import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 100;
const ITEM_SPACING = 20;

const DATA = [
  {
    id: '1',
    title: 'CHIRAIYA',
    subtitle: '2026 • Drama • Special',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    tag: 'NEW RELEASE',
  },
  {
    id: '2',
    title: 'THE RUGGED PATH',
    subtitle: '2026 • Action • Extreme',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
    tag: 'TRENDING',
  },
  {
    id: '3',
    title: 'URBAN JUNGLE',
    subtitle: '2025 • Mystery • Noir',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    tag: 'EXCLUSIVE',
  },
  {
    id: '4',
    title: 'NEON NIGHTS',
    subtitle: '2026 • Sci-Fi • Thriller',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80',
    tag: 'POPULAR',
  },
];

const MovieCard = ({ item, index, scrollX, totalItems }: any) => {
  const animatedCardStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    // 1. Scaling (Center focused)
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.85, 1, 0.85],
      Extrapolate.CLAMP
    );

    // 2. Opacity (Side cards dimmer)
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );

    // 3. Vertical push (Side cards move down)
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [15, 0, 15],
      Extrapolate.CLAMP
    );

    // 4. Dynamic Z-Index strategy for "Behind" feel
    const zIndex = Math.round(
      interpolate(scrollX.value, inputRange, [10, 100, 10], Extrapolate.CLAMP)
    );

    return {
      transform: [
        { scale },
        { translateY },
      ],
      opacity,
      zIndex,
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    // Parallax effect for the image inside the card
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-ITEM_WIDTH * 0.1, 0, ITEM_WIDTH * 0.1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
      <View style={styles.imageClip}>
        <Animated.Image
          source={{ uri: item.image }}
          style={[styles.cardImage, animatedImageStyle]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          {/* Tag */}
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <View style={styles.circleBtn}>
                <Ionicons name="add" size={24} color="#fff" />
              </View>
              <View style={[styles.circleBtn, { marginLeft: 12 }]}>
                <Ionicons name="play" size={20} color="#fff" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default function HorizontalSnapper() {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    // Normalizing scroll offset to match card index progress
    scrollX.value = event.contentOffset.x * (ITEM_WIDTH / (ITEM_WIDTH));
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F2027', '#203A43']} style={StyleSheet.absoluteFill} />

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        {DATA.map((item, index) => (
          <MovieCard key={item.id} item={item} index={index} scrollX={scrollX} totalItems={DATA.length} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cardContainer: {
    width: ITEM_WIDTH,
    height: width * 1.1,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    marginHorizontal: 0,
  },
  imageClip: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 28,
  },
  cardImage: {
    width: ITEM_WIDTH * 1.3, // Oversized for parallax
    height: '100%',
    position: 'absolute',
    left: -ITEM_WIDTH * 0.15,
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bottomInfo: {
    paddingBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  actionRow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});
