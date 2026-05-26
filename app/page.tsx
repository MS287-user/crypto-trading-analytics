import CoinOverview from "@/components/home/coin-overview";
import TrendingCoins from "@/components/home/trending-coins";
import {
  CoinOverviewFallback,
  TrendingCoinsFallback,
  CategoriesFallback,
} from "@/components/fallback";
import { Suspense } from "react";
import Categories from "@/components/home/categories";

export const dynamic = "force-dynamic";

const Home = async () => {
  return (
    <>
      <main className="main-container">
        <section className="home-grid">
          <Suspense fallback={<CoinOverviewFallback />}>
            <CoinOverview />
          </Suspense>

          <Suspense fallback={<TrendingCoinsFallback />}>
            <TrendingCoins />
          </Suspense>
        </section>

        <section className="w-full mt-7 space-y-4">
          <Suspense fallback={<CategoriesFallback />}>
            <Categories />
          </Suspense>
        </section>
      </main>
    </>
  );
};

export default Home;
