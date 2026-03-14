import AppHeader from "@/components/ui/app-header";
import CategoryToggle from "@/components/ui/category-toggle";
import { addProduct } from "@/services/firestore";
import { ProductCategory } from "@/types/product";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Add() {
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState<ProductCategory>("fisico");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function parseMoney(value: string) {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }

  async function handleSave() {
    const parsedCostPrice = parseMoney(costPrice);
    const parsedSalePrice = parseMoney(salePrice);
    const parsedQuantity = Number(quantity);

    if (
      !name.trim() ||
      !Number.isFinite(parsedCostPrice) ||
      !Number.isFinite(parsedSalePrice) ||
      !Number.isFinite(parsedQuantity)
    ) {
      setError("Preencha os campos corretamente antes de salvar.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await addProduct({
        name: name.trim(),
        costPrice: parsedCostPrice,
        salePrice: parsedSalePrice,
        quantity: Math.max(1, parsedQuantity),
        category,
        currency: category === "digital" ? "USD" : "BRL",
      });

      setSaved(true);
      setName("");
      setCostPrice("");
      setSalePrice("");
      setQuantity("1");
      setCategory("fisico");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Nao foi possivel salvar no Firebase.");
    } finally {
      setSaving(false);
    }
  }

  const currencyLabel = category === "digital" ? "USD" : "R$";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="px-3 gap-4 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader />

        <Text className="text-2xl font-extrabold text-gray-900">Novo Item</Text>

        <View className="gap-4">
          <Field label="Nome do Produto">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex: Mouse VXE RX"
              className="border border-gray-200 rounded-2xl px-4 py-3 bg-white text-gray-900 text-sm"
              placeholderTextColor="#9ca3af"
            />
          </Field>

          <Field label={`Preco de Custo (${currencyLabel})`}>
            <TextInput
              value={costPrice}
              onChangeText={setCostPrice}
              placeholder="0,00"
              keyboardType="numeric"
              className="border border-gray-200 rounded-2xl px-4 py-3 bg-white text-gray-900 text-sm"
              placeholderTextColor="#9ca3af"
            />
          </Field>

          <Field label={`Preco de Venda (${currencyLabel})`}>
            <TextInput
              value={salePrice}
              onChangeText={setSalePrice}
              placeholder="0,00"
              keyboardType="numeric"
              className="border border-gray-200 rounded-2xl px-4 py-3 bg-white text-gray-900 text-sm"
              placeholderTextColor="#9ca3af"
            />
          </Field>

          <Field label="Quantidade">
            <View className="flex-row items-center border border-gray-200 rounded-2xl bg-white overflow-hidden">
              <TouchableOpacity
                className="px-4 py-3"
                onPress={() =>
                  setQuantity((q) => String(Math.max(1, Number(q) - 1)))
                }
              >
                <Text className="text-gray-500 text-lg font-bold">−</Text>
              </TouchableOpacity>
              <Text className="flex-1 text-center text-gray-900 font-semibold">
                {quantity}
              </Text>
              <TouchableOpacity
                className="px-4 py-3"
                onPress={() => setQuantity((q) => String(Number(q) + 1))}
              >
                <Text className="text-gray-500 text-lg font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </Field>

          <Field label="Categoria">
            <CategoryToggle value={category} onChange={setCategory} />
          </Field>
        </View>

        {error ? <Text className="text-rose-500 text-sm">{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`rounded-2xl py-4 items-center mt-2 ${
            saving
              ? "bg-emerald-300"
              : saved
                ? "bg-emerald-400"
                : "bg-emerald-500"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar no Estoque"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-gray-700 font-medium text-sm">{label}</Text>
      {children}
    </View>
  );
}
