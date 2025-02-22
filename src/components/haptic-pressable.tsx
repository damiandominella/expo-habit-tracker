import * as Haptics from 'expo-haptics';
import { Pressable, PressableProps } from 'react-native';

export function HapticPressable(props: PressableProps) {
  return (
    <Pressable
      {...props}
      onPressIn={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
    />
  );
}
