import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import AddHabitDialog from './add-habit-dialog';

const MenuItem = ({
  icon,
  label,
  ...props
}: { icon: React.ReactNode; label: string } & Omit<
  TouchableOpacityProps,
  'children'
>) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-2"
      {...props}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="text-xl">{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsMenu(props: {
  onAddNewHabit: (name: string) => void;
  onEraseAllData: () => void;
}) {
  const [isAddHabitDialogVisible, setIsAddHabitDialogVisible] = useState(false);

  return (
    <View className="flex-1">
      <Text className="mb-2 text-base font-medium text-gray-500 uppercase">
        General
      </Text>
      <View className="rounded-2xl bg-white p-4 gap-2">
        <MenuItem
          icon={<Entypo name="add-to-list" size={24} color="#0069a8" />}
          label="Track new habit"
          onPress={() => setIsAddHabitDialogVisible(true)}
        />
        <View className="border-b border-gray-200" />
        <MenuItem
          onPress={() => props.onEraseAllData()}
          icon={<Entypo name="trash" size={24} color="#9f0712" />}
          label="Erase all data"
        />
        <View className="border-b border-gray-200" />

        <Text className="text-gray-500 text-base">
          The theme and background selected will be used to display the app
          symbols. Plus members can change the dots to other symbols as squares,
          stars, hearts and more.
        </Text>
      </View>

      <AddHabitDialog
        visible={isAddHabitDialogVisible}
        onClose={() => setIsAddHabitDialogVisible(false)}
        onAdd={props.onAddNewHabit}
      />
    </View>
  );
}
