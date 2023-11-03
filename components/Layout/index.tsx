import Head from "next/head";
import CustomAppBar from "@/components/CustomAppBar";
interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Head>
                <title>Carteiras Teóricas</title>
                <meta
                    name="description"
                    content="Página para consulta de carteiras teóricas"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <CustomAppBar />
            <main>{children}</main>
        </>
    );
}
