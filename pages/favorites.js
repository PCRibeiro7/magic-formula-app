
import styles from "styles/Wallets.module.css";
import FavoritesPanel from "components/FavoritesPanel";
import { Stack } from "@mui/material";
import { fetchAllStocks } from "services/statusInvest";


export async function getServerSideProps(context) {
  try {
    const stocks = await fetchAllStocks();
    const formattedStocks = stocks.map((s) => ({
      ["Ticker"]: s.ticker || null,
      ["Preço"]: s.price || null,
      ["P/L"]: s.p_L || null,
      ["P/VP"]: s.p_VP || null,
      ["EV/EBIT"]: s.eV_Ebit || null,
      ["Dividend Yield"]: s.dy || null,
      ["ROIC"]: s.roic || null,
      ["Market Cap"]: s.valorMercado || null,
      ["Dívida Líquida/EBIT"]: s.dividaLiquidaEbit || null,
      ["P/EBIT"]: s.p_Ebit || null,
      ["P/ATIVO"]: s.p_Ativo || null,
      ["Margem Bruta"]: s.margemBruta || null,
      ["Margem Ebit"]: s.margemEbit || null,
      ["Margem Líquida"]: s.margemLiquida || null,
      ["P/SR"]: s.p_SR || null,
      ["P/Capital Giro"]: s.p_CapitalGiro || null,
      ["P/Ativo Circulante"]: s.p_AtivoCirculante || null,
      ["Giro Ativos"]: s.giroAtivos || null,
      ["ROE"]: s.roe || null,
      ["ROA"]: s.roa || null,
      ["Dívida Liq./Patrimônio Liq."]: s.dividaliquidaPatrimonioLiquido || null,
      ["PL/Ativo"]: s.pl_Ativo || null,
      ["Passivo/Ativo"]: s.passivo_Ativo || null,
      ["Líquidez Corrente"]: s.liquidezCorrente || null,
      ["PEG Ratio"]: s.peg_Ratio || null,
      ["Receitas CAGR 5"]: s.receitas_Cagr5 || null,
      ["Lucros CAGR 5"]: s.lucros_Cagr5 || null,
      ["Líquidez Média Diária"]: s.liquidezMediaDiaria || null,
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
    return;
  }
}

export default function Favorites({ stocks }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Favoritos: </h1>
      </main>
      <Stack maxWidth={"800px"}>
        <FavoritesPanel
          stocks={stocks}
        />
      </Stack>
    </div>
  );
}
