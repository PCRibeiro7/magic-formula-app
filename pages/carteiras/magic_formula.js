import { fetchAllStocks } from "services/statusInvest";
import styles from "styles/Wallets.module.css";
import { filterByMagicFormula } from "utils/wallets";
import RankingPanel from "components/RankingPanel";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WalletRules } from "components/WalletRules";

export async function getServerSideProps(context) {
  const stocks = await fetchAllStocks();
  const stocksWithRanking = filterByMagicFormula(stocks);
  return {
    props: {
      stocks: stocksWithRanking,
    },
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
    id: "rank",
    numeric: true,
    disablePadding: false,
    isOrdinal: true,
    label: "Rank Fórmula Mágica",
  },
  {
    id: "eV_Ebit",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "EV/EBIT",
  },
  {
    id: "rank_EV_EBIT",
    numeric: true,
    disablePadding: false,
    isOrdinal: true,
    label: "Rank EV/EBIT",
  },
  {
    id: "roic",
    numeric: true,
    disablePadding: false,
    isOrdinal: false,
    label: "ROIC",
  },
  {
    id: "rank_ROIC",
    numeric: true,
    disablePadding: false,
    isOrdinal: true,
    label: "Rank ROIC",
  },
];

export default function MagicFormula({ stocks }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteira Fórmula Mágica:</h1>
      </main>
      <Stack maxWidth={"800px"}>
        <WalletRules
          ruleDescription={
            <>
              1 - Ranking de empresas <strong>" mais baratas"  </strong>:
              <br />
              Ordenamos empresas por menor <strong>EV/EBIT</strong>.
              <br />
              <br />2 - Ranking de empresas <strong>" mais eficientes" </strong>:
              <br />
              Ordenamos empresas por maior <strong>ROIC</strong>.
              <br />
              <br />3 - Ranking da <strong>fórmula magica</strong>:
              <br />
              Ordenamos empresas combinando menor <strong>EV/EBIT</strong> e
              maior <strong>ROIC</strong>.
              <br />
            </>
          }
        />
        <RankingPanel
          stocks={stocks}
          headCells={headCells}
          initialOrderBy={{ column: "rank", direction: "asc" }}
        />
      </Stack>
    </div>
  );
}
