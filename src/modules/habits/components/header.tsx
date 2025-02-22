import { Ionicons } from '@expo/vector-icons';
import { addMonths, format, subMonths } from 'date-fns';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HabitHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAddHabit: () => void;
  onReset: () => void;
}

export default function HabitHeader(props: HabitHeaderProps) {
  const navigateMonth = (direction: 'prev' | 'next') => {
    props.onDateChange(
      direction === 'next'
        ? addMonths(props.currentDate, 1)
        : subMonths(props.currentDate, 1)
    );
  };

  return (
    <View style={styles.monthHeader}>
      <TouchableOpacity
        onPress={() => navigateMonth('prev')}
        style={styles.monthButton}
      >
        <Ionicons name="chevron-back" size={24} color="#666" />
      </TouchableOpacity>

      <Text style={styles.monthTitle}>
        {format(props.currentDate, 'MMMM yyyy')}
      </Text>

      <TouchableOpacity
        onPress={() => navigateMonth('next')}
        style={styles.monthButton}
      >
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>

      <Pressable onPress={props.onAddHabit} style={styles.addHabitButton}>
        <Text style={styles.addHabitText}>+</Text>
      </Pressable>

      <Pressable onPress={props.onReset} style={styles.addHabitButton}>
        <Text style={styles.addHabitText}>-</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  monthButton: {
    padding: 10,
  },
  monthTitle: {
    fontFamily: 'IndieFlower_400Regular',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    transform: [{ rotate: '-2deg' }],
  },
  addHabitButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginLeft: 8,
  },
  addHabitText: {
    fontSize: 24,
    color: '#666',
  },
});
