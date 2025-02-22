import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

const SCREEN_WIDTH = Dimensions.get('window').width;
const HIGHLIGHTS_WIDTH = 250;

export default function HighlightsSidebar(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const highlightsPosition = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    highlightsPosition.value = withSpring(
      props.isOpen ? SCREEN_WIDTH - HIGHLIGHTS_WIDTH : SCREEN_WIDTH,
      {
        damping: 15,
        stiffness: 90,
      }
    );
  }, [props.isOpen]);

  const highlightsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: highlightsPosition.value }],
    };
  });

  return (
    <AnimatedView style={[styles.highlightsPanel, highlightsStyle]}>
      <Text style={styles.highlightsTitle}>highlights</Text>
      <Text style={styles.highlightsContent}>
        Add your monthly highlights and notes here...
      </Text>
      <TouchableOpacity onPress={props.onClose} style={styles.highlightsButton}>
        <Ionicons
          name={props.isOpen ? 'chevron-forward' : 'chevron-back'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  highlightsButton: {
    padding: 10,
    marginLeft: 10,
  },
  highlightsPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: HIGHLIGHTS_WIDTH,
    backgroundColor: '#FFFAF0',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    padding: 20,
    paddingTop: 80,
    zIndex: 20,
  },
  highlightsTitle: {
    fontFamily: 'Caveat-Bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#666',
    transform: [{ rotate: '-2deg' }],
  },
  highlightsContent: {
    fontFamily: 'Caveat',
    fontSize: 18,
    color: '#666',
    transform: [{ rotate: '-1deg' }],
  },
});
