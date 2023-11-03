import yahooFinance from "yahoo-finance2";

type GetPriceParams = {
    symbol: string;
};

export const getHistoricalPrices = async ({ symbol }: GetPriceParams) => {
    try {
        const result = await yahooFinance.historical(symbol, {
            period1: "1990-01-01",
        });
        return { data: result };
    } catch (error) {
        return { error };
    }
};
