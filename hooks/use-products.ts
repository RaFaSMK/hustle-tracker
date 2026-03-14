import { subscribeToProducts } from "@/services/firestore";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (nextProducts) => {
        setProducts(nextProducts);
        setLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { products, loading, error };
}
