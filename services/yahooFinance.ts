const yahooFinance = require("yahoo-finance");

export const getHistoricalPrices = async ({ symbols, from, to, period }) => {
    const yahooPromise = new Promise((resolve, reject) => {
        yahooFinance.historical(
            {
                symbols,
                from,
                to,
                period,
            },
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
    const result = await yahooPromise;
    return result;
};

export const getMultipleHistoricalPrices = async ({
    symbols,
    from,
    to,
    period,
}) => {
    let prices = await Promise.all(
        symbols.map((symbol) =>
            getHistoricalPrices({
                symbols: [symbol],
                from,
                to,
                period,
            })
        )
    );
    prices = prices.reduce((acc, curr) => ({ ...curr, ...acc }), {});
    return prices;
};
