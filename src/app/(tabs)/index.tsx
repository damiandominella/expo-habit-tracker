import { HapticPressable } from '@/src/components/haptic-pressable';
import AddHabitDialog from '@/src/modules/habits/components/add-habit-dialog';
import HabitHeader from '@/src/modules/habits/components/header';
import { INITIAL_HABITS } from '@/src/modules/habits/config';
import { Habit } from '@/src/modules/habits/types';
import { Entypo } from '@expo/vector-icons';
import { getDaysInMonth } from 'date-fns';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const getMonthKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
};

export default function HabitTracker() {
  const [cellHeight, setCellHeight] = useState<number>(40);
  const [cellWidth, setCellWidth] = useState<number>(80);

  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddHabitDialogVisible, setIsAddHabitDialogVisible] = useState(false);

  // Add refs for synchronized scrolling
  const daysScrollViewRef = useRef<ScrollView>(null);
  const numbersScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  const handleScroll = (event: any) => {
    // Sync the other ScrollView to the current scroll position
    const y = event.nativeEvent.contentOffset.y;
    numbersScrollViewRef.current?.scrollTo({ y, animated: false });
    daysScrollViewRef.current?.scrollTo({ y, animated: false });
  };

  const loadHabits = async () => {
    // try {
    //   const savedHabits = await AsyncStorage.getItem('habits');
    //   if (savedHabits) {
    //     const parsedHabits = JSON.parse(savedHabits);
    //     // Ensure each habit has trackedByMonth structure
    //     const migratedHabits = parsedHabits.map((habit: Habit) => {
    //       if (!habit.trackedByMonth) {
    //         const currentMonthKey = getMonthKey(new Date());
    //         return {
    //           ...habit,
    //           trackedByMonth: {
    //             [currentMonthKey]: new Array(31).fill(false),
    //           },
    //         };
    //       }
    //       return habit;
    //     });
    //     setHabits(migratedHabits);
    //   }
    // } catch (error) {
    //   console.error('Error loading habits:', error);
    // }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      // await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const clearHabits = async () => {
    try {
      // await AsyncStorage.removeItem('habits');
      setHabits(INITIAL_HABITS);
    } catch (error) {
      console.error('Error clearing habits:', error);
    }
  };

  const toggleHabit = (habitId: number, day: number) => {
    const monthKey = getMonthKey(currentDate);

    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const monthData =
          habit.trackedByMonth[monthKey] || new Array(31).fill(false);
        const updatedMonthData = [...monthData];
        updatedMonthData[day - 1] = !updatedMonthData[day - 1];

        return {
          ...habit,
          trackedByMonth: {
            ...habit.trackedByMonth,
            [monthKey]: updatedMonthData,
          },
        };
      }
      return habit;
    });

    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const addNewHabit = (habitName: string) => {
    const monthKey = getMonthKey(currentDate);
    const newHabit: Habit = {
      id: habits.length + 1,
      name: habitName,
      trackedByMonth: {
        [monthKey]: new Array(31).fill(false),
      },
      dateCreated: new Date(),
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const renderDayRow = (day: number) => {
    const monthKey = getMonthKey(currentDate);
    return (
      <View key={day} style={{ ...styles.dayRow, height: cellHeight }}>
        {habits.map((habit) => {
          const monthData =
            habit.trackedByMonth[monthKey] || new Array(31).fill(false);
          return (
            <HapticPressable
              key={`${habit.id}-${day}`}
              style={[
                styles.habitCell,
                { height: cellHeight, width: cellWidth },
              ]}
              onPress={() => {
                toggleHabit(habit.id, day);
                if (process.env.EXPO_OS === 'ios') {
                  // Add a soft haptic feedback when pressing down on the tabs.
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              {monthData[day - 1] && (
                <Text style={styles.habitMark}>
                  <Entypo name="check" size={24} />
                </Text>
              )}
            </HapticPressable>
          );
        })}
      </View>
    );
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    return Array.from({ length: daysInMonth }, (_, i) => renderDayRow(i + 1));
  };

  const renderDayNumbers = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    return Array.from({ length: daysInMonth }, (_, i) => (
      <View key={i} style={[styles.dayNumberRow, { height: cellHeight }]}>
        <Text style={styles.dayText}>{i + 1}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HabitHeader
          currentDate={currentDate}
          onReset={clearHabits}
          onDateChange={setCurrentDate}
        />

        <AddHabitDialog
          visible={isAddHabitDialogVisible}
          onClose={() => setIsAddHabitDialogVisible(false)}
          onAdd={addNewHabit}
        />

        <View style={styles.contentContainer}>
          {/* Fixed day number column with vertical scroll */}
          <View style={styles.dayNumberColumn}>
            <View style={styles.dayNumberHeader} />
            <ScrollView
              ref={numbersScrollViewRef}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            >
              {renderDayNumbers()}
            </ScrollView>
          </View>

          {/* Scrollable habits area */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.habitGrid}>
              <View style={styles.headerRow}>
                {habits.map((habit) => (
                  <View
                    key={habit.id}
                    style={[styles.habitHeaderContainer, { width: cellWidth }]}
                  >
                    <Text style={styles.habitHeader}>{habit.name}</Text>
                  </View>
                ))}

                <View
                  style={[styles.habitHeaderContainer, { width: cellWidth }]}
                >
                  <HapticPressable
                    onPress={() => setIsAddHabitDialogVisible(true)}
                  >
                    <Text style={styles.habitHeader}>Create new</Text>
                  </HapticPressable>
                </View>
              </View>
              <ScrollView
                ref={daysScrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.daysContainer}>{renderDays()}</View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    // marginBottom: 80,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    padding: 0,
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
    backgroundColor: '#FFFAF0',
  },
  habitGrid: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'flex-end',
    height: 80,
  },
  habitHeaderContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  habitHeader: {
    fontFamily: 'semibold',
    fontSize: 16,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'column',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dayText: {
    fontFamily: 'regular',
    fontSize: 18,
  },
  habitCell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  habitMark: {
    fontFamily: 'regular',
    fontSize: 24,
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  dayNumberColumn: {
    width: 40,
    backgroundColor: '#FFFAF0',
    zIndex: 2,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  dayNumberHeader: {
    height: 80, // Match the height of habit headers
  },
  dayNumberRow: {
    justifyContent: 'center',
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
