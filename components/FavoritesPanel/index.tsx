import { Paper, Typography } from "@mui/material";
import FavoritesTable from "@/components/FavoritesTable";
import StarIcon from "@mui/icons-material/Star";
import { FavoriteStocks } from "@/pages/favorites";

export const LOCAL_STORAGE_FAVORITE_TICKERS_KEY = "favoriteTickers";

type Props = {
    stocks: FavoriteStocks;
};

export default function FavoritesPanel({ stocks }: Props) {
    const favoriteTickers =
        (typeof window !== "undefined" &&
            localStorage.getItem(LOCAL_STORAGE_FAVORITE_TICKERS_KEY) &&
            JSON.parse(
                localStorage.getItem(LOCAL_STORAGE_FAVORITE_TICKERS_KEY) || ""
            )) ||
        [];

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
