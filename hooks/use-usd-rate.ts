import { fetchUsdRate } from "@/services/api";
import { useEffect, useState } from "react";

export function useUsdRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsdRate()
      .then(setRate)
      .catch(() => setRate(5.7)) // fallback se offline
      .finally(() => setLoading(false));
  }, []);

  return { rate, loading };
}
