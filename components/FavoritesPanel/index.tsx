import { Paper, Typography } from "@mui/material";
import { useState } from "react";
import FavoritesTable from "@/components/FavoritesTable";
import StarIcon from "@mui/icons-material/Star";

export const LOCAL_STORAGE_FAVORITE_TICKERS_KEY = "favoriteTickers";

export default function FavoritesPanel({ stocks }) {
    const [favoriteTickers, setFavoriteTickers] = useState(
        (typeof window !== "undefined" &&
            JSON.parse(
                localStorage.getItem(LOCAL_STORAGE_FAVORITE_TICKERS_KEY)
            )) ||
            []
    );
    return (
        <>
            <Paper sx={{ padding: "16px" }}>
                <Typography variant="h6" textAlign={"start"}>
                    <StarIcon
                        sx={{ verticalAlign: "sub", marginRight: "8px" }}
                    />
                    Indicadores :
                </Typography>
                <FavoritesTable
                    rows={stocks.filter((stock) =>
                        favoriteTickers.includes(stock.Ticker)
                    )}
                    headCells={Object.keys(stocks[0])}
                />
            </Paper>
        </>
    );
}
