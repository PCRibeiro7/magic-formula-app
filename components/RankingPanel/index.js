import { Divider, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import CustomTable from "components/CustomTable";
import MaskedNumberInput from "components/MaskedNumberInput";

export default function RankingPanel({ stocks, headCells, initialOrderBy,hideYearsWithProfitFilter }) {
  const [minimumMarketCap, setMinimumMarketCap] = useState("");
  const [minimumLiquidity, setMinimumLiquidity] = useState("");
  const [minimumYearsWithProfit, setMinimumYearsWithProfit] = useState("");

  const filterByMarketCap = (stock) => {
    return minimumMarketCap ? stock.valorMercado > minimumMarketCap : true;
  };

  const filterByLiquidity = (stock) => {
    return minimumLiquidity
      ? stock.liquidezMediaDiaria > minimumLiquidity
      : true;
  };

  const filterByYearsWithProfit = (stock) => {
    const minimumYearsWithProfitAsNumber = Number(minimumYearsWithProfit)
    const profitableLastYears = stock?.historicalData?.["P/L"]?.series
      .slice(2, 2+minimumYearsWithProfitAsNumber)
      .filter((year) => year?.value > 0);
    const alternativeProfitableLastYears = stock?.historicalData?.["LPA"]?.series
      .slice(2, 2+minimumYearsWithProfitAsNumber)
      .filter((year) => year?.value > 0);
    return minimumYearsWithProfitAsNumber
      ? profitableLastYears?.length === minimumYearsWithProfitAsNumber ||
      alternativeProfitableLastYears?.length === minimumYearsWithProfitAsNumber
      : true;
  };
  
  return (
    <Paper sx={{ paddingTop: "24px" }}>
      <Typography variant="h6" textAlign={"start"} ml={2} mb={2}>
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
      {hideYearsWithProfitFilter ? (
        <></>
      ) : (
        <Box mb={4} textAlign={"start"} ml={2}>
          <Typography>Anos passados com lucro: (Anos)</Typography>
          <TextField
            value={minimumYearsWithProfit}
            onChange={(e) => setMinimumYearsWithProfit(e.target.value)}
            placeholder={"0"}
          />
        </Box>
      )}
      <Divider sx={{ width: "90%" }} />
      <Typography variant="h6" textAlign={"start"} ml={2} mt={3}>
        Ranking:
      </Typography>
      <CustomTable
        rows={stocks
          .filter(filterByMarketCap)
          .filter(filterByLiquidity)
          .filter(filterByYearsWithProfit)}
        headCells={headCells}
        initialOrderBy={initialOrderBy}
      />
    </Paper>
  );
}
