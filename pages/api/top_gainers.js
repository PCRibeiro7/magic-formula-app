import { fetchAllStocks } from "services/statusInvest";
import { Api } from "services/bovespaApi.ts";

export default async function handler(req, res) {
    const stocks = await fetchAllStocks();

    let filteredStocks = stocks.filter((stock) => {
        return stock.ev_ebit > 0 && stock.liquidezmediadiaria > 1000;
    });
    const bovespaApi = new Api().api;

    try {
        const { data } = await bovespaApi.quoteDetail(
            filteredStocks.map((stock) => `${stock.ticker}`),
            {
                range: '10y',
                interval: "3mo",
            }
        );

        data.results.forEach((ticker, index) => {
            ticker.historicalDataPrice = ticker?.historicalDataPrice?.sort(
                (a, b) => a.date - b.date
            );

            const tickerKey = ticker.symbol;

            const stockMatch = filteredStocks.find(
                (currStock) => currStock.ticker === tickerKey
            );
            stockMatch.historicalDataPrice = ticker.historicalDataPrice;
        });
    } catch (error) {
        console.log(error);
    }

    filteredStocks = filteredStocks.filter((stock) => {
        return stock.historicalDataPrice;
    });

    const response = {
        stocks: filteredStocks,
        dates: {},
    };
    res.status(200).json(response);
}
