const axios = require("axios");
import moment from "moment";
import { fetchAllStocks } from "services/statusInvest";
import { getHistoricalPrices, getMultipleHistoricalPrices } from "services/yahooFinance";

export default async function handler(req, res) {
  const stocks = await fetchAllStocks();
  // const stocks = (await fetchAllStocks()).slice(0,1)

  const currentDate = moment().format("YYYY-MM-DD");
  const sixMonthsBeforeDate = moment().add(-6, "months").format("YYYY-MM-DD");

  let filteredStocks = stocks.filter((stock) => {
    return stock.eV_Ebit > 0 && stock.liquidezMediaDiaria > 1000;
  });
  let [prices] = await Promise.all([
    getHistoricalPrices({
      symbols: filteredStocks.map((stock) => `${stock.ticker}.SA`),
      from: sixMonthsBeforeDate,
      to: currentDate,
      period: "m",
    }),
  ]);
  Object.keys(prices).map((ticker, index) => {
    const tickerKey = ticker.replace(".SA", "");
    const currentPrice = prices[ticker][0]?.adjClose;
    const sixMonthsBeforePrice =
      prices[ticker][prices[ticker].length - 1]?.adjClose;
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
