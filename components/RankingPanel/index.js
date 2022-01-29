import { Divider, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import CustomTable from "../CustomTable";
import MaskedNumberInput from "../MaskedNumberInput";

export default function RankingPanel({ stocks, headCells, initialOrderBy }) {
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
    <Paper sx={{ padding: "24px 8px",  }} >
      <Typography variant="h5" textAlign={"start"} ml={2} mb={2}>
        Filtros:
      </Typography>
      <Box mb={4} textAlign={"start"} ml={2}>
        <Typography>Liquidez diária mínima: (R$)</Typography>
        <MaskedNumberInput
          value={minimumLiquidity}
          handleChange={(e) => setMinimumLiquidity(e.target.value)}
          placeholder={"0"}
        />
      </Box>
      <Box mb={4} textAlign={"start"} ml={2}>
        <Typography>Valor de mercado mínimo: (R$)</Typography>
        <MaskedNumberInput
          value={minimumMarketCap}
          handleChange={(e) => setMinimumMarketCap(e.target.value)}
          placeholder={"0"}
        />
      </Box>
      <Divider sx={{ width: "90%" }} />
      <Typography variant="h5" textAlign={"start"} ml={2} mt={3}>
        Ranking:
      </Typography>
      <CustomTable
        rows={stocks.filter(filterByMarketCap).filter(filterByLiquidity)}
        headCells={headCells}
        initialOrderBy={initialOrderBy}
      />
    </Paper>
  );
}
