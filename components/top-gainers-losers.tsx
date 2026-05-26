import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const TopGainersLosers = ({ topGainersLosers }: CoinMarketDataResponse) => {
  return (
    <>
      <div id="top-gainers-losers">
        <Tabs defaultValue="topGainers" className="flex flex-col">
          <TabsList className="tabs-list">
            <TabsTrigger value="topGainers" className="tabs-trigger">
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="topLosers" className="tabs-trigger">
              Top Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="topGainers" className="tabs-content">
            {topGainersLosers
              .sort(
                (a, b) =>
                  b.price_change_percentage_24h - a.price_change_percentage_24h,
              )
              .slice(0, 4)
              .map((coin) => (
                <div
                  key={coin.id}
                  className="bg-dark-500 flex justify-between items-center px-5 py-4 rounded-xl overflow-hidden w-full"
                >
                  <div className="flex gap-3 items-center">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={36}
                      height={36}
                    />

                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm md:text-base font-bold">
                        {coin.name}
                      </p>
                      <p className="text-sm text-purple-100/50 font-medium">
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm md:text-base font-medium text-end">
                      {formatCurrency(coin.current_price)}
                    </p>
                    <p className="flex items-center gap-0.5 text-sm md:text-base font-medium text-green-500">
                      <ArrowUpRight size={16} />
                      {coin.price_change_percentage_24h > 0 &&
                        formatPercentage(coin.price_change_percentage_24h)}
                    </p>
                  </div>
                </div>
              ))}
          </TabsContent>
          <TabsContent value="topLosers" className="tabs-content">
            {topGainersLosers
              .sort(
                (a, b) =>
                  a.price_change_percentage_24h - b.price_change_percentage_24h,
              )
              .slice(0, 4)
              .map((coin) => (
                <div
                  key={coin.id}
                  className="bg-dark-500 flex justify-between items-center px-5 py-4 rounded-xl overflow-hidden w-full"
                >
                  <div className="flex gap-3 items-center">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={36}
                      height={36}
                    />

                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm md:text-base font-bold">
                        {coin.name}
                      </p>
                      <p className="text-sm text-purple-100/50 font-medium">
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm md:text-base font-medium text-end">
                      {formatCurrency(coin.current_price)}
                    </p>
                    <p className="flex items-center gap-0.5 text-sm md:text-base font-medium text-red-500">
                      <ArrowDownRight size={16} />
                      {coin.price_change_percentage_24h < 0 &&
                        formatPercentage(coin.price_change_percentage_24h)}
                    </p>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default TopGainersLosers;
