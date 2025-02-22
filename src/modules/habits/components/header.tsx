import { HapticPressable } from '@/src/components/haptic-pressable';
import { Ionicons } from '@expo/vector-icons';
import { addMonths, format, subMonths } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HabitHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSettingsOpened: () => void;
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
    <View className="flex items-center justify-between flex-row">
      <View className="flex items-center justify-between flex-row gap-8">
        <HapticPressable
          onPress={() => navigateMonth('prev')}
          style={styles.monthButton}
        >
          <Ionicons name="chevron-back" size={24} color="#666" />
        </HapticPressable>

        <Text className="font-bold text-center text-xl">
          {format(props.currentDate, 'MMMM yyyy')}
        </Text>

        <HapticPressable
          onPress={() => navigateMonth('next')}
          style={styles.monthButton}
        >
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </HapticPressable>
      </View>

      <HapticPressable
        onPress={props.onSettingsOpened}
        style={styles.addHabitButton}
      >
        <Text style={styles.addHabitText}>-</Text>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  monthButton: {
    padding: 10,
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
