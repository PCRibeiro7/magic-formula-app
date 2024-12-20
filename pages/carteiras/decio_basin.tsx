import { Stack } from "@mui/material";
import RankingPanel from "@/components/RankingPanel";
import { WalletRules } from "@/components/WalletRules";
import { useEffect, useState } from "react";
import {
    fetchAllStocks,
    fetchDividendData,
    fetchHistoricalData,
} from "@/services/statusInvest";
import styles from "@/styles/Wallets.module.css";
import { average } from "@/utils/math";
import { filterPositiveProfitStocks } from "@/utils/wallets";
import moment from "moment";
import { Stock } from "@/types/stock";
const INITIAL_LAST_YEARS = 3;
const CURRENT_YEAR = moment().year();
const TARGET_YIELD = 0.06;

export async function getServerSideProps() {
    const stocks = await fetchAllStocks();
    let stocksWithRanking = filterPositiveProfitStocks(stocks);

    const currStocksBatch = stocksWithRanking;
    const currHistoricalData = await Promise.all(
        currStocksBatch.map((stock: Stock) =>
            fetchHistoricalData({
                ticker: stock.ticker,
            })
        )
    );

    const historicalDataWithTicker = currHistoricalData.map(
        (companyData, index) => {
            return {
                ticker: stocksWithRanking[index].ticker,
                LPA: companyData.LPA,
                ["P/L"]: companyData["P/L"],
            };
        }
    );

    const historicalDividendData = (
        await Promise.all(
            stocksWithRanking.map((stock: Stock) =>
                fetchDividendData({ ticker: stock.ticker })
            )
        )
    ).reduce((acc, curr) => ({ ...acc, ...curr }), {});

    stocksWithRanking = stocksWithRanking
        .map((stock: Stock) => ({
            ...stock,
            historicalDividendData: historicalDividendData[stock.ticker],
            historicalData: historicalDataWithTicker.find(
                (historicalStock) => historicalStock.ticker === stock.ticker
            ),
        }))
        .filter(
            (stock: Stock & { historicalDividendData: any }) =>
                stock.historicalDividendData.assetEarningsYearlyModels
        );

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
        id: "basinPriceDiff",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Margem de Basin (%)",
    },
    {
        id: "price",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Cotação Atual (R$)",
    },
    {
        id: "averageYield",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Yield Médio (R$)",
    },
    {
        id: "basinPrice",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Preço Basin  (R$)",
    },
];

type DecioBasinWalletStocks = Stock & {
    historicalDividendData: any;
    averageYield: number;
    basinPrice: number;
    basinPriceDiff: number;
};

export default function DecioBasinWallet({
    stocks,
}: {
    stocks: DecioBasinWalletStocks[];
}) {
    const [lastYears, setLastYears] = useState(INITIAL_LAST_YEARS);
    const [filteredStocks, setFilteredStocks] = useState(stocks);
    useEffect(() => {
        const newStocks = stocks
            .filter((stock) => {
                return (
                    stock.historicalDividendData.assetEarningsYearlyModels.filter(
                        (year: { rank: number; value: number }) =>
                            year.rank < CURRENT_YEAR &&
                            year.rank >= CURRENT_YEAR - lastYears &&
                            year.value > 0
                    ).length === lastYears
                );
            })
            .map((stock) => {
                const yields =
                    stock.historicalDividendData.assetEarningsYearlyModels
                        .filter(
                            (year: { rank: number }) =>
                                year.rank < CURRENT_YEAR &&
                                year.rank >= CURRENT_YEAR - lastYears
                        )
                        .map((year: { value: any }) => year.value);

                stock.averageYield = average(yields);
                stock.basinPrice =
                    Math.round((stock.averageYield / TARGET_YIELD) * 100) / 100;
                stock.basinPriceDiff =
                    Math.floor(
                        ((stock.basinPrice - stock.price) / stock.basinPrice) *
                            10000
                    ) / 100;

                return stock;
            });
        setFilteredStocks(newStocks);
    }, [lastYears, stocks]);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Carteira Décio Basin:</h1>
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
                            2 - Ter dividend yield atual maior que 6%.
                            <br />
                            <br />
                            3 - Calculamos o preço teto de Basin a partir do
                            yield médio histórico dividido por 6%.
                            <br />
                            <br />4 - Criamos o ranking considerando as ações{" "}
                            <strong>mais descontadas</strong> em relação ao{" "}
                            <strong>preço teto de Basin</strong>.
                        </>
                    }
                />
                <RankingPanel
                    stocks={filteredStocks}
                    headCells={headCells}
                    initialOrderBy={{
                        column: "basinPriceDiff",
                        direction: "desc",
                    }}
                    hideYearsWithProfitFilter
                    showDividendFilter
                    lastYears={lastYears}
                    setLastYears={setLastYears}
                    loading={false}
                />
            </Stack>
        </div>
    );
}
