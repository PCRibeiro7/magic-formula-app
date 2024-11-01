import styles from "@/styles/Wallets.module.css";
import RankingPanel from "@/components/RankingPanel";
import { Stack } from "@mui/material";
import { WalletRules } from "@/components/WalletRules";
import { useCallback, useEffect, useState } from "react";

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
        label: "Rank AM + Momentum 6M",
    },
    {
        id: "ev_ebit",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "EV/EBIT",
    },
    {
        id: "momentum",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Momentum 6M (%)",
    },
    {
        id: "yearsWithProfitPercentage",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "% Anos com Lucro",
    },
];

export default function AcquirersMultiple() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/acquirers_multiple_stocks`);
        const { stocks: stocksWithRanking } = await res.json();

        setStocks(stocksWithRanking);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Carteira Acquirers Multiple + Momentum:{" "}
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

                <RankingPanel
                    stocks={stocks}
                    headCells={headCells}
                    initialOrderBy={{ column: "rank", direction: "asc" }}
                    hideYearsWithProfitFilter={true}
                    loading={loading}
                    showDividendFilter={false}
                />
            </Stack>
        </div>
    );
}
