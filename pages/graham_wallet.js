import { Box, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import RankingPanel from "../components/RankingPanel";
import { fetchAllStocks } from "../services/statusInvest";
import styles from "../styles/Wallets.module.css";
import { filterByGraham } from "../utils/wallets";

export async function getServerSideProps(context) {
  const stocks = await fetchAllStocks();
  const stocksWithRanking = filterByGraham(stocks);
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
      <RankingPanel
        stocks={stocks}
        headCells={headCells}
        initialOrderBy={{ column: "graham_price_diff", direction: "desc" }}
      />
    </div>
  );
}
