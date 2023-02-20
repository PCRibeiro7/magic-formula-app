import { Stack } from "@mui/material";
import RankingPanel from "components/RankingPanel";
import { useEffect, useState } from "react";
import styles from "styles/Wallets.module.css";

const INITIAL_LAST_YEARS = 5;

const headCells = [
  {
    id: "ticker",
    numeric: false,
    disablePadding: false,
    isOrdinal: false,
    label: "Ticker",
  },
  {
    id: "p_L",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "P/L",
  },
  {
    id: "p_VP",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "P/VP",
  },
  {
    id: "eV_Ebit",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "EV/EBIT",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "Cotação",
  },
];


export default function ProfitableLastYears() {
  const [lastYears, setLastYears] = useState(INITIAL_LAST_YEARS);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch(
      `/api/profitable_last_years_stocks`
    );
    const stocksWithRanking = await res.json();
    setStocks(stocksWithRanking);
    setLoading(false)
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteira  de Anos Consecutivos de Lucro:</h1>
      </main>
      <Stack maxWidth={"800px"}>
        <RankingPanel
          stocks={stocks}
          headCells={headCells}
          initialOrderBy={{ column: "p_L", direction: "asc" }}
          lastYears={lastYears}
          setLastYears={setLastYears}
          loading={loading}
          hideYearsWithProfitFilter
        />
      </Stack>
    </div>
  );
}
