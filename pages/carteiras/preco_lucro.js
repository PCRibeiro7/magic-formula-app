import { Stack } from "@mui/material";
import RankingPanel from "components/RankingPanel";
import { WalletRules } from "components/WalletRules";
import { useEffect, useState } from "react";
import { fetchAllStocks, fetchHistoricalData } from "services/statusInvest";
import styles from "styles/Wallets.module.css";
import { average, median } from "utils/math";
import { filterByDecioBasin } from "utils/wallets";

const INITIAL_LAST_YEARS = 5;

export async function getServerSideProps(context) {
  try {
    const stocks = await fetchAllStocks();
    let stocksWithRanking = filterByDecioBasin(stocks);
    let historicalData = [];
    const batchSize = 100;
    for (let i = 0; i < stocksWithRanking.length; i = i + batchSize) {
      const currStocksBatch = stocksWithRanking.slice(i, i + batchSize);
      const currHistoricalData = await Promise.all(
        currStocksBatch.map((stock) =>
          fetchHistoricalData({
            ticker: stock.ticker,
          })
        )
      );
      historicalData = [...historicalData, ...currHistoricalData];
    }
    const historicalDataWithTicker = historicalData.map(
      (companyData, index) => {
        return { ticker: stocksWithRanking[index].ticker, ...companyData };
      }
    );

    stocksWithRanking = stocksWithRanking.map((stock) => ({
      ...stock,
      historicalData: historicalDataWithTicker.find(
        (historicalStock) => historicalStock.ticker === stock.ticker
      ),
    }));
    return {
      props: {
        stocks: stocksWithRanking,
      }, // will be passed to the page component as props
    };
  } catch (error) {
    console.log(error);
  }
}

const headCells = [
  {
    id: "ticker",
    numeric: false,
    disablePadding: false,
    isOrdinal: false,
    label: "Ticker",
  },
  {
    id: "averagePL",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "P/L Médio Histórico",
  },
  {
    id: "p_L",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "P/L Atual",
  },
  {
    id: "plDiff",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Margem P/L (%)",
  },
];

export default function GrahamWallet({ stocks }) {
  const [lastYears, setLastYears] = useState(INITIAL_LAST_YEARS);
  const [filteredStocks, setFilteredStocks] = useState(stocks);
  useEffect(() => {
    const newStocks = stocks
      .map((stock) => ({
        ...stock,
        p_L: Math.round(stock.p_L * 100) / 100,
        averagePL:
          Math.round(
            Math.min(
              median(
                stock.historicalData["P/L"].series
                  .slice(1, 1 + lastYears)
                  .map((year) => year.value)
              ),
              average(
                stock.historicalData["P/L"].series
                  .slice(1, 1 + lastYears)
                  .map((year) => year.value)
              )
            ) * 100
          ) / 100,
      }))
      .map((stock) => ({
        ...stock,
        plDiff: Math.round((1 - stock.p_L / stock.averagePL) * 10000) / 100,
      }))
      .filter(
        (stock) =>
          stock.p_L > 0 &&
          stock.averagePL > 0 &&
          stock.historicalData["P/L"].series.length > 1 + lastYears
      );
    setFilteredStocks(newStocks);
  }, [lastYears, stocks]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteira P/L Abaixo da Média:</h1>
      </main>
      <Stack maxWidth={"800px"}>
        <WalletRules
          ruleDescription={
            <>
              <br />
              1 - Ter Lucro por ação maior que zero, isto é, a empresa não pode
              estar com prejuízo atualmente.
              <br />
              <br />
              2 - Calculamos o P/L Médio dos últimos x anos. Esse P/L calculado é o
              menor entre a média e a mediana históricas.
              <br />
              <br />3 - Criamos o ranking considerando as ações{" "}
              <strong>mais descontadas</strong> em relação ao{" "}
              <strong>P/L médio</strong>.
            </>
          }
        />
        <RankingPanel
          stocks={filteredStocks}
          headCells={headCells}
          initialOrderBy={{ column: "plDiff", direction: "desc" }}
          showDividendFilter
          lastYears={lastYears}
          setLastYears={setLastYears}
        />
      </Stack>
    </div>
  );
}
