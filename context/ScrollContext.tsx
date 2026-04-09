import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Animated } from 'react-native';

interface ScrollContextType {
  navigationVisible: Animated.Value;
  handleScroll: (event: any) => void;
  handleScrollEnd: () => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const navigationVisible = useRef(new Animated.Value(1)).current;
  const isNavVisible = useRef(true);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);

  const hideNavigation = () => {
    if (!isNavVisible.current) return;
    isNavVisible.current = false;
    
    Animated.spring(navigationVisible, {
      toValue: 0,
      stiffness: 180,
      damping: 24,
      mass: 0.6,
      useNativeDriver: true,
    }).start();
  };

  const showNavigation = () => {
    if (isNavVisible.current) return;
    isNavVisible.current = true;

    Animated.spring(navigationVisible, {
      toValue: 1,
      stiffness: 180,
      damping: 24,
      mass: 0.6,
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    
    // Increase threshold to 15 to ignore jitters and simplify scroll-fast logic
    if (Math.abs(currentY - lastScrollY.current) > 15) {
      if (currentY > lastScrollY.current && currentY > 60) {
        // Scrolling Down - Hide
        hideNavigation();
      }
    }
    
    lastScrollY.current = currentY;
    isScrolling.current = true;
  };

  const handleScrollEnd = () => {
    isScrolling.current = false;
    showNavigation();
  };

  return (
    <ScrollContext.Provider value={{ navigationVisible, handleScroll, handleScrollEnd }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}
