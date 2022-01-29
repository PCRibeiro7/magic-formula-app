import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import styles from "../styles/Home.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Sobre</h1>
      </main>
      <Box textAlign="center">
        <h2>
          App para consulta de empresas melhores rankeadas pelo critério da
          "Fórmula Mágica de Joel Greenblatt".
          <br />
          <br />
        </h2>

        <h2>
          Os tickers são rankeados com base nos dados dos 4 últimos trimestres
          disponíveis.
        </h2>
      </Box>
    </div>
  );
}
