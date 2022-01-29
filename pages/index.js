import { Grid } from "@mui/material";
import HomePageCard from "../components/HomePageCard";
import styles from "../styles/Home.module.css";
import greenblattImage from "../public/greenblatt.jpg";
import grahamImage from "../public/graham.jpg";
import { useRouter } from 'next/router'

const cards = [
  {
    pagePath: '/magic_formula',
    image: greenblattImage,
    title: "Fórmula Mágica",
    description:
      'Ranking de ações baseados em um baixo EV/EBIT (empresas baratas) e um alto ROIC (empresas eficientes).',
  },
  {
    pagePath: '/graham_wallet',
    image: grahamImage,
    title: "Carteira  Graham",
    description:
      'Ranking de ações baseados no preço justo de graham. Este preço se baseia no lucro e valor patrimonial da empresa.',
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteiras disponíveis</h1>
      </main>
      <Grid container spacing={2} justifyContent={"center"}>
        {cards.map((card) => (
          <Grid
            item
            key={card.tile}
            onClick={() => router.push(card.pagePath)}
            sx={{ cursor: 'pointer' }}
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
