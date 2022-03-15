import { Grid } from "@mui/material";
import HomePageCard from "components/HomePageCard";
import styles from "styles/Home.module.css";
import greenblattImage from "public/greenblatt.jpg";
import grahamImage from "public/graham.jpg";
import tobiasImage from "public/tobias-carlisle.jpg";
import decioImage from "public/decio-bazin.jpg";
import valuationImage from "public/valuation.png";

import { useRouter } from "next/router";

const cards = [
  {
    pagePath: "carteiras/magic_formula",
    image: greenblattImage,
    title: "Fórmula Mágica",
    description:
      "Ranking de ações baseado em um baixo EV/EBIT (empresas baratas) e um alto ROIC (empresas eficientes).",
    rules: [
      {
        direction: "high",
        indicator: "ROIC",
      },
      {
        direction: "low",
        indicator: "EV / EBIT",
      },
    ],
  },
  {
    pagePath: "carteiras/graham_wallet",
    image: grahamImage,
    title: "Carteira  Graham",
    description:
      "Ranking de ações baseado no preço justo de graham. Este preço é calculado em função do lucro e valor patrimonial da empresa.",
    rules: [
      {
        direction: "low",
        indicator: "P / VP",
      },
      {
        direction: "low",
        indicator: "P / L",
      },
    ],
  },
  {
    pagePath: "carteiras/acquirers_multiple",
    image: tobiasImage,
    title: "Carteira  Acquirers Multiple + Momentum",
    description:
      "Ranking de ações baseado em um baixo EV/EBIT (empresas baratas) e um alto Momentum de 6 Meses (empresas com tendência de alta).",
    rules: [
      {
        direction: "low",
        indicator: "EV /  EBIT",
      },
      {
        direction: "high",
        indicator: "Momentum de Preço",
      },
    ],
  },
  {
    pagePath: "carteiras/decio_basin",
    image: decioImage,
    title: "Carteira  de Dividendos Décio Basin",
    description:
      "Ranking baseado em ações pagadoras de dividendos.  Calculamos o preço teto assumindo um yield alvo de 6%.",
    rules: [
      {
        direction: "high",
        indicator: "Dividend Yield",
      },
    ],
  },
  {
    pagePath: "carteiras/preco_lucro",
    image: valuationImage,
    title: "Carteira  de P/L Abaixo da Média",
    description:
      "Ranking baseado em ações com indicador P/L atual abaixo da sua média histórica",
    rules: [
      {
        direction: "low",
        indicator: "P/L Atual",
      },
      {
        direction: "high",
        indicator: "P/L Médio Histórico",
      },
    ],
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteiras disponíveis:</h1>
      </main>
      <Grid container spacing={3} justifyContent={"center"}>
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
              subtext={card.rules}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
