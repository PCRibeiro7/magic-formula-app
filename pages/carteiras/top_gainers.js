import styles from "styles/Wallets.module.css";
import RankingPanel from "components/RankingPanel";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { WalletRules } from "components/WalletRules";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import moment from "moment";

const headCells = [
    {
        id: "ticker",
        numeric: false,
        disablePadding: false,
        isOrdinal: false,
        label: "Ticker",
    },
    {
        id: "momentum6M",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Valorização(%)",
    },
    {
        id: "annualizedReturn",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Retorno Anualizado(%)",
    },
    {
        id: "sixMonthsBeforePrice",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Preço Passado",
    },
    {
        id: "price",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Preço Atual",
    },
];

const availablePeriods = [...Array(10).keys()].map((i) => i + 1);

export default function AcquirersMultiple() {
    const [stocks, setStocks] = useState([]);
    const [dates, setDates] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(10);
    const [filteredStocks, setFilteredStocks] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/top_gainers`);
        const { stocks: stocksWithRanking, dates } = await res.json();

        setStocks(stocksWithRanking);
        setDates(dates);
        setLoading(false);
    }, []);

    useEffect(() => {
        const desiredYear = moment().subtract(selectedPeriod, "years");
        let filteredStocks = [...stocks].map((stock) => {
            const matchedDate = stock.historicalDataPrice.find(dateObj => {
                return moment.unix(dateObj.date).isSame(desiredYear, "year");
            });
            if (!matchedDate) {
                return null;
            }       
            console.log('dale')
            stock.sixMonthsBeforePrice = Math.round(matchedDate?.adjustedClose*100)/100;
            stock.momentum6M =
                Math.round((stock.price / stock.sixMonthsBeforePrice - 1) * 10000) /
                100;
            stock.annualizedReturn = Math.round(((stock.price/stock.sixMonthsBeforePrice)**(1/selectedPeriod)-1)*10000)/100;
            return stock;
        });

        filteredStocks = filteredStocks.filter(stock=>stock).filter((stock) => {
            return stock.sixMonthsBeforePrice ;
        });
        console.log(filteredStocks)
        const orderedByMomentum = JSON.parse(JSON.stringify(filteredStocks)).sort(
            (a, b) => b.momentum6M - a.momentum6M
        );
    
        const mountedStocks = JSON.parse(JSON.stringify(filteredStocks))
            .map((company) => ({
                rank:
                    orderedByMomentum.findIndex(
                        (c) => c.ticker === company.ticker
                    ) + 1,
                ...company,
            }))
            .sort((a, b) => a.rank - b.rank);
        console.log(mountedStocks)
        setFilteredStocks(mountedStocks);
        headCells.find((cell) => cell.id === "sixMonthsBeforePrice").label = `Preço ${selectedPeriod} ${selectedPeriod===1?'ano':'anos'} atrás`;
    }, [selectedPeriod, stocks]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Carteira Valorização Passada:{" "}
                </h1>
            </main>
            <Stack maxWidth={"800px"}>
                <WalletRules
                    ruleDescription={
                        <>
                            1 - Ranking de empresas{" "}
                            <strong>&quot;mais baratas&quot; </strong>
                            :
                            <br />
                            Ordenamos empresas por menor{" "}
                            <strong>EV/EBIT</strong>.
                            <br />
                            <br />2 - Ranking de empresas{" "}
                            <strong>&quot;em tendencia de alta&quot;</strong>:
                            <br />
                            Ordenamos empresas por maior{" "}
                            <strong>momentum de 6 meses</strong>.
                            <br />
                            <br />3 - Ranking{" "}
                            <strong>Acquirers Multiple + Momentum</strong>:
                            <br />
                            Ordenamos empresas combinando menor{" "}
                            <strong>EV/EBIT</strong> e maior{" "}
                            <strong>momentum</strong>.
                            <br />
                        </>
                    }
                />
                <Box sx={{padding:'16px',paddingTop:'0px'}}>
                    <Typography variant="h6" sx={{padding:'8px'}}>Anos Passados:</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Anos
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedPeriod}
                            label="Age"
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            {availablePeriods.map((period,index) => {
                                return (
                                    <MenuItem value={period} key={period}>
                                        {period} {index===0?'ano':'anos'}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Box>

                <RankingPanel
                    stocks={filteredStocks}
                    headCells={headCells}
                    initialOrderBy={{ column: "rank", direction: "desc" }}
                    hideYearsWithProfitFilter={true}
                    loading={loading}
                    hideFavorites
                    hideFilter
                />
            </Stack>
        </div>
    );
}
