import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MaskedNumberInput from "components/MaskedNumberInput";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAltOutlined";

export const FilterPanel = function ({
  minimumLiquidity,
  setMinimumLiquidity,
  minimumMarketCap,
  setMinimumMarketCap,
  minimumYearsWithProfit,
  setMinimumYearsWithProfit,
  hideYearsWithProfitFilter,
  showDividendFilter,
  lastYears,
  setLastYears,
}) {
  return (
    <Accordion sx={{ marginBottom: "16px" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">
          <FilterAltIcon sx={{ verticalAlign: "sub", marginRight: "8px" }} />
          Filtros:
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
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
        {showDividendFilter ? (
          <Box mb={4} textAlign={"start"} ml={2}>
            <Typography>
              Número de anos passados considerados para média de P/L: (Anos)
            </Typography>
            <TextField
              value={lastYears}
              onChange={(e) => setLastYears(Number(e.target.value))}
              placeholder={"3"}
            />
          </Box>
        ) : (
          <></>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
