"use client";

import CandlestickChart from "./candlestick-chart";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./data-table";
import TimeCell from "./time-cell";
import CoinHeader from "./coin-header";

const LiveDataWrapper = ({
  children,
  coinId,
  poolId,
  coin,
  coinOHLCData,
  trades,
  liveOhlcv,
}: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1m");

  const liveOhlcvData = liveOhlcv?.shift();

  const tradeColumns: DataTableColumn<TradeData>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) =>
        trade.attributes.price_from_in_usd
          ? formatCurrency(Number(trade.attributes.price_from_in_usd))
          : "-",
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) =>
        Number(trade.attributes.from_token_amount)?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) =>
        trade.attributes.volume_in_usd
          ? formatCurrency(Number(trade.attributes.volume_in_usd))
          : "-",
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => (
        <span
          className={
            trade.attributes.kind === "buy" ? "text-green-500" : "text-red-500"
          }
        >
          {trade.attributes.kind === "buy" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) =>
        trade.attributes.block_timestamp ? (
          <TimeCell timestamp={trade.attributes.block_timestamp} />
        ) : (
          "-"
        ),
    },
  ];

  return (
    <>
      <section id="live-data-wrapper">
        <CoinHeader
          name={coin.name}
          image={coin.image.large}
          livePrice={coin.market_data.current_price.usd}
          livePriceChangePercentage24h={
            coin.market_data.price_change_percentage_24h_in_currency.usd
          }
          priceChangePercentage30d={
            coin.market_data.price_change_percentage_30d_in_currency.usd
          }
          priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
        />
        <Separator className="divider" />

        <div className="trend">
          <CandlestickChart
            coinId={coinId}
            data={coinOHLCData}
            liveOhlcv={liveOhlcvData}
            mode="live"
            initialPeriod="daily"
            liveInterval={liveInterval}
            setLiveInterval={setLiveInterval}
          >
            <h4>Trend Overview</h4>
          </CandlestickChart>
        </div>

        <Separator className="divider" />

        {tradeColumns && (
          <div className="trades">
            <h4>Recent Trades</h4>

            <DataTable
              columns={tradeColumns}
              data={trades.slice(0, 7)}
              rowKey={(_, index) => index}
              tableClassName="trades-table"
            />
          </div>
        )}

        <Separator className="divider" />

        <div>{children}</div>
      </section>
    </>
  );
};

export default LiveDataWrapper;
