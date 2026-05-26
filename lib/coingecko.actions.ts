"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get api key");

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 0,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": API_KEY,
      "Content-Type": "application/json",
    } as Record<string, string>,
    next: { revalidate },
    cache: "no-cache",
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => {});

    throw new Error(
      `API Error: ${response.status}: ${errorBody.error || response.statusText}`,
    );
  }

  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
    attributes: {
      address: "",
    },
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.error(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id },
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  const fallback: SearchCoin = {
    id: "",
    name: "",
    symbol: "",
    market_cap_rank: 0,
    thumb: "",
    large: "",
    data: {
      price: 0,
      price_change_percentage_24h: 0,
    },
  };

  const convertQueryToLowerCase = query.toLowerCase();

  try {
    const searchCoinList = await fetcher<{ coins: SearchCoin[] }>("/search", {
      query: convertQueryToLowerCase,
    });

    const top10Coins = searchCoinList.coins.slice(0, 10);

    const top10CoinIds = top10Coins.map((coin: SearchCoin) => coin.id);

    const convertedIds = top10CoinIds.join(",");

    const coinsMarketData = await fetcher<CoinMarketData[]>("/coins/markets", {
      vs_currency: "usd",
      ids: convertedIds,
    });

    // const priceMap = new Map(
    //   coinsMarketData.map((coin: CoinMarketData) => [
    //     coin.id,
    //     {
    //       price: coin.current_price,
    //       price_change_percentage_24h: coin.price_change_percentage_24h,
    //     },
    //   ]),
    // );

    const top10CoinPrices = coinsMarketData.map((coin: CoinMarketData) => ({
      price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));

    const mergedCoins = top10Coins.map((coin: SearchCoin, idx: number) => ({
      ...coin,
      data: {
        ...top10CoinPrices[idx],
      },
    }));

    return mergedCoins;
  } catch (error) {
    return [fallback];
  }
}
