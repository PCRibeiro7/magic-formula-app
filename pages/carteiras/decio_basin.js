import { Stack } from "@mui/material";
import RankingPanel from "components/RankingPanel";
import { WalletRules } from "components/WalletRules";
import { useEffect, useState } from "react";
import { fetchAllStocks, fetchDividendData } from "services/statusInvest";
import styles from "styles/Wallets.module.css";
import { average } from "utils/math";
import { filterByDecioBasin } from "utils/wallets";
import moment from "moment";
const INITIAL_LAST_YEARS = 3;
const CURRENT_YEAR = moment().year();
const TARGET_YIELD = 0.06;

export async function getServerSideProps(context) {
  const stocks = await fetchAllStocks();
  let stocksWithRanking = filterByDecioBasin(stocks);
  const historicalDividendData = (
    await Promise.all(
      stocksWithRanking.map((stock) =>
        fetchDividendData({ ticker: stock.ticker })
      )
    )
  ).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  stocksWithRanking = stocksWithRanking
    .map((stock) => ({
      ...stock,
      historicalDividendData: historicalDividendData[stock.ticker],
    }))
    .filter((stock) => stock.historicalDividendData.assetEarningsYearlyModels);
  return {
    props: {
      stocks: stocksWithRanking,
    }, // will be passed to the page component as props
  };
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
    id: "basinPriceDiff",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Margem de Bazin (%)",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Cotação Atual (R$)",
  },
  {
    id: "averageYield",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Yield Médio (R$)",
  },
  {
    id: "basinPrice",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Preço Bazin  (R$)",
  },
];

export default function DecioBasinWallet({ stocks }) {
  const [lastYears, setLastYears] = useState(INITIAL_LAST_YEARS);
  const [filteredStocks, setFilteredStocks] = useState(stocks);
  useEffect(() => {
    const newStocks = stocks
      .filter((stock) => {
        return (
          stock.historicalDividendData.assetEarningsYearlyModels.filter(
            (year) =>
              year.rank < CURRENT_YEAR &&
              year.rank >= CURRENT_YEAR - lastYears &&
              year.value > 0
          ).length === lastYears
        );
      })
      .map((stock) => {
        const yields = stock.historicalDividendData.assetEarningsYearlyModels
          .filter(
            (year) =>
              year.rank < CURRENT_YEAR && year.rank >= CURRENT_YEAR - lastYears
          )
          .map((year) => year.value);

        stock.averageYield = average(yields);
        stock.basinPrice =
          Math.round((stock.averageYield / TARGET_YIELD) * 100) / 100;
        stock.basinPriceDiff =
          Math.floor(
            ((stock.basinPrice - stock.price) / stock.basinPrice) * 10000
          ) / 100;

        return stock;
      });
    setFilteredStocks(newStocks);
  }, [lastYears, stocks]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteira Décio Bazin:</h1>
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
              2 - Ter dividend yield atual maior que 6%.
              <br />
              <br />
              3 - Calculamos o preço teto de Bazin a partir do yield médio
              histórico dividido por 6%.
              <br />
              <br />4 - Criamos o ranking considerando as ações{" "}
              <strong>mais descontadas</strong> em relação ao{" "}
              <strong>preço teto de Bazin</strong>.
            </>
          }
        />
        <RankingPanel
          stocks={filteredStocks}
          headCells={headCells}
          initialOrderBy={{
            column: "basinPriceDiff",
            direction: "desc",
          }}
          hideYearsWithProfitFilter
          showDividendFilter
          lastYears={lastYears}
          setLastYears={setLastYears}
        />
      </Stack>
    </div>
  );
}
