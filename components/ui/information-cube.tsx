import { ComponentProps } from "react";
import { Text, View } from "react-native";
import { IconSymbol } from "./icon-symbol";

type CardVariant = "indigo" | "green";

interface InformationCubeProps {
  title: string;
  value: number;
  information: string; // ex: "+12%"
  iconName: ComponentProps<typeof IconSymbol>["name"];
  variant?: CardVariant;
  className?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export default function InformationCube({
  title,
  value,
  information,
  iconName,
  variant = "indigo",
  className = "",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
}: InformationCubeProps) {
  const isGreen = variant === "green";
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

  return (
    <View
      className={`w-full rounded-xl p-3 shadow-sm ${
        isGreen ? "bg-emerald-500" : "bg-indigo-600"
      } ${className}`}
    >
      <View className="flex-row items-center gap-2">
        <IconSymbol
          name={iconName}
          size={16}
          color={isGreen ? "#a7f3d0" : "#c7d2fe"}
        />
        <Text
          className={`uppercase tracking-[1.2px] text-xs font-semibold ${
            isGreen ? "text-emerald-100" : "text-indigo-100"
          }`}
        >
          {title}
        </Text>
      </View>

      <Text className="mt-2 text-white text-[2rem] font-extrabold">
        {formattedValue}
      </Text>

      <View
        className={`mt-2.5 self-start rounded-full px-2.5 py-1 ${
          isGreen ? "bg-emerald-400/70" : "bg-indigo-500/70"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            isGreen ? "text-emerald-50" : "text-indigo-100"
          }`}
        >
          {information}
        </Text>
      </View>
    </View>
  );
}
