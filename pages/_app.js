import { CssBaseline, ThemeProvider } from "@mui/material";
import Layout from "@/components/Layout";
import "styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import * as gtag from "@/services/gtag";
import Analytics from "@/components/Analytics";
import theme from "@/utils/theme";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <NextNProgress color="gold" options={{ showSpinner: false }} />
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
