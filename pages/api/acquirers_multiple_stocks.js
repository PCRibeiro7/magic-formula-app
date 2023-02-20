import { fetchAllStocks } from "services/statusInvest";
import { Api } from 'services/bovespaApi.ts';

export default async function handler(req, res) {
    let sixMonthsBeforeDateEpoch, threeMonthsBeforeDateEpoch;

    const stocks = await fetchAllStocks();
    // const stocks = (await fetchAllStocks()).slice(0,1)

    let filteredStocks = stocks.filter((stock) => {
        return stock.eV_Ebit > 0 && stock.liquidezMediaDiaria > 1000;
    });
    const bovespaApi = new Api().api;

    try {
        const { data } = await bovespaApi.quoteDetail(
            filteredStocks.map((stock) => `${stock.ticker}`),
            {
                range: '6mo',
                interval: '1mo',
            }
        );

        data.results.map((ticker, index) => {
            ticker.historicalDataPrice = ticker?.historicalDataPrice?.sort((a, b) => a.date - b.date);
            if(!sixMonthsBeforeDateEpoch) sixMonthsBeforeDateEpoch = ticker?.historicalDataPrice?.[1]?.date;
            if(!threeMonthsBeforeDateEpoch) threeMonthsBeforeDateEpoch = ticker?.historicalDataPrice?.[4]?.date;

            const tickerKey = ticker.symbol;
            const sixMonthsBeforePrice = ticker?.historicalDataPrice?.[1]?.close;

            const threeMonthsBeforePrice = ticker?.historicalDataPrice?.[4]?.close;
    
            const currentPrice = ticker?.historicalDataPrice?.[ticker.historicalDataPrice.length - 1]?.close;
            const stockMatch = filteredStocks.find(
                (currStock) => currStock.ticker === tickerKey
            );
            if (currentPrice && sixMonthsBeforePrice) {
                stockMatch.currentPrice = currentPrice;
                stockMatch.sixMonthsBeforePrice = sixMonthsBeforePrice;
                stockMatch.threeMonthsBeforePrice = threeMonthsBeforePrice;
                stockMatch.momentum6M =
                    Math.round((currentPrice / sixMonthsBeforePrice - 1) * 10000) / 100;
                stockMatch.momentum3M =
                    Math.round((currentPrice / threeMonthsBeforePrice - 1) * 10000) / 100;
            }
        });
    } catch (error) {
        console.log(error)
    }

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
            rank_Momentum_6M:
                orderedByMomentum.findIndex((c) => c.ticker === company.ticker) + 1,

            ...company,
        }))
        .sort((a, b) => a.rank - b.rank);

    const response = {
        stocks: mountedStocks, 
        dates: {
            sixMonths: sixMonthsBeforeDateEpoch,
            threeMonths: threeMonthsBeforeDateEpoch,            
        }
    }
    res.status(200).json(response);
}
