import { ProductCategory } from "@/types/product";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

interface CategoryToggleProps {
  value: ProductCategory;
  onChange: (v: ProductCategory) => void;
}

export default function CategoryToggle({
  value,
  onChange,
}: CategoryToggleProps) {
  return (
    <View className="flex-row gap-3">
      <TouchableOpacity
        onPress={() => onChange("fisico")}
        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-2xl border-2 ${
          value === "fisico"
            ? "bg-indigo-50 border-indigo-500"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <MaterialIcons
          name="inventory-2"
          size={18}
          color={value === "fisico" ? "#6366f1" : "#9ca3af"}
        />
        <Text
          className={`font-semibold text-sm ${
            value === "fisico" ? "text-indigo-600" : "text-gray-400"
          }`}
        >
          Físico
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange("digital")}
        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-2xl border-2 ${
          value === "digital"
            ? "bg-indigo-50 border-indigo-500"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <MaterialIcons
          name="smartphone"
          size={18}
          color={value === "digital" ? "#6366f1" : "#9ca3af"}
        />
        <Text
          className={`font-semibold text-sm ${
            value === "digital" ? "text-indigo-600" : "text-gray-400"
          }`}
        >
          Digital
        </Text>
      </TouchableOpacity>
    </View>
  );
}
