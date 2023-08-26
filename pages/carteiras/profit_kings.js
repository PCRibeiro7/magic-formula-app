import { fetchAllStocks } from "services/statusInvest";
import styles from "styles/Wallets.module.css";
import RankingPanel from "components/RankingPanel";
import { Stack } from "@mui/material";
import { WalletRules } from "components/WalletRules";
import supabase from "utils/supabase";

export async function getServerSideProps(context) {
    try {
        const stocks = await fetchAllStocks();

        const mostLliquidTickers = stocks.reduce((acc, stock) => {
            const alreadyExists = acc.find(
                (s) => s.ticker.slice(0, 4) === stock.ticker.slice(0, 4)
            );
            if (!alreadyExists) {
                acc = [...acc, stock];
                return acc;
            }
            if (stock.liquidezmediadiaria > alreadyExists.liquidezmediadiaria) {
                acc = [
                    ...acc.filter(
                        (s) => s.ticker.slice(0, 4) !== stock.ticker.slice(0, 4)
                    ),
                    stock,
                ];
                return acc;
            }
            return acc;
        }, []);

        const { data: profits } = await supabase.from("profit_kings").select();

        const stocksWithProfit = mostLliquidTickers.map((stock) => {
            const stockProfits = profits.find(
                (profit) => profit.ticker === stock.ticker
            );
            const yearsWithProfitCount = stockProfits.years_with_profit_count;
            const yearsWithProfitPercentage =
                Math.round(
                    (yearsWithProfitCount * 10000) / stockProfits.years_count
                ) / 100;

            const averageProfit = Math.round(stockProfits.average_profit);

            const stockWithProfits = {
                ...stock,
                profits: stockProfits,
                yearsWithProfitPercentage: yearsWithProfitPercentage,
                averageProfit: averageProfit,
                yearsCount: stockProfits.years_count,
                yearsWithProfitCount: stockProfits.years_with_profit_count,
            };
            return stockWithProfits;
        });

        const orderedByYearsWithProfitPercentage = JSON.parse(
            JSON.stringify(
                stocksWithProfit.map((stock) => stock.yearsWithProfitPercentage)
            ) // deep copy
        ).sort((a, b) => b - a);

        const orderedByAverageProfit = JSON.parse(
            JSON.stringify(
                stocksWithProfit.map((stock) => stock.averageProfit)
            ) // deep copy
        ).sort((a, b) => b - a);

        const orderedByYearsWithProfitCount = JSON.parse(
            JSON.stringify(
                stocksWithProfit.map((stock) => stock.yearsWithProfitCount)
            )
        ).sort((a, b) => b - a);

        const stocksWithRanking = JSON.parse(JSON.stringify(stocksWithProfit))
            .map((company) => ({
                rank:
                    orderedByYearsWithProfitPercentage.findIndex(
                        (p) => p === company.yearsWithProfitPercentage
                    ) +
                    orderedByAverageProfit.findIndex(
                        (c) => c === company.averageProfit
                    ) +
                    orderedByYearsWithProfitCount.findIndex(
                        (c) => c === company.yearsWithProfitCount   
                    ) +
                    1,
                ...company,
            }))
            .sort((a, b) => a.rank - b.rank);

        return {
            props: {
                stocks: stocksWithRanking,
            },
        };
    } catch (error) {
        console.log(error);
        return;
    }
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
        id: "rank",
        numeric: true,
        disablePadding: false,
        isOrdinal: true,
        label: "Rank Reis do Lucro",
    },
    {
        id: "yearsWithProfitPercentage",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "% Anos com Lucro",
    },
    {
        id: "yearsCount",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Anos com Lucro",
    },
    {
        id: "averageProfit",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Lucro Médio Anual",
    },
    {
        id: "ev_ebit",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "EV/EBIT",
    }
];

export default function ProfitKings({ stocks }) {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Carteira Reis do Lucro:</h1>
            </main>
            <Stack maxWidth={"800px"}>
                <WalletRules
                    ruleDescription={
                        <>
                            1 - Ranking de empresas{" "}
                            <strong>&quot;mais consistentes&quot; </strong>
                            :
                            <br />
                            Ordenamos empresas por maior percetual de{" "}
                            <strong>Anos com lucro</strong>.
                            <br />
                            <br />2 - Ranking de empresas{" "}
                            <strong>&quot;mais lucrativas&quot;</strong>:
                            <br />
                            Ordenamos empresas por maior{" "}
                            <strong>Lucro Médio Anual</strong>.
                            <br />
                            <br />3 - Ranking de empresas com{" "}
                            <strong>&quot;maior histórico de lucro&quot;</strong>:
                            <br />
                            Ordenamos empresas por maior{" "}
                            <strong>Quantidade de anos com lucro</strong>.
                            <br />
                            <br />4 - Ranking dos <strong>Reis do Lucro</strong>
                            :
                            <br />
                            Ordenamos empresas combinando maior{" "}
                            <strong>percentual de anos com lucro</strong>,{" "}
                            maior <strong>lucro médio anual</strong> e maior <strong>quantidade de anos</strong> com lucro.
                            <br />
                        </>
                    }
                />

                <RankingPanel
                    stocks={stocks}
                    headCells={headCells}
                    initialOrderBy={{ column: "rank", direction: "asc" }}
                    hideYearsWithProfitFilter={true}
                />
            </Stack>
        </div>
    );
}
