import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import MagicFormulaTable from "../components/MagicFormulaTable";
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
      <Box mb={4}>
        <Typography>Líquidez diáira mínima:</Typography>
        <MaskedNumberInput
          value={minimumLiquidity}
          handleChange={(e) => setMinimumLiquidity(e.target.value)}
        />
      </Box>
      <Box mb={4}>
        <Typography>Valor de mercado mínimo:</Typography>
        <MaskedNumberInput
          value={minimumMarketCap}
          handleChange={(e) => setMinimumMarketCap(e.target.value)}
        />
      </Box>

      <MagicFormulaTable
        rows={stocks.filter(filterByMarketCap).filter(filterByLiquidity)}
      />
    </div>
  );
}
