import yahooFinance from "yahoo-finance2";

export const getHistoricalPrices = async ({ symbol }) => {
    const result = await yahooFinance.historical(symbol, {
        period1: "1990-01-01",
    });
    return result;
};
