import { fetchAllStocks } from "../services/statusInvest";
import styles from "../styles/Wallets.module.css";
import { filterByMagicFormula } from "../utils/wallets";
import RankingPanel from "../components/RankingPanel";

export async function getServerSideProps(context) {
  const stocks = await fetchAllStocks();
  const stocksWithRanking = filterByMagicFormula(stocks);
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
    id: "rank",
    numeric: true,
    disablePadding: false,
    isOrdinal: true,
    label: "Rank Fórmula Mágica",
  },
  {
    id: "eV_Ebit",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "EV/EBIT",
  },
  {
    id: "rank_EV_EBIT",
    numeric: true,
    disablePadding: false,
    isOrdinal: true,
    label: "Rank EV/EBIT",
  },
  {
    id: "roic",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "ROIC",
  },
  {
    id: "rank_ROIC",
    numeric: true,
    disablePadding: false,
    isOrdinal: true,
    label: "Rank ROIC",
  },
];

export default function MagicFormula({ stocks }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteira Fórmula Mágica:</h1>
      </main>
      <RankingPanel
        stocks={stocks}
        headCells={headCells}
        initialOrderBy={{ column: "rank", direction: "asc" }}
      />
    </div>
  );
}
