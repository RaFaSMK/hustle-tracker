import { Product } from "@/types/product";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface StockItemProps {
  product: Product;
  usdRate?: number | null;
  onDelete?: (product: Product) => void;
  onToggleSold?: (product: Product) => void;
  disabled?: boolean;
  showDetails?: boolean;
}

export default function StockItem({
  product,
  usdRate,
  onDelete,
  onToggleSold,
  disabled = false,
  showDetails = false,
}: StockItemProps) {
  const isDigital = product.category === "digital";
  const isUsdProduct = isDigital && product.currency === "USD";
  const isSold = product.status === "vendido";
  const multiplier = isDigital && usdRate ? usdRate : 1;

  const displaySalePrice = product.salePrice * multiplier;
  const displayCostPrice = product.costPrice * multiplier;
  const unitProfit = displaySalePrice - displayCostPrice;
  const totalProfit = unitProfit * product.quantity;
  const margin = displaySalePrice
    ? Math.max(0, (unitProfit / displaySalePrice) * 100)
    : 0;

  function formatDisplayValue(sourceValue: number, convertedValue: number) {
    if (!isUsdProduct) {
      return brl.format(convertedValue);
    }

    if (!usdRate) {
      return usd.format(sourceValue);
    }

    return `${brl.format(convertedValue)} / ${usd.format(sourceValue)}`;
  }

  return (
    <View className="py-3 border-b border-gray-100 gap-2">
      <View className="flex-row items-center gap-3">
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            isDigital ? "bg-indigo-50" : "bg-slate-100"
          }`}
        >
          <MaterialIcons
            name={isDigital ? "smartphone" : "inventory-2"}
            size={20}
            color={isDigital ? "#6366f1" : "#64748b"}
          />
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-sm">
            {product.name}
          </Text>
          <Text
            className={`text-xs font-medium mt-0.5 ${
              isDigital ? "text-indigo-500" : "text-slate-400"
            }`}
          >
            {product.tag}
          </Text>
        </View>

        <View className="items-end gap-1">
          <Text className="text-emerald-600 font-bold text-sm">
            {formatDisplayValue(product.salePrice, displaySalePrice)}
          </Text>
          {isSold ? (
            <Text className="text-xs text-rose-400 font-medium">Vendido</Text>
          ) : isUsdProduct ? (
            <Text className="text-xs text-slate-400">USD Convertido</Text>
          ) : (
            <Text className="text-xs text-emerald-500 font-medium">
              Em estoque
            </Text>
          )}
        </View>
      </View>

      {showDetails ? (
        <View className="rounded-2xl bg-slate-50 px-3 py-2.5 gap-1.5">
          <View className="flex-row justify-between">
            <Text className="text-[11px] text-slate-500">Custo un.</Text>
            <Text className="text-[11px] font-semibold text-slate-700">
              {formatDisplayValue(product.costPrice, displayCostPrice)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[11px] text-slate-500">Venda un.</Text>
            <Text className="text-[11px] font-semibold text-slate-700">
              {formatDisplayValue(product.salePrice, displaySalePrice)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[11px] text-slate-500">Quantidade</Text>
            <Text className="text-[11px] font-semibold text-slate-700">
              {product.quantity}
            </Text>
          </View>
          <View className="h-px bg-slate-200 my-1" />
          <View className="flex-row justify-between">
            <Text className="text-[11px] text-slate-500">Lucro total</Text>
            <Text className="text-[11px] font-bold text-emerald-600">
              {brl.format(totalProfit)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[11px] text-slate-500">Margem</Text>
            <Text className="text-[11px] font-bold text-indigo-600">
              {margin.toFixed(1)}%
            </Text>
          </View>
        </View>
      ) : null}

      {(onToggleSold || onDelete) && (
        <View className="flex-row justify-end gap-2">
          {onToggleSold ? (
            <TouchableOpacity
              disabled={disabled}
              onPress={() => onToggleSold(product)}
              className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
                isSold ? "bg-slate-100" : "bg-emerald-50"
              } ${disabled ? "opacity-50" : "opacity-100"}`}
            >
              <MaterialIcons
                name={isSold ? "replay" : "check-circle-outline"}
                size={14}
                color={isSold ? "#64748b" : "#10b981"}
              />
              <Text
                className={`text-xs font-semibold ${
                  isSold ? "text-slate-500" : "text-emerald-600"
                }`}
              >
                {isSold ? "Reabrir" : "Vender"}
              </Text>
            </TouchableOpacity>
          ) : null}

          {onDelete ? (
            <TouchableOpacity
              disabled={disabled}
              onPress={() => onDelete(product)}
              className={`flex-row items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 ${
                disabled ? "opacity-50" : "opacity-100"
              }`}
            >
              <MaterialIcons name="delete-outline" size={14} color="#f43f5e" />
              <Text className="text-xs font-semibold text-rose-500">
                Excluir
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
      {disabled ? (
        <Text className="text-[11px] text-slate-400 text-right">
          Atualizando item...
        </Text>
      ) : null}
    </View>
  );
}
