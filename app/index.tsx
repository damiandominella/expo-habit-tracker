import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, format, getDaysInMonth, subMonths } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
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

interface Habit {
  id: number;
  name: string;
  tracked: boolean[];
  dateCreated: Date;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

const SCREEN_WIDTH = Dimensions.get('window').width;
const HIGHLIGHTS_WIDTH = 250;

const INITIAL_HABITS: Habit[] = [
  {
    id: 1,
    name: 'habit 1',
    tracked: new Array(31).fill(false),
    dateCreated: new Date(),
  },
  {
    id: 2,
    name: 'habit 2',
    tracked: new Array(31).fill(false),
    dateCreated: new Date(),
  },
  {
    id: 3,
    name: 'habit 3',
    tracked: new Array(31).fill(false),
    dateCreated: new Date(),
  },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isHighlightsOpen, setIsHighlightsOpen] = useState(false);
  const scale = useSharedValue(1);
  const highlightsPosition = useSharedValue(SCREEN_WIDTH);

  // Add refs for synchronized scrolling
  const daysScrollViewRef = useRef<ScrollView>(null);
  const numbersScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    highlightsPosition.value = withSpring(
      isHighlightsOpen ? SCREEN_WIDTH - HIGHLIGHTS_WIDTH : SCREEN_WIDTH,
      {
        damping: 15,
        stiffness: 90,
      }
    );
  }, [isHighlightsOpen]);

  const handleScroll = (event: any) => {
    // Sync the other ScrollView to the current scroll position
    const y = event.nativeEvent.contentOffset.y;
    numbersScrollViewRef.current?.scrollTo({ y, animated: false });
    daysScrollViewRef.current?.scrollTo({ y, animated: false });
  };

  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('habits');
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const toggleHabit = (habitId: number, day: number) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedTracked = [...habit.tracked];
        updatedTracked[day - 1] = !updatedTracked[day - 1];
        return { ...habit, tracked: updatedTracked };
      }
      return habit;
    });
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const addNewHabit = () => {
    const newHabit: Habit = {
      id: habits.length + 1,
      name: `habit ${habits.length + 1}`,
      tracked: new Array(31).fill(false),
      dateCreated: new Date(),
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((current) =>
      direction === 'next' ? addMonths(current, 1) : subMonths(current, 1)
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const highlightsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: highlightsPosition.value }],
    };
  });

  const renderDayRow = (day: number) => {
    return (
      <View key={day} style={styles.dayRow}>
        {habits.map((habit) => (
          <AnimatedTouchable
            key={`${habit.id}-${day}`}
            style={[styles.habitCell, animatedStyle]}
            onPress={() => toggleHabit(habit.id, day)}
          >
            {habit.tracked[day - 1] && <Text style={styles.habitMark}>✗</Text>}
          </AnimatedTouchable>
        ))}
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
      <View key={i} style={styles.dayNumberRow}>
        <Text style={styles.dayText}>{i + 1}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() => navigateMonth('prev')}
            style={styles.monthButton}
          >
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>
            {format(currentDate, 'MMMM yyyy')}
          </Text>

          <TouchableOpacity
            onPress={() => navigateMonth('next')}
            style={styles.monthButton}
          >
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsHighlightsOpen(!isHighlightsOpen)}
            style={styles.highlightsButton}
          >
            <Ionicons name={'pencil'} size={24} color="#666" />
          </TouchableOpacity>

          <Pressable onPress={addNewHabit} style={styles.addHabitButton}>
            <Text style={styles.addHabitText}>+</Text>
          </Pressable>
        </View>

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
                  <View key={habit.id} style={styles.habitHeaderContainer}>
                    <Text style={styles.habitHeader}>
                      {habit.name.split('').join('\n')}
                    </Text>
                  </View>
                ))}
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

        <AnimatedView style={[styles.highlightsPanel, highlightsStyle]}>
          <Text style={styles.highlightsTitle}>highlights</Text>
          <Text style={styles.highlightsContent}>
            Add your monthly highlights and notes here...
          </Text>
          <TouchableOpacity
            onPress={() => setIsHighlightsOpen(false)}
            style={styles.highlightsButton}
          >
            <Ionicons
              name={isHighlightsOpen ? 'chevron-forward' : 'chevron-back'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </AnimatedView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    padding: 0,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  monthButton: {
    padding: 10,
  },
  monthTitle: {
    fontFamily: 'Caveat-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    transform: [{ rotate: '-2deg' }],
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
    backgroundColor: '#FFFAF0',
  },
  highlightsButton: {
    padding: 10,
    marginLeft: 10,
  },
  habitGrid: {
    flexDirection: 'column',
    paddingLeft: 8,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    alignItems: 'flex-end',
    height: 120,
  },
  dayNumberCell: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  habitHeaderContainer: {
    width: 40,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  habitHeader: {
    fontFamily: 'Caveat',
    fontSize: 16,
    textAlign: 'center',
    height: 120,
    transform: [{ rotate: '-2deg' }],
  },
  daysScrollView: {
    // flexGrow: 0,
  },
  daysContainer: {
    flexDirection: 'column',
  },
  dayRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dayText: {
    fontFamily: 'Caveat',
    fontSize: 18,
  },
  habitCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  habitMark: {
    fontFamily: 'Caveat-Bold',
    fontSize: 24,
    color: '#333',
    transform: [{ rotate: '-15deg' }],
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
    height: 120, // Match the height of habit headers
  },
  dayNumberRow: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
