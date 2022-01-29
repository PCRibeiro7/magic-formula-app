import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import styles from "../styles/Home.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Sobre:</h1>
      </main>
      <Box justifyContent={"center"} display={"flex"}>
        <Box textAlign="center" width={"80%"}>
          <body>
            Site para consulta de carteiras teóricas:
            <br />
            <br />
          </body>
          <body>
            1ª - Fórmula Mágica - Joel Greenblatt
            <br />
            2ª - Preço Justo de Graham
            <br />
            <br />
          </body>
          <body>
            Os tickers são rankeados com base nos dados dos 4 últimos trimestres
            disponíveis
          </body>
        </Box>
      </Box>
    </div>
  );
}
