import { fetchAllStocks } from "services/statusInvest";
import { Api } from "services/bovespaApi.ts";

export default async function handler(req, res) {
    const stocks = await fetchAllStocks();

    let filteredStocks = stocks.filter((stock) => {
        return stock.eV_Ebit > 0 && stock.liquidezMediaDiaria > 1000;
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
            const sixMonthsBeforePrice =
                ticker?.historicalDataPrice?.[0]?.close;

            const currentPrice =
                ticker?.historicalDataPrice?.[
                    ticker.historicalDataPrice.length - 2
                ]?.close;
            const stockMatch = filteredStocks.find(
                (currStock) => currStock.ticker === tickerKey
            );
            stockMatch.historicalDataPrice = ticker.historicalDataPrice;
            if (currentPrice && sixMonthsBeforePrice) {
                stockMatch.currentPrice = Math.round(currentPrice*100)/100;
                stockMatch.sixMonthsBeforePrice = sixMonthsBeforePrice;
                stockMatch.momentum6M =
                    Math.round(
                        (currentPrice / sixMonthsBeforePrice - 1) * 10000
                    ) / 100;
            }
        });
    } catch (error) {
        console.log(error);
    }

    filteredStocks = filteredStocks.filter((stock) => {
        return stock.momentum6M;
    });

    const orderedByMomentum = JSON.parse(JSON.stringify(filteredStocks)).sort(
        (a, b) => b.momentum6M - a.momentum6M
    );

    const mountedStocks = JSON.parse(JSON.stringify(filteredStocks))
        .map((company) => ({
            rank:
                orderedByMomentum.findIndex(
                    (c) => c.ticker === company.ticker
                ) + 1,
            ...company,
        }))
        .sort((a, b) => a.rank - b.rank);

    const response = {
        stocks: mountedStocks,
        dates: {},
    };
    res.status(200).json(response);
}
