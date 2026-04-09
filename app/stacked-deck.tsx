import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.65;
const SWIPE_THRESHOLD = width * 0.3;

const DATA = [
  { id: 1, title: 'CHIRAIYA', subtitle: '2026 • 12 Languages • Drama', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', tag: 'New Release' },
  { id: 2, title: 'THE RUGGED PATH', subtitle: '2026 • Action • Adventure', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80', tag: 'Trending' },
  { id: 3, title: 'URBAN JUNGLE', subtitle: '2025 • Thriller • Mystery', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', tag: 'Exclusive' },
  { id: 4, title: 'NEON NIGHTS', subtitle: '2026 • Cyberpunk • Sci-Fi', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80', tag: 'Popular' },
];

const MovieCard = ({ item, index, activeIndex, totalItems, translateX }) => {
  const position = index - activeIndex;

  const animatedStyle = useAnimatedStyle(() => {
    // Current card swiping logic
    if (index === activeIndex) {
      const rotate = interpolate(translateX.value, [-width, 0, width], [-15, 0, 15]);
      return {
        transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }, { scale: 1 }],
        zIndex: totalItems,
        opacity: 1,
      };
    }

    // Behind cards logic
    const isNext = index > activeIndex;
    if (isNext && index <= activeIndex + 2) {
      const idx = index - activeIndex;
      const progress = interpolate(Math.abs(translateX.value), [0, width], [0, 1], Extrapolate.CLAMP);
      
      const scale = interpolate(idx - progress, [1, 2], [0.93, 0.86]);
      const translateY = interpolate(idx - progress, [1, 2], [20, 40]);
      const opacity = interpolate(idx - progress, [1, 2], [0.8, 0.4]);

      return {
        transform: [{ scale }, { translateY }],
        opacity,
        zIndex: totalItems - idx,
      };
    }

    return { opacity: 0, zIndex: 0 };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={{ borderRadius: 24 }}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient}>
          <View style={styles.badge}><Text style={styles.badgeText}>{item.tag.toUpperCase()}</Text></View>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <View style={styles.actionRow}>
              <View style={styles.glassBtn}><Ionicons name="add" size={24} color="#fff" /></View>
              <View style={[styles.glassBtn, { marginLeft: 12 }]}><Ionicons name="play" size={20} color="#fff" /></View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
};

export default function StackedCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => { translateX.value = e.translationX; })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const target = e.translationX > 0 ? width : -width;
        translateX.value = withSpring(target, {}, () => {
          runOnJS(setActiveIndex)((activeIndex + 1) % DATA.length);
          translateX.value = 0;
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={['#0F2027', '#203A43']} style={StyleSheet.absoluteFill} />
      <View style={styles.stackArea}>
        <GestureDetector gesture={gesture}>
          <View style={styles.gestureBox}>
            {DATA.map((item, index) => (
              <MovieCard key={item.id} item={item} index={index} activeIndex={activeIndex} totalItems={DATA.length} translateX={translateX} />
            ))}
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  stackArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gestureBox: { width: CARD_WIDTH, height: CARD_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  cardContainer: { width: CARD_WIDTH, height: CARD_HEIGHT, position: 'absolute', borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  cardImage: { flex: 1, overflow: 'hidden' },
  gradient: { flex: 1, padding: 24, justifyContent: 'space-between' },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  content: { paddingBottom: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontWeight: '600' },
  actionRow: { position: 'absolute', bottom: 0, right: 0, flexDirection: 'row' },
  glassBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
});
