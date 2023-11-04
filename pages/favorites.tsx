import styles from "@/styles/Wallets.module.css";
import FavoritesPanel from "@/components/FavoritesPanel";
import { Stack } from "@mui/material";
import { fetchAllStocks } from "@/services/statusInvest";

export async function getServerSideProps() {
    try {
        const stocks = await fetchAllStocks();
        const formattedStocks = stocks.map((s) => ({
            ["Ticker"]: s.ticker || null,
            ["Preço"]: s.price || null,
            ["P/L"]: s.p_l || null,
            ["P/VP"]: s.p_vp || null,
            ["EV/EBIT"]: s.ev_ebit || null,
            ["Dividend Yield"]: s.dy || null,
            ["ROIC"]: s.roic || null,
            ["Market Cap"]: s.valormercado || null,
            ["Dívida Líquida/EBIT"]: s.dividaliquidaebit || null,
            ["P/EBIT"]: s.p_ebit || null,
            ["P/ATIVO"]: s.p_ativo || null,
            ["Margem Bruta"]: s.margembruta || null,
            ["Margem Ebit"]: s.margemebit || null,
            ["Margem Líquida"]: s.margemliquida || null,
            ["P/SR"]: s.p_sr || null,
            ["P/Capital Giro"]: s.p_capitalgiro || null,
            ["P/Ativo Circulante"]: s.p_ativocirculante || null,
            ["Giro Ativos"]: s.giroativos || null,
            ["ROE"]: s.roe || null,
            ["ROA"]: s.roa || null,
            ["Dívida Liq./Patrimônio Liq."]:
                s.dividaliquidapatrimonioliquido || null,
            ["PL/Ativo"]: s.pl_ativo || null,
            ["Passivo/Ativo"]: s.passivo_ativo || null,
            ["Líquidez Corrente"]: s.liquidezcorrente || null,
            ["PEG Ratio"]: s.peg_ratio || null,
            ["Receitas CAGR 5"]: s.receitas_cagr5 || null,
            ["Lucros CAGR 5"]: s.lucros_cagr5 || null,
            ["Líquidez Média Diária"]: s.liquidezmediadiaria || null,
            ["VPA"]: s.vpa || null,
            ["LPA"]: s.lpa || null,
        }));

        return {
            props: {
                stocks: formattedStocks,
            },
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export type FavoriteStocks = Awaited<
    ReturnType<typeof getServerSideProps>
>["props"]["stocks"];

export default function Favorites({ stocks }: { stocks: FavoriteStocks }) {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Favoritos: </h1>
            </main>
            <Stack maxWidth={"800px"}>
                <FavoritesPanel stocks={stocks} />
            </Stack>
        </div>
    );
}
