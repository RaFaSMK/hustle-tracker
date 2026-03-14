import AppHeader from "@/components/ui/app-header";
import { useProducts } from "@/hooks/use-products";
import { useUsdRate } from "@/hooks/use-usd-rate";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

type ReportPeriod = "month" | "3m" | "6m";

const PERIOD_OPTIONS: { key: ReportPeriod; label: string }[] = [
  { key: "month", label: "Este mes" },
  { key: "3m", label: "3 meses" },
  { key: "6m", label: "6 meses" },
];

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export default function Reports() {
  const { rate } = useUsdRate();
  const { products, loading, error } = useProducts();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("month");

  const activeRange = useMemo(() => {
    return getRangeFromPreset(selectedPeriod);
  }, [selectedPeriod]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const createdAt = new Date(product.createdAt);
      if (Number.isNaN(createdAt.getTime())) {
        return false;
      }

      return createdAt >= activeRange.start && createdAt <= activeRange.end;
    });
  }, [products, activeRange.start, activeRange.end]);

  const { grossProfit, margin, fisicoTotal, digitalTotal, pieData } =
    useMemo(() => {
      let gross = 0;
      let fisico = 0;
      let digital = 0;

      for (const p of filteredProducts) {
        const mult = p.currency === "USD" && rate ? rate : 1;
        const sale = p.salePrice * mult * p.quantity;
        const c = p.costPrice * mult * p.quantity;
        gross += sale - c;
        if (p.category === "fisico") fisico += sale;
        else digital += sale;
      }

      const totalSale = fisico + digital;
      const avg = totalSale > 0 ? ((gross / totalSale) * 100).toFixed(0) : "0";

      return {
        grossProfit: gross,
        margin: avg,
        fisicoTotal: fisico,
        digitalTotal: digital,
        pieData: [
          { value: fisico, color: "#6366f1", text: "Físico" },
          { value: digital, color: "#10b981", text: "Digital" },
        ],
      };
    }, [filteredProducts, rate]);

  const barData = [
    { value: fisicoTotal, label: "Físico", frontColor: "#6366f1" },
    { value: digitalTotal, label: "Digital", frontColor: "#10b981" },
  ];

  const lineData = useMemo(() => {
    const monthLabels = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const buckets: { key: string; label: string; value: number }[] = [];
    const valuesByKey: Record<string, number> = {};

    const start = new Date(
      activeRange.start.getFullYear(),
      activeRange.start.getMonth(),
      1,
    );
    const end = new Date(
      activeRange.end.getFullYear(),
      activeRange.end.getMonth(),
      1,
    );

    const cursor = new Date(start);
    while (cursor <= end) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      const label = `${monthLabels[cursor.getMonth()]}/${String(cursor.getFullYear()).slice(-2)}`;
      buckets.push({ key, label, value: 0 });
      valuesByKey[key] = 0;
      cursor.setMonth(cursor.getMonth() + 1);
    }

    for (const product of filteredProducts) {
      const createdAt = new Date(product.createdAt);
      if (Number.isNaN(createdAt.getTime())) {
        continue;
      }

      const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (!(key in valuesByKey)) {
        continue;
      }

      const multiplier = product.currency === "USD" && rate ? rate : 1;
      valuesByKey[key] += product.salePrice * multiplier * product.quantity;
    }

    return buckets.map((bucket) => ({
      label: bucket.label,
      value: Number(valuesByKey[bucket.key].toFixed(0)),
    }));
  }, [filteredProducts, activeRange.start, activeRange.end, rate]);

  const selectedPeriodLabel =
    PERIOD_OPTIONS.find((option) => option.key === selectedPeriod)?.label ??
    "Este mes";

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="px-3 gap-4 pb-8"
    >
      <AppHeader />

      {loading ? (
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-slate-500">Carregando relatorios...</Text>
        </View>
      ) : null}

      {error ? (
        <View className="bg-rose-50 rounded-3xl p-5 shadow-sm">
          <Text className="text-rose-500">{error}</Text>
        </View>
      ) : null}

      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-2xl font-extrabold text-gray-900">
          Relatórios e Estatísticas
        </Text>
        <Text className="text-slate-400 text-sm">{selectedPeriodLabel}</Text>
      </View>

      <View className="bg-white rounded-3xl p-4 shadow-sm gap-3">
        <Text className="text-gray-900 font-bold text-sm">Periodo</Text>
        <View className="flex-row flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => {
            const selected = selectedPeriod === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSelectedPeriod(option.key)}
                className={`rounded-full px-3 py-1.5 ${
                  selected ? "bg-indigo-100" : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selected ? "text-indigo-700" : "text-slate-500"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Summary cards */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-3xl bg-indigo-600 p-4">
          <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">
            Lucro Bruto
          </Text>
          <Text className="text-white text-2xl font-extrabold mt-2">
            {brl.format(grossProfit)}
          </Text>
          <View className="mt-3 self-start rounded-full bg-indigo-500/70 px-3 py-1">
            <Text className="text-indigo-100 text-xs font-semibold">+8%</Text>
          </View>
        </View>

        <View className="flex-1 rounded-3xl bg-emerald-500 p-4">
          <Text className="text-emerald-100 text-xs font-semibold uppercase tracking-widest">
            Margem Média
          </Text>
          <Text className="text-white text-2xl font-extrabold mt-2">
            {margin}%
          </Text>
          <View className="mt-3 self-start rounded-full bg-emerald-400/70 px-3 py-1">
            <Text className="text-emerald-50 text-xs font-semibold">
              ✓ Meta Atingida
            </Text>
          </View>
        </View>
      </View>

      {/* Bar + Pie Charts */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-3xl p-4 shadow-sm">
          <Text className="text-gray-900 font-bold text-sm mb-3">
            Vendas por Categoria
          </Text>
          <BarChart
            data={barData}
            barWidth={36}
            spacing={24}
            roundedTop
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: "#94a3b8", fontSize: 9 }}
            xAxisLabelTextStyle={{ color: "#94a3b8", fontSize: 9 }}
            noOfSections={3}
            maxValue={Math.max(fisicoTotal, digitalTotal, 100) * 1.2}
            height={100}
            width={110}
            labelWidth={40}
          />
        </View>

        <View className="flex-1 bg-white rounded-3xl p-4 shadow-sm">
          <Text className="text-gray-900 font-bold text-sm mb-3">
            Composição do Estoque
          </Text>
          {pieData.some((item) => item.value > 0) ? (
            <PieChart
              data={pieData}
              donut
              radius={50}
              innerRadius={30}
              innerCircleColor="#ffffff"
              centerLabelComponent={() => null}
            />
          ) : (
            <Text className="text-xs text-slate-400">
              Sem dados no periodo.
            </Text>
          )}
          <View className="mt-2 gap-1">
            {pieData.map((d) => (
              <View key={d.text} className="flex-row items-center gap-1.5">
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <Text className="text-xs text-slate-500">{d.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Line Chart */}
      <View className="bg-white rounded-3xl p-5 shadow-sm">
        <Text className="text-gray-900 font-bold text-base mb-4">
          Histórico de Faturamento
        </Text>
        {filteredProducts.length ? (
          <LineChart
            data={lineData}
            width={290}
            height={120}
            color="#6366f1"
            thickness={2}
            curved
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
            spacing={38}
            hideDataPoints={false}
            dataPointsColor="#6366f1"
            dataPointsRadius={4}
          />
        ) : (
          <Text className="text-slate-400 text-sm">
            Sem dados suficientes para o periodo selecionado.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

function getRangeFromPreset(period: ReportPeriod) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }

  const monthsBack = period === "3m" ? 2 : 5;
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}
