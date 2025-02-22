import { Entypo } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

const MenuItem = (props: { icon: React.ReactNode; label: string }) => {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center gap-3">
        {props.icon}
        <Text className="text-xl">{props.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsMenu() {
  return (
    <View className="flex-1">
      {/* Display Section */}
      <Text className="mt-2 mb-2 text-base font-medium text-gray-500 uppercase">
        General
      </Text>
      <View className="rounded-2xl bg-white p-4 gap-2">
        <MenuItem
          icon={<Entypo name="add-to-list" size={24} color="purple" />}
          label="Track new habit"
        />
        <View className="border-b border-gray-200" />
        <MenuItem
          icon={<Entypo name="cog" size={24} color="purple" />}
          label="Settings"
        />
        <View className="border-b border-gray-200" />

        <Text className="text-gray-500 text-base">
          The theme and background selected will be used to display the app
          symbols. Plus members can change the dots to other symbols as squares,
          stars, hearts and more.
        </Text>
      </View>
    </View>
  );
}
