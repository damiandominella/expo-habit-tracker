import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HoldMenuProvider } from 'react-native-hold-menu';
import './../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#ddd' }}>
      <HoldMenuProvider
        theme="light"
        safeAreaInsets={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
          <StatusBar style="auto" />
        </View>
      </HoldMenuProvider>
    </GestureHandlerRootView>
  );
}
