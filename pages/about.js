import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import styles from "../styles/Home.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Sobre</h1>
      </main>
      <Box justifyContent={"center"} display={"flex"}>
        <Box textAlign="center" width={"70%"}>
          <h3>
            App para consulta de carteiras teóricas:
            <br />
          </h3>
          <h3>
            1ª - Fórmula Mágica - Joel Greenblatt
            <br />
            2ª - Preço Justo de Graham
            <br />
          </h3>
          <h3>
            Os tickers são rankeados com base nos dados dos 4 últimos trimestres
            disponíveis
          </h3>
        </Box>
      </Box>
    </div>
  );
}
