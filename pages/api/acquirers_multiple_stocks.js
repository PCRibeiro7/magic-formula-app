const axios = require("axios");
import moment from "moment";
import { fetchAllStocks } from "services/statusInvest";
import { getHistoricalPrices } from "services/yahooFinance";

export default async function handler(req, res) {
  const stocks = await fetchAllStocks()
  const currentDate = moment().add(-7, "days").format("YYYY-MM-DD");
  const sixMonthsBeforeDate = moment().add(-6, "months").format("YYYY-MM-DD");

  let filteredStocks = stocks.filter((stock) => {
    return stock.eV_Ebit > 0;
  });

  let prices = await Promise.all(
    filteredStocks.map((stock) =>
      getHistoricalPrices({
        symbols: [`${stock.ticker}.SA`],
        from: sixMonthsBeforeDate,
        to: currentDate,
        period:'m'
      })
    )
  );
  prices = prices.reduce((acc, curr) => ({ ...curr, ...acc }), {});

  Object.keys(prices).map((ticker) => {
    const tickerKey = ticker.replace(".SA", "");
    const currentPrice = prices[ticker][0]?.close;
    const sixMonthsBeforePrice = prices[ticker][prices[ticker].length - 1]?.close;
    const stockMatch = filteredStocks.find(
      (currStock) => currStock.ticker === tickerKey
    );
    if (currentPrice && sixMonthsBeforePrice) {
      stockMatch.currentPrice = currentPrice;
      stockMatch.sixMonthsBeforePrice = sixMonthsBeforePrice;
      stockMatch.momentum6M =
        Math.round((currentPrice / sixMonthsBeforePrice - 1) * 10000) / 100;
    }
  });

  filteredStocks = filteredStocks.filter((stock) => {
    return stock.momentum6M;
  });
  const orderedByEV_EBIT = JSON.parse(JSON.stringify(filteredStocks)).sort(
    (a, b) => a.eV_Ebit - b.eV_Ebit
  );

  const orderedByMomentum = JSON.parse(JSON.stringify(filteredStocks)).sort(
    (a, b) => b.momentum6M - a.momentum6M
  );

  const mountedStocks = JSON.parse(JSON.stringify(filteredStocks))
    .map((company) => ({
      rank:
        orderedByMomentum.findIndex((c) => c.ticker === company.ticker) +
        orderedByEV_EBIT.findIndex((c) => c.ticker === company.ticker) +
        2,
      rank_EV_EBIT:
        orderedByEV_EBIT.findIndex((c) => c.ticker === company.ticker) + 1,
      rank_Momentum:
        orderedByMomentum.findIndex((c) => c.ticker === company.ticker) + 1,

      ...company,
    }))
    .sort((a, b) => a.rank - b.rank);
  res.status(200).json(mountedStocks);
}
