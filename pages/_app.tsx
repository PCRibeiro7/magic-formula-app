import { CssBaseline, ThemeProvider } from "@mui/material";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import theme from "@/utils/theme";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
                <NextNProgress color="gold" options={{ showSpinner: false }} />
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
}

export default MyApp;
