import { Stack } from "@mui/material";
import RankingPanel from "@/components/RankingPanel";
import { WalletRules } from "@/components/WalletRules";
import { useEffect, useState } from "react";
import styles from "@/styles/Wallets.module.css";
import { average, median } from "@/utils/math";

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
        id: "averagePL",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "P/L Médio Histórico",
    },
    {
        id: "p_l",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "P/L Atual",
    },
    {
        id: "plDiff",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Margem P/L (%)",
    },
    {
        id: "shillerPL",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Shiller P/L",
    },
];

export default function GrahamWallet() {
    const [lastYears, setLastYears] = useState(INITIAL_LAST_YEARS);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchData = async () => {
        setLoading(true);
        const res = await fetch(`/api/price_earning_stocks`);
        const stocksWithRanking = await res.json();
        setStocks(stocksWithRanking);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const newStocks = stocks
            .map((stock) => ({
                ...stock,
                p_l: Math.round(stock.p_l * 100) / 100,
                shillerPL:
                    Math.round(
                        ((stock.price * lastYears) /
                            stock.historicalData["LPA"].series
                                .slice(1, 1 + lastYears)
                                .map((year) => year.value)
                                .reduce((acc, curr) => acc + curr, 0)) *
                            100
                    ) / 100,
                averagePL:
                    Math.round(
                        Math.min(
                            median(
                                stock.historicalData["P/L"].series
                                    .slice(1, 1 + lastYears)
                                    .map((year) => year.value)
                            ),
                            average(
                                stock.historicalData["P/L"].series
                                    .slice(1, 1 + lastYears)
                                    .map((year) => year.value)
                            )
                        ) * 100
                    ) / 100,
            }))
            .map((stock) => ({
                ...stock,
                plDiff:
                    Math.round((1 - stock.p_l / stock.averagePL) * 10000) / 100,
            }))
            .filter(
                (stock) =>
                    stock.p_l > 0 &&
                    stock.averagePL > 0 &&
                    stock.historicalData["P/L"].series.length > 1 + lastYears
            );
        setFilteredStocks(newStocks);
    }, [lastYears, stocks]);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Carteira P/L Abaixo da Média:</h1>
            </main>
            <Stack maxWidth={"800px"}>
                <WalletRules
                    ruleDescription={
                        <>
                            <br />
                            1 - Ter Lucro por ação maior que zero, isto é, a
                            empresa não pode estar com prejuízo atualmente.
                            <br />
                            <br />
                            2 - Calculamos o P/L Médio dos últimos x anos. Esse
                            P/L calculado é o menor entre a média e a mediana
                            históricas.
                            <br />
                            <br />3 - Criamos o ranking considerando as ações{" "}
                            <strong>mais descontadas</strong> em relação ao{" "}
                            <strong>P/L médio</strong>.
                        </>
                    }
                />
                <RankingPanel
                    stocks={filteredStocks}
                    headCells={headCells}
                    initialOrderBy={{ column: "plDiff", direction: "desc" }}
                    showDividendFilter
                    hideYearsWithProfitFilter
                    lastYears={lastYears}
                    setLastYears={setLastYears}
                    loading={loading}
                />
            </Stack>
        </div>
    );
}
