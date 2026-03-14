export async function fetchUsdRate(): Promise<number> {
  const res = await fetch(
    "https://economia.awesomeapi.com.br/json/last/USD-BRL",
  );
  const data = await res.json();
  return parseFloat(data.USDBRL.bid);
}
