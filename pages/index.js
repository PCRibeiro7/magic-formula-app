import { Grid } from "@mui/material";
import HomePageCard from "components/HomePageCard";
import styles from "styles/Home.module.css";

import cards from '../utils/pages'

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Carteiras disponíveis:</h1>
      </main>
      <Grid container spacing={5} justifyContent={"center"}>
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
