const yahooFinance = require("yahoo-finance");

export const getHistoricalPrices = async ({ symbols, from, to,period }) => {
  const yahooPromise = new Promise((resolve, reject) => {
    yahooFinance.historical(
      {
        symbols,
        from,
        to,
        period
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
