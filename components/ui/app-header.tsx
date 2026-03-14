import { Text, View } from "react-native";

export default function AppHeader() {
  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-1 bg-white">
      <View>
        <Text className="text-base font-extrabold text-gray-900">
          Hustle Tracker
        </Text>
        <Text className="text-xs text-gray-400">
          Gestão de Estoque Físico e Digital
        </Text>
      </View>
    </View>
  );
}
