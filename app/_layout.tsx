import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  /*const [fontsLoaded] = useFonts({
    'Caveat': 'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9SIc.ttf',
    'Caveat-Bold': 'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjRV6SIc.ttf',
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        // Hide the splash screen after the fonts have loaded and the UI is ready
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }*/

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
