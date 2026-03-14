import AppHeader from "@/components/ui/app-header";
import InformationCube from "@/components/ui/information-cube";
import StockItem from "@/components/ui/stock-item";
import { useProducts } from "@/hooks/use-products";
import { useUsdRate } from "@/hooks/use-usd-rate";
import { deleteProduct, updateProductStatus } from "@/services/firestore";
import { Product } from "@/types/product";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

export default function Stock() {
  const router = useRouter();
  const { rate, loading: usdRateLoading } = useUsdRate();
  const { products, loading, error } = useProducts();
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { totalStock, totalProfit } = useMemo(() => {
    let stock = 0;
    let profit = 0;
    for (const p of products) {
      const multiplier = p.currency === "USD" && rate ? rate : 1;
      if (p.status === "em_estoque") {
        stock += p.salePrice * multiplier * p.quantity;
      }
      profit += (p.salePrice - p.costPrice) * multiplier * p.quantity;
    }
    return { totalStock: stock, totalProfit: profit };
  }, [products, rate]);

  const recentItems = products.slice(0, 4);

  async function handleDelete(product: Product) {
    try {
      setPendingProductId(product.id);
      setActionError(null);
      await deleteProduct(product.id);
    } catch {
      setActionError("Nao foi possivel excluir o item.");
    } finally {
      setPendingProductId(null);
    }
  }

  async function handleToggleSold(product: Product) {
    const nextStatus = product.status === "vendido" ? "em_estoque" : "vendido";

    try {
      setPendingProductId(product.id);
      setActionError(null);
      await updateProductStatus(product.id, nextStatus);
    } catch {
      setActionError("Nao foi possivel atualizar o status do item.");
    } finally {
      setPendingProductId(null);
    }
  }

  const chartData = useMemo(() => {
    const weekdayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
    const weekdayValues = [0, 0, 0, 0, 0, 0, 0];

    for (const product of products) {
      const date = new Date(product.createdAt);
      const weekday = date.getDay();
      const normalizedWeekday = weekday === 0 ? 6 : weekday - 1;
      const multiplier = product.currency === "USD" && rate ? rate : 1;
      weekdayValues[normalizedWeekday] += product.salePrice * multiplier;
    }

    return weekdayLabels.map((label, index) => ({
      label,
      value: Number(weekdayValues[index].toFixed(0)),
    }));
  }, [products, rate]);

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="px-3 gap-4 pb-8"
    >
      <AppHeader />

      {loading ? (
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-slate-500">Carregando estoque...</Text>
        </View>
      ) : null}

      {error ? (
        <View className="bg-rose-50 rounded-3xl p-5 shadow-sm">
          <Text className="text-rose-500">{error}</Text>
        </View>
      ) : null}

      {actionError ? (
        <View className="bg-rose-50 rounded-3xl p-5 shadow-sm">
          <Text className="text-rose-500">{actionError}</Text>
        </View>
      ) : null}

      <InformationCube
        title="Valor em estoque"
        value={totalStock}
        information="+12%"
        iconName="shippingbox.fill"
        variant="indigo"
      />

      <InformationCube
        title="Lucro estimado"
        value={totalProfit}
        information="Meta Atingida"
        iconName="dollarsign.circle.fill"
        variant="green"
      />

      <InformationCube
        title="Cotacao do dolar"
        value={rate ?? 0}
        information={usdRateLoading ? "Atualizando..." : "Fonte: AwesomeAPI"}
        iconName="dollarsign.circle.fill"
        variant="indigo"
        minimumFractionDigits={2}
        maximumFractionDigits={2}
      />

      {/* Performance Chart */}
      <View className="bg-white rounded-3xl p-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-900 font-bold text-base">Performance</Text>
          <Text className="text-slate-400 text-sm">Ultimos 7 dias</Text>
        </View>

        <LineChart
          data={chartData}
          width={280}
          height={120}
          color="#6366f1"
          thickness={2}
          curved
          hideDataPoints={false}
          dataPointsColor="#6366f1"
          dataPointsRadius={4}
          areaChart
          startFillColor="#6366f1"
          startOpacity={0.15}
          endOpacity={0.01}
          xAxisColor="#e2e8f0"
          yAxisColor="#e2e8f0"
          yAxisTextStyle={{ color: "#94a3b8", fontSize: 10 }}
          xAxisLabelTextStyle={{ color: "#94a3b8", fontSize: 10 }}
          noOfSections={3}
          rulesColor="#f1f5f9"
          hideRules={false}
          spacing={42}
        />
      </View>

      {/* Recent Items */}
      <View className="bg-white rounded-3xl p-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-900 font-bold text-base">
            Itens Recentes
          </Text>
          <TouchableOpacity onPress={() => router.push("/items")}>
            <Text className="text-indigo-500 text-sm font-semibold">
              Ver Todas
            </Text>
          </TouchableOpacity>
        </View>

        {recentItems.length ? (
          recentItems.map((product) => (
            <StockItem
              key={product.id}
              product={product}
              usdRate={rate}
              onDelete={handleDelete}
              onToggleSold={handleToggleSold}
              disabled={pendingProductId === product.id}
            />
          ))
        ) : (
          <Text className="text-slate-400 text-sm py-4">
            Nenhum item salvo no estoque ainda.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
