import styles from "@/styles/Wallets.module.css";
import RankingPanel from "@/components/RankingPanel";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { WalletRules } from "@/components/WalletRules";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import React from "react";

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

const availablePeriods = [...Array(23).keys()].map((i) => i + 1);

export default function AcquirersMultiple() {
    const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(10);
    const [filteredStocks, setFilteredStocks] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/top_gainers?yearsAgo=${selectedPeriod}`);
        const { stocks } = await res.json();

        const sixMonthHeadCell = headCells.find(
            (cell) => cell.id === "sixMonthsBeforePrice"
        );
        if (sixMonthHeadCell) {
            sixMonthHeadCell.label = `Preço ${selectedPeriod} ${
                selectedPeriod === 1 ? "ano" : "anos"
            } atrás`;
        }

        setFilteredStocks(stocks);
        setLoading(false);
    }, [selectedPeriod]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Carteira Valorização Passada: </h1>
            </main>
            <Stack maxWidth={"800px"}>
                <WalletRules
                    ruleDescription={
                        <>
                            1 - Ranking de empresas{" "}
                            <strong>que mais valorizaram </strong>
                            nos ulimos anos selecionados{" "}
                        </>
                    }
                />
                <Box sx={{ padding: "16px", paddingTop: "0px" }}>
                    <Typography variant="h6" sx={{ padding: "8px" }}>
                        Anos Passados:
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Anos
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedPeriod}
                            label="Age"
                            onChange={(e) =>
                                setSelectedPeriod(Number(e.target.value))
                            }
                        >
                            {availablePeriods.map((period: number, index) => {
                                return (
                                    <MenuItem value={period} key={period}>
                                        {period} {index === 0 ? "ano" : "anos"}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Box>

                <RankingPanel
                    stocks={filteredStocks}
                    headCells={headCells}
                    initialOrderBy={{ column: "momentum6M", direction: "desc" }}
                    hideYearsWithProfitFilter={true}
                    loading={loading}
                    hideFavorites
                    hideFilter
                    showDividendFilter={undefined}
                    lastYears={undefined}
                    setLastYears={undefined}
                />
            </Stack>
        </div>
    );
}
