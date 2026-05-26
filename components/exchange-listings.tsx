import { formatCurrency, timeAgo } from "@/lib/utils";
import Link from "next/link";
import DataTable from "./data-table";

const ExchangeListings = ({ exchangeListingsData }: ExchangeListingsProps) => {
  const exchangeListingsColumns: DataTableColumn<ExchangeListings>[] = [
    {
      header: "Exchange",
      cellClassName: "exchange-name",
      cell: (exchange) => (
        <>
          {exchange.market.name}
          <Link
            href={exchange.trade_url}
            aria-label="View trade"
            target="_blank"
          />
        </>
      ),
    },
    {
      header: "Pair",
      cellClassName: "pair",
      cell: (exchange) => (
        <p>
          {exchange.base} / {exchange.target}
        </p>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (exchange) =>
        exchange.last ? formatCurrency(Number(exchange.last)) : "-",
    },
    {
      header: "Last Traded",
      cellClassName: "time-cell",
      headClassName: "text-end!",
      cell: (exchange) =>
        exchange.last_traded_at ? timeAgo(exchange.last_traded_at) : "-",
    },
  ];

  return (
    <>
      <div className="exchange-section">
        <h4>Exchange Listings</h4>

        <DataTable
          columns={exchangeListingsColumns}
          data={exchangeListingsData}
          rowKey={(_, index) => index}
          tableClassName="exchange-table"
        />
      </div>
    </>
  );
};

export default ExchangeListings;
