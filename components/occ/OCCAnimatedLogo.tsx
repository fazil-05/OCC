import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Words according to user sketch: "OFF", "CAMPUS", "CLUBS"
const WORDS = [
  { prefix: 'O', suffix: 'FF' },
  { prefix: 'C', suffix: 'AMPUS' },
  { prefix: 'C', suffix: 'LUBS' },
];

export function OCCAnimatedLogo() {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // Words list according to user instructions
  const WORD_LIST = ["OFF", "CAMPUS", "CLUBS"];

  useEffect(() => {
    let isMounted = true;

    const runInfiniteReel = () => {
      if (!isMounted) return;

      // 1. Initial State: scrollAnim = 0 (Showing first word)
      Animated.sequence([
        Animated.delay(1800), // Hold view (Faster)

        // 2. Smoothly scroll to next word (1)
        Animated.timing(scrollAnim, {
          toValue: 1,
          duration: 750, // More snappy and fast
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.delay(1800),

        // 3. Smoothly scroll to next word (2)
        Animated.timing(scrollAnim, {
          toValue: 2,
          duration: 750,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.delay(1800),

        // 4. Smoothly scroll to a 'clone' of first word (3) for seamless loop
        Animated.timing(scrollAnim, {
          toValue: 3,
          duration: 750,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        })
      ]).start(() => {
        if (!isMounted) return;

        // 5. Instantly jump back to true 0 without animation
        scrollAnim.setValue(0);
        runInfiniteReel();
      });
    };

    runInfiniteReel();
    return () => { isMounted = false; };
  }, []);

  const translateY = scrollAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, -50, -100, -150], // Consistent vertical steps
  });

  return (
    <View style={styles.container}>
      <View style={styles.reelViewport}>
        <Animated.View style={{ transform: [{ translateY }] }}>
          {/* Main List */}
          {WORD_LIST.map((word, i) => {
            const itemPos = i; 
            const scale = scrollAnim.interpolate({
              inputRange: [itemPos - 1, itemPos, itemPos + 1],
              outputRange: [0.75, 1, 0.75],
              extrapolate: 'clamp',
            });
            const itemOpacity = scrollAnim.interpolate({
              inputRange: [itemPos - 0.5, itemPos, itemPos + 0.5],
              outputRange: [0.2, 1, 0.2],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View key={i} style={[styles.wordItem, { transform: [{ scale }], opacity: itemOpacity }]}>
                <Text style={styles.brandText}>
                  <Text style={styles.initialAccent}>{word[0]}</Text>
                  {word.slice(1)}
                </Text>
              </Animated.View>
            );
          })}
          
          {/* Looping clone */}
          {(() => {
            const itemPos = 3; 
            const scale = scrollAnim.interpolate({
              inputRange: [itemPos - 1, itemPos, itemPos + 1],
              outputRange: [0.75, 1, 0.75],
              extrapolate: 'clamp',
            });
            const itemOpacity = scrollAnim.interpolate({
              inputRange: [itemPos - 0.5, itemPos, itemPos + 0.5],
              outputRange: [0.2, 1, 0.2],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View style={[styles.wordItem, { transform: [{ scale }], opacity: itemOpacity }]}>
                <Text style={styles.brandText}>
                  <Text style={styles.initialAccent}>{WORD_LIST[0][0]}</Text>
                  {WORD_LIST[0].slice(1)}
                </Text>
              </Animated.View>
            );
          })()}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    paddingLeft: 4,
    overflow: 'hidden', 
  },
  reelViewport: {
    height: 50,
    width: 200, 
    overflow: 'hidden',
  },
  wordItem: {
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  brandText: {
    fontSize: 27, // Slightly smaller to accommodate scale jump
    fontWeight: '900',
    color: '#000',
    letterSpacing: -1.2,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  initialAccent: {
    color: '#7C3AED', 
  },
});
