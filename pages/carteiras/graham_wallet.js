import { Stack } from "@mui/material";
import RankingPanel from "components/RankingPanel";
import { WalletRules } from "components/WalletRules";
import { fetchAllStocks, fetchHistoricalData } from "services/statusInvest";
import styles from "styles/Wallets.module.css";
import { filterByGraham } from "utils/wallets";

export async function getServerSideProps(context) {
  const stocks = await fetchAllStocks();
  let stocksWithRanking = filterByGraham(stocks);
  const historicalData = await Promise.all(
    stocksWithRanking.map((stock) =>
      fetchHistoricalData({ ticker: stock.ticker })
    )
  );
  const historicalDataWithTicker = historicalData.map((companyData, index) => {
    return { ticker: stocksWithRanking[index].ticker, ...companyData };
  });
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
    id: "graham_price_diff",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Margem de Graham (%)",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Cotação Atual (R$)",
  },
  {
    id: "graham_price",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Preço Graham  (R$)",
  },
];

export default function GrahamWallet({ stocks }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteira Graham:</h1>
      </main>
      <Stack maxWidth={"800px"}>
        <WalletRules
          ruleDescription={
            <>
              1 - Ter Valor Patrimonial por ação positivo, ou seja, a empresa
              não pode ter mais passivos (obrigações a pagar) que ativos (bens
              ou direitos a receber).
              <br />
              <br />
              2 - Ter Lucro por ação maior que zero, isto é, a empresa não pode
              estar com prejuízo atualmente.
              <br />
              <br />3 - Preço atual pelo menos 20% abaixo do{" "}
              <strong>preço justo de Graham</strong>.
              <br />
              <br />4 - Criamos o ranking considerando as ações{" "}
              <strong>mais descontadas</strong> em relação ao{" "}
              <strong>preço justo de Graham</strong>.
            </>
          }
        />
        <RankingPanel
          stocks={stocks}
          headCells={headCells}
          initialOrderBy={{ column: "graham_price_diff", direction: "desc" }}
        />
      </Stack>
    </div>
  );
}
