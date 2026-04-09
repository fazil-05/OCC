import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  height?: number;
  accentColor?: string;
  style?: ViewStyle;
};

/** Animated “avatar” hero — gradient orb + motion (no Three.js → no EXGL / Clock noise in Metro). */
export function OccAvatar3D({ height = 200, accentColor = '#a78bfa', style }: Props) {
  const rot = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rot.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1,
      false,
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [rot, pulse]);

  const motion = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }, { scale: pulse.value }],
  }));

  const orbSize = Math.min(160, Math.max(120, height * 0.72));

  return (
    <View style={[styles.wrap, { height }, style]}>
      <Animated.View style={[styles.orbWrap, motion]}>
        <LinearGradient
          colors={[accentColor, '#22d3ee', accentColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.orb, { width: orbSize, height: orbSize, borderRadius: orbSize / 2 }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    opacity: 0.95,
  },
});
