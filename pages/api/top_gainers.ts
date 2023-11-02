import moment from "moment";
import { getQuotesMomentumFromTimeAgo } from "@/services/quotesMomentum";
import { fetchAllStocks } from "@/services/statusInvest";

export default async function handler(req, res) {
    const yearsAgoParam = req.query.yearsAgo;
    const yearsAgo = Number(yearsAgoParam);

    const stocks = await fetchAllStocks();

    let filteredStocks = stocks.filter((stock) => {
        return stock.ev_ebit > 0;
    });

    let mountedStocks = [];

    try {
        const quotesMomentum = await getQuotesMomentumFromTimeAgo(yearsAgo);

        quotesMomentum.forEach((tickerQuotes, index) => {
            const tickerKey = tickerQuotes.ticker;

            const stockMatch = filteredStocks.find(
                (currStock) => currStock.ticker === tickerKey
            );
            if (!stockMatch) {
                return;
            }
            stockMatch.historicalDataPrice = tickerQuotes;
        });
        filteredStocks = filteredStocks.filter(
            (stock) => stock.historicalDataPrice
        );

        filteredStocks = [...filteredStocks].map((stock) => {
            const pastYear = moment().subtract(yearsAgo, "year");
            const quoteYear = moment(stock.historicalDataPrice.date_past);

            if (!quoteYear.isSame(pastYear, "year")) {
                return stock;
            }

            stock.sixMonthsBeforePrice =
                Math.round(stock.historicalDataPrice.quote_past * 100) / 100;
            stock.momentum6M =
                Math.round(
                    (stock.price / stock.sixMonthsBeforePrice - 1) * 10000
                ) / 100;
            stock.annualizedReturn =
                Math.round(
                    ((stock.price / stock.sixMonthsBeforePrice) **
                        (1 / yearsAgo) -
                        1) *
                        10000
                ) / 100;
            return stock;
        });

        filteredStocks = filteredStocks
            .filter((stock) => stock)
            .filter((stock) => {
                return stock.sixMonthsBeforePrice;
            });
        const orderedByMomentum = JSON.parse(
            JSON.stringify(filteredStocks)
        ).sort((a, b) => b.momentum6M - a.momentum6M);

        filteredStocks = JSON.parse(JSON.stringify(filteredStocks))
            .map((company) => ({
                rank:
                    orderedByMomentum.findIndex(
                        (c) => c.ticker === company.ticker
                    ) + 1,
                ...company,
            }))
            .sort((a, b) => a.rank - b.rank);

        mountedStocks = filteredStocks;
    } catch (error) {
        console.log(error);
    }

    const response = {
        stocks: mountedStocks,
        dates: {},
    };
    res.status(200).json(response);
}
