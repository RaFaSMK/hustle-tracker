import { db } from "@/services/firebase";
import {
  Product,
  ProductCategory,
  ProductCurrency,
  ProductStatus,
} from "@/types/product";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const collectionRef = collection(db, "estoque");

export interface ProductInput {
  name: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  category: ProductCategory;
  currency: ProductCurrency;
  status?: ProductStatus;
}

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function normalizeCategory(value: unknown): ProductCategory {
  return value === "digital" ? "digital" : "fisico";
}

function normalizeCurrency(
  value: unknown,
  category: ProductCategory,
): ProductCurrency {
  if (value === "USD" || value === "BRL") {
    return value;
  }

  return category === "digital" ? "USD" : "BRL";
}

function normalizeStatus(value: unknown): ProductStatus {
  return value === "vendido" ? "vendido" : "em_estoque";
}

function categoryToTag(category: ProductCategory) {
  return category === "digital" ? "Digital / Roblox" : "Eletrônicos";
}

function timestampToIso(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    const date = value.toDate();
    if (date instanceof Date) {
      return date.toISOString();
    }
  }

  if (typeof value === "string") {
    return value;
  }

  return new Date().toISOString();
}

export function normalizeProduct(
  id: string,
  raw: Record<string, unknown>,
): Product {
  const category = normalizeCategory(raw.category);
  const currency = normalizeCurrency(raw.currency, category);

  return {
    id,
    name: normalizeText(raw.name ?? raw.nome, "Item sem nome"),
    tag: normalizeText(raw.tag, categoryToTag(category)),
    costPrice: normalizeNumber(raw.costPrice, 0),
    salePrice: normalizeNumber(raw.salePrice ?? raw.preco, 0),
    currency,
    quantity: Math.max(1, normalizeNumber(raw.quantity, 1)),
    category,
    status: normalizeStatus(raw.status),
    createdAt: timestampToIso(raw.createdAt),
  };
}

export async function addProduct(input: ProductInput) {
  await addDoc(collectionRef, {
    ...input,
    tag: categoryToTag(input.category),
    status: input.status ?? "em_estoque",
    createdAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string) {
  await deleteDoc(doc(db, "estoque", productId));
}

export async function updateProductStatus(
  productId: string,
  status: ProductStatus,
) {
  await updateDoc(doc(db, "estoque", productId), { status });
}

export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const products = snapshot.docs
        .map((docItem) => normalizeProduct(docItem.id, docItem.data()))
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

      onData(products);
    },
    (error) => onError(error),
  );
}
