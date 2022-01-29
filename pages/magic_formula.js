import { Box, TextField, Typography, Paper, Stack } from "@mui/material";
import { useState } from "react";
import CustomTable from "../components/CustomTable";
import MaskedNumberInput from "../components/MaskedNumberInput";
import { fetchAllStocks } from "../services/statusInvest";
import styles from "../styles/Wallets.module.css";
import { filterByMagicFormula } from "../utils/wallets";

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

export default function Home({ stocks }) {
  const [minimumMarketCap, setMinimumMarketCap] = useState("");
  const [minimumLiquidity, setMinimumLiquidity] = useState("");

  const filterByMarketCap = (stock) => {
    return minimumMarketCap ? stock.valorMercado > minimumMarketCap : true;
  };

  const filterByLiquidity = (stock) => {
    return minimumLiquidity
      ? stock.liquidezMediaDiaria > minimumLiquidity
      : true;
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteira Fórmula Mágica:</h1>
      </main>
      <Paper sx={{ padding: "24px 8px" }}>
        <Box mb={4}>
          <Typography>Liquidez diária mínima: (R$)</Typography>
          <MaskedNumberInput
            value={minimumLiquidity}
            handleChange={(e) => setMinimumLiquidity(e.target.value)}
          />
        </Box>
        <Box mb={4}>
          <Typography>Valor de mercado mínimo: (R$)</Typography>
          <MaskedNumberInput
            value={minimumMarketCap}
            handleChange={(e) => setMinimumMarketCap(e.target.value)}
          />
        </Box>
      </Paper>
      <CustomTable
        rows={stocks.filter(filterByMarketCap).filter(filterByLiquidity)}
        headCells={headCells}
        initialOrderBy={{ column: "rank", direction: "asc" }}
      />
    </div>
  );
}
