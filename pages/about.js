import { Box } from "@mui/system";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import stonksImage from "../public/stonks.jpg";

export default function About() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Sobre:</h1>
      </main>
      <Box justifyContent={"center"} display={"flex"}>
        <Box textAlign="center" width={"80%"}>
          <p>
            Site para consulta de carteiras teóricas:
            <br />
          </p>
          <p>
            1ª - Fórmula Mágica - Joel Greenblatt
            <br />
            2ª - Preço Justo de Graham
            <br />
          </p>
          <p>
            Os tickers são rankeados com base nos dados dos 4 últimos trimestres
            disponíveis
          </p>
          <Image
            src={stonksImage}
            alt="stonks image"
          />
        </Box>
      </Box>
    </div>
  );
}
