import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useScroll } from '@/context/ScrollContext';

const { width } = Dimensions.get('window');

export function GlassNavigation() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const { navigationVisible } = useScroll();

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const menuTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0],
  });

  const menuScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const menuOpacity = animation.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  const navTranslateY = navigationVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0],
  });

  const isActive = (route: string) => pathname?.includes(route);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY: navTranslateY }] }
      ]} 
      pointerEvents="box-none"
    >
      {/* Expanded Menu (Gigs, Explore, Clubs) */}
      <Animated.View
        style={[
          styles.expandedContainer,
          {
            transform: [{ translateY: menuTranslateY }, { scale: menuScale }],
            opacity: menuOpacity,
          },
        ]}
        pointerEvents={expanded ? 'auto' : 'none'}
      >
        <TouchableOpacity style={styles.subItem} onPress={() => { router.push('/(tabs)/gigs'); toggleMenu(); }}>
          <View style={styles.glassButtonSub}>
            <Ionicons name="briefcase-outline" size={20} color="#555" />
            <Text style={styles.subText}>Gigs</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subItem} onPress={() => { router.push('/(tabs)/explore'); toggleMenu(); }}>
          <View style={[styles.glassButtonSub, styles.centerSub]}>
            <Ionicons name="compass-outline" size={24} color="#222" />
            <Text style={styles.subText}>Explore</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subItem} onPress={() => { router.push('/(tabs)/projects'); toggleMenu(); }}>
          <View style={styles.glassButtonSub}>
            <Ionicons name="folder-outline" size={20} color="#555" />
            <Text style={styles.subText}>Projects</Text>
          </View>
        </TouchableOpacity>
        
        {/* Connector stem */}
        <View style={styles.stem} />
      </Animated.View>

      {/* Main Tab Bar */}
      <View style={styles.mainBarWrapper}>
        <View style={styles.glassContainer}>
          <View style={styles.mainBarContent}>
            <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/home')}>
              <Ionicons name={isActive('home') ? "home" : "home-outline"} size={22} color={isActive('home') ? "#000" : "#999"} />
              <Text style={[styles.tabLabel, isActive('home') && styles.activeLabel]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/clubs')}>
              <Ionicons name="people-outline" size={22} color={isActive('clubs') ? "#000" : "#999"} />
              <Text style={styles.tabLabel}>Clubs</Text>
            </TouchableOpacity>

            <View style={styles.centerSpace} />

            <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/notifications')}>
              <Ionicons name={isActive('notifications') ? "notifications" : "notifications-outline"} size={22} color={isActive('notifications') ? "#000" : "#999"} />
              <Text style={[styles.tabLabel, isActive('notifications') && styles.activeLabel]}>Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/profile')}>
              <Ionicons name={isActive('profile') ? "person" : "person-outline"} size={22} color={isActive('profile') ? "#000" : "#999"} />
              <Text style={[styles.tabLabel, isActive('profile') && styles.activeLabel]}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Toggle Button */}
        <TouchableOpacity style={styles.centerToggle} onPress={toggleMenu} activeOpacity={0.95}>
          <View style={styles.toggleInner}>
            <Ionicons name={expanded ? "close" : "menu"} size={28} color="#222" />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    zIndex: 999,
  },
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: -8,
    gap: 12,
    zIndex: 1,
  },
  subItem: {
    alignItems: 'center',
  },
  glassButtonSub: {
    width: (width - 100) / 3.4,
    aspectRatio: 1.15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  centerSub: {
    transform: [{ translateY: -15 }],
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.01)',
    width: (width - 100) / 3,
  },
  subText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#333',
    marginTop: 6,
  },
  stem: {
    position: 'absolute',
    bottom: -15,
    width: 2,
    height: 30,
    backgroundColor: '#fff',
    alignSelf: 'center',
    zIndex: -1,
    opacity: 0.8,
  },
  mainBarWrapper: {
    width: width - 40,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },
  glassContainer: {
    flex: 1,
  },
  mainBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#999',
    marginTop: 4,
  },
  activeLabel: {
    color: '#000',
  },
  centerSpace: {
    width: 60,
  },
  centerToggle: {
    position: 'absolute',
    top: -15,
    left: (width - 40) / 2 - 36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  toggleInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
