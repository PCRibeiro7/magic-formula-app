import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import CustomTable from "components/CustomTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from '@mui/icons-material/EmojiEventsOutlined';
import { FilterPanel } from "components/FilterPanel";
import StarIcon from '@mui/icons-material/Star';

const LOCAL_STORAGE_FAVORITE_TICKERS_KEY = "favoriteTickers";

export default function RankingPanel({
  stocks,
  headCells,
  initialOrderBy,
  hideYearsWithProfitFilter,
}) {
  const [minimumMarketCap, setMinimumMarketCap] = useState("");
  const [minimumLiquidity, setMinimumLiquidity] = useState("");
  const [minimumYearsWithProfit, setMinimumYearsWithProfit] = useState("");
  const [favoriteTickers, setFavoriteTickers] = useState(
    typeof window !== 'undefined' && JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITE_TICKERS_KEY)) || []
  );
  const [filteredStocks, setFilteredStocks] = useState([]);


  const filterByMarketCap = useCallback((stock) => {
    return minimumMarketCap ? stock.valorMercado > minimumMarketCap : true;
  },[minimumMarketCap]);

  const filterByLiquidity = useCallback((stock) => {
    return minimumLiquidity
      ? stock.liquidezMediaDiaria > minimumLiquidity
      : true;
  },[minimumLiquidity]);

  const filterByYearsWithProfit = useCallback((stock) => {
    const minimumYearsWithProfitAsNumber = Number(minimumYearsWithProfit);
    const profitableLastYears = stock?.historicalData?.["P/L"]?.series
      .slice(2, 2 + minimumYearsWithProfitAsNumber)
      .filter((year) => year?.value > 0);
    const alternativeProfitableLastYears = stock?.historicalData?.[
      "LPA"
    ]?.series
      .slice(2, 2 + minimumYearsWithProfitAsNumber)
      .filter((year) => year?.value > 0);
    return minimumYearsWithProfitAsNumber
      ? profitableLastYears?.length === minimumYearsWithProfitAsNumber ||
          alternativeProfitableLastYears?.length ===
            minimumYearsWithProfitAsNumber
      : true;
  },[minimumYearsWithProfit]);

  const updateFavoriteTickers = (ticker, action) => {
    if (action === "add") {
      setFavoriteTickers((currTickers) => {
        const newTickers = [...currTickers, ticker];
        localStorage.setItem(
          LOCAL_STORAGE_FAVORITE_TICKERS_KEY,
          JSON.stringify(newTickers)
        );
        return newTickers;
      });
    } else if (action === "remove") {
      setFavoriteTickers((currTickers) => {
        const newTickers = currTickers.filter(
          (currTicker) => currTicker !== ticker
        );
        localStorage.setItem(
          LOCAL_STORAGE_FAVORITE_TICKERS_KEY,
          JSON.stringify(newTickers)
        );
        return newTickers;
      });
    }
  };

  useEffect(() => {
    setFilteredStocks(
      stocks
        .filter(filterByMarketCap)
        .filter(filterByLiquidity)
        .filter(filterByYearsWithProfit)
    );
  }, [filterByLiquidity, filterByMarketCap, filterByYearsWithProfit, stocks]);

  return (
    <>
      <FilterPanel
        minimumLiquidity={minimumLiquidity}
        setMinimumLiquidity={setMinimumLiquidity}
        minimumMarketCap={minimumMarketCap}
        setMinimumMarketCap={setMinimumMarketCap}
        minimumYearsWithProfit={minimumYearsWithProfit}
        setMinimumYearsWithProfit={setMinimumYearsWithProfit}
        hideYearsWithProfitFilter={hideYearsWithProfitFilter}
      />
      <Accordion sx={{ marginBottom: "16px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">
            <StarIcon
              sx={{ verticalAlign: "sub", marginRight: "8px" }}
            />
            Favoritos:
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box mb={4} textAlign={"start"} ml={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Ativo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStocks
                  .filter((stock) => favoriteTickers.includes(stock.ticker))
                  .map((stock, index) => (
                    <>
                      <TableRow>
                        <TableCell>
                          {`${
                            filteredStocks.findIndex(
                              (currStock) => currStock.ticker === stock.ticker
                            ) + 1
                          }º`}
                        </TableCell>
                        <TableCell>{stock.ticker}</TableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Paper sx={{ padding: "16px" }}>
        <Typography variant="h6" textAlign={"start"}>
          <EmojiEventsIcon sx={{ verticalAlign: "sub", marginRight: "8px" }} />
          Ranking:
        </Typography>
        <CustomTable
          rows={filteredStocks}
          headCells={headCells}
          initialOrderBy={initialOrderBy}
          favoriteTickers={favoriteTickers}
          updateFavoriteTickers={updateFavoriteTickers}
        />
      </Paper>
    </>
  );
}
