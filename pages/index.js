import { Grid } from "@mui/material";
import HomePageCard from "components/HomePageCard";
import styles from "styles/Home.module.css";
import greenblattImage from "public/greenblatt.jpg";
import grahamImage from "public/graham.jpg";
import tobiasImage from "public/tobias-carlisle.jpg";
import decioImage from "public/decio-bazin.jpg";

import { useRouter } from "next/router";

const cards = [
  {
    pagePath: "carteiras/magic_formula",
    image: greenblattImage,
    title: "Fórmula Mágica",
    description:
      "Ranking de ações baseado em um baixo EV/EBIT (empresas baratas) e um alto ROIC (empresas eficientes).",
  },
  {
    pagePath: "carteiras/graham_wallet",
    image: grahamImage,
    title: "Carteira  Graham",
    description:
      "Ranking de ações baseado no preço justo de graham. Este preço é calculado em função do lucro e valor patrimonial da empresa.",
  },
  {
    pagePath: "carteiras/acquirers_multiple",
    image: tobiasImage,
    title: "Carteira  Acquirers Multiple + Momentum",
    description:
      "Ranking de ações baseado em um baixo EV/EBIT (empresas baratas) e um alto Momentum de 6 Meses (empresas com tendência de alta).",
  },
  {
    pagePath: "carteiras/decio_basin",
    image: decioImage,
    title: "Carteira  de Dividendos Décio Basin",
    description:
      "Ranking de ações baseado em ações pagadoras de dividendos.  Calculamos o preço teto assumindo um yield alvo de 6%.",
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteiras disponíveis:</h1>
      </main>
      <Grid container spacing={2} justifyContent={"center"}>
        {cards.map((card) => (
          <Grid
            item
            key={card.title}
            onClick={() => router.push(card.pagePath)}
            sx={{ cursor: "pointer" }}
          >
            <HomePageCard
              image={card.image}
              title={card.title}
              description={card.description}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
