import { HapticPressable } from '@/src/components/haptic-pressable';
import { Entypo } from '@expo/vector-icons';
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
    <View className="flex items-center justify-between flex-row px-4">
      <View className="flex items-center justify-between flex-row gap-8">
        <HapticPressable
          onPress={() => navigateMonth('prev')}
          style={styles.monthButton}
        >
          <Entypo name="chevron-left" size={24} color="#666" />
        </HapticPressable>

        <Text className="font-bold text-center text-xl">
          {format(props.currentDate, 'MMMM yyyy')}
        </Text>

        <HapticPressable
          onPress={() => navigateMonth('next')}
          style={styles.monthButton}
        >
          <Entypo name="chevron-right" size={24} color="#666" />
        </HapticPressable>
      </View>

      <HapticPressable
        onPress={props.onSettingsOpened}
        className="flex items-center justify-center"
      >
        <Entypo name="cog" size={24} color="#666" />
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  monthButton: {
    padding: 10,
  },
});
