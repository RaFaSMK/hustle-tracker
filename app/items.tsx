import AppHeader from "@/components/ui/app-header";
import StockItem from "@/components/ui/stock-item";
import { useProducts } from "@/hooks/use-products";
import { useUsdRate } from "@/hooks/use-usd-rate";
import { deleteProduct, updateProductStatus } from "@/services/firestore";
import { Product } from "@/types/product";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ItemsScreen() {
  const router = useRouter();
  const { products, loading, error } = useProducts();
  const { rate } = useUsdRate();
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="px-3 gap-4 pb-8"
    >
      <AppHeader />

      <View className="bg-white rounded-3xl p-5 shadow-sm gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-extrabold text-gray-900">
            Todos os Itens
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5"
          >
            <MaterialIcons name="arrow-back" size={14} color="#64748b" />
            <Text className="text-xs font-semibold text-slate-600">Voltar</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-slate-500">
          Visao completa do estoque com detalhes financeiros por item.
        </Text>

        {loading ? (
          <Text className="text-slate-500">Carregando itens...</Text>
        ) : null}

        {error ? <Text className="text-rose-500">{error}</Text> : null}

        {actionError ? (
          <Text className="text-rose-500">{actionError}</Text>
        ) : null}

        {products.length ? (
          products.map((product) => (
            <StockItem
              key={product.id}
              product={product}
              usdRate={rate}
              showDetails
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
