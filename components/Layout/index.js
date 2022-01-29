import Head from "next/head";
import CustomAppBar from "../CustomAppBar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Magic Formula</title>
        <meta
          name="description"
          content="Página para consulta das ações da fórmula magica"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CustomAppBar />
      <main>{children}</main>
    </>
  );
}
