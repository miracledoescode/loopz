import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface AppBackgroundProps {
  children?: React.ReactNode;
  opacity?: number;
}

export function AppBackground({ children, opacity = 0.12 }: AppBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Ambient Textured Background Image with Tint & Opacity Layer */}
      <Image
        source={require('../assets/background.jpg')}
        style={[styles.backgroundImage, { opacity }]}
        resizeMode="cover"
      />
      {/* Dark Blend Overlay */}
      <View style={styles.overlay} />
      
      {/* Content Container */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 21, 25, 0.78)',
  },
});
