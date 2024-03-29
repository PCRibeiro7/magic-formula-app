import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    IconButton,
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
import CustomTable from "@/components/CustomTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FilterPanel } from "@/components/FilterPanel";
import StarIcon from "@mui/icons-material/Star";
import { LOCAL_STORAGE_FAVORITE_TICKERS_KEY } from "@/components/FavoritesPanel";
import { Stock, StockKeys } from "@/types/stock";
import { json2csv } from "json-2-csv";

type Props = {
    stocks: any[];
    headCells: any[];
    initialOrderBy: { column: string; direction: "asc" | "desc" };
    hideYearsWithProfitFilter: boolean;
    showDividendFilter: boolean;
    lastYears?: number;
    setLastYears?: (years: number) => void;
    loading?: boolean;
    hideFilter?: boolean;
    hideFavorites?: boolean;
};

export default function RankingPanel({
    stocks,
    headCells,
    initialOrderBy,
    hideYearsWithProfitFilter = true,
    showDividendFilter = false,
    lastYears = 0,
    setLastYears = () => {},
    loading,
    hideFilter,
    hideFavorites,
}: Props) {
    const [minimumMarketCap, setMinimumMarketCap] = useState(0);
    const [minimumLiquidity, setMinimumLiquidity] = useState(100000);
    const [minimumYearsWithProfit, setMinimumYearsWithProfit] = useState(
        lastYears || 0
    );
    const [favoriteTickers, setFavoriteTickers] = useState<string[]>(
        (typeof window !== "undefined" &&
            localStorage.getItem(LOCAL_STORAGE_FAVORITE_TICKERS_KEY) &&
            JSON.parse(
                localStorage.getItem(LOCAL_STORAGE_FAVORITE_TICKERS_KEY) || ""
            )) ||
            []
    );
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);

    const filterByMarketCap = useCallback(
        (stock: Stock) => {
            return minimumMarketCap
                ? stock.valormercado && stock.valormercado > minimumMarketCap
                : true;
        },
        [minimumMarketCap]
    );

    const filterByLiquidity = useCallback(
        (stock: Stock) => {
            return minimumLiquidity
                ? stock.liquidezmediadiaria &&
                      stock.liquidezmediadiaria > minimumLiquidity
                : true;
        },
        [minimumLiquidity]
    );

    const filterByYearsWithProfit = useCallback(
        (stock: Stock) => {
            const minimumYearsWithProfitAsNumber = Number(
                minimumYearsWithProfit
            );
            const profitableLastYears = stock?.historicalData?.["P/L"]?.series
                .slice(0, 0 + minimumYearsWithProfitAsNumber)
                .filter((year: any) => year?.value > 0);
            const alternativeProfitableLastYears = stock?.historicalData?.[
                "LPA"
            ]?.series
                .slice(0, 0 + minimumYearsWithProfitAsNumber)
                .filter((year: any) => year?.value > 0);
            return minimumYearsWithProfitAsNumber
                ? profitableLastYears?.length ===
                      minimumYearsWithProfitAsNumber ||
                      alternativeProfitableLastYears?.length ===
                          minimumYearsWithProfitAsNumber
                : true;
        },
        [minimumYearsWithProfit]
    );

    const updateFavoriteTickers = (
        ticker: string,
        action: "add" | "remove"
    ) => {
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

    const downdloadCsv = () => {
        const keys: StockKeys[] = headCells.map((cell) => cell.id);
        const jsonData = filteredStocks.map((stock) => {
            const obj: any = {};
            keys.forEach((key) => {
                obj[key] = stock[key];
            });
            return obj;
        });
        const csv = json2csv(jsonData);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ranking.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            {hideFilter || (
                <FilterPanel
                    minimumLiquidity={minimumLiquidity}
                    setMinimumLiquidity={setMinimumLiquidity}
                    minimumMarketCap={minimumMarketCap}
                    setMinimumMarketCap={setMinimumMarketCap}
                    minimumYearsWithProfit={minimumYearsWithProfit}
                    setMinimumYearsWithProfit={setMinimumYearsWithProfit}
                    hideYearsWithProfitFilter={hideYearsWithProfitFilter}
                    showDividendFilter={showDividendFilter}
                    lastYears={lastYears}
                    setLastYears={setLastYears}
                />
            )}
            {hideFavorites || (
                <Accordion sx={{ marginBottom: "16px" }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h6">
                            <StarIcon
                                sx={{
                                    verticalAlign: "sub",
                                    marginRight: "8px",
                                }}
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
                                        <TableCell>Top (%)</TableCell>
                                        <TableCell>Ativo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredStocks
                                        .filter((stock) =>
                                            favoriteTickers.includes(
                                                stock.ticker
                                            )
                                        )
                                        .map((stock) => (
                                            <TableRow key={stock.ticker}>
                                                <TableCell>
                                                    {`${
                                                        filteredStocks.findIndex(
                                                            (currStock) =>
                                                                currStock.ticker ===
                                                                stock.ticker
                                                        ) + 1
                                                    }º`}
                                                </TableCell>
                                                <TableCell>
                                                    {(
                                                        ((filteredStocks.findIndex(
                                                            (currStock) =>
                                                                currStock.ticker ===
                                                                stock.ticker
                                                        ) +
                                                            1) /
                                                            filteredStocks.length) *
                                                        100
                                                    ).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <a
                                                        href={`https://statusinvest.com.br/acoes/${stock.ticker}`}
                                                    >
                                                        {stock.ticker}
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}
            <Paper sx={{ padding: "16px" }}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography variant="h6" textAlign={"start"}>
                        <EmojiEventsIcon
                            sx={{ verticalAlign: "sub", marginRight: "8px" }}
                        />
                        Ranking:
                    </Typography>
                    <IconButton
                        aria-label="download"
                        onClick={downdloadCsv}
                        disabled={loading}
                    >
                        <FileDownloadIcon />
                    </IconButton>
                </Box>
                {loading ? (
                    <CircularProgress sx={{ color: "white" }} />
                ) : (
                    <CustomTable
                        rows={filteredStocks}
                        headCells={headCells}
                        initialOrderBy={initialOrderBy}
                        favoriteTickers={favoriteTickers}
                        updateFavoriteTickers={updateFavoriteTickers}
                    />
                )}
            </Paper>
        </>
    );
}
