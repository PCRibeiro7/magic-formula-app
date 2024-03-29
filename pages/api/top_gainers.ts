import moment from "moment";
import { getQuotesMomentumFromTimeAgo } from "@/services/quotesMomentum";
import { fetchAllStocks } from "@/services/statusInvest";
import { NextApiRequest, NextApiResponse } from "next";
import { Stock } from "@/types/stock";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const yearsAgoParam = req.query.yearsAgo;
    const yearsAgo = Number(yearsAgoParam);

    const stocks = await fetchAllStocks();

    let filteredStocks = stocks.filter((stock) => {
        return stock.ev_ebit && stock.ev_ebit > 0;
    });

    let mountedStocks: Stock[] = [];

    try {
        const quotesMomentum = await getQuotesMomentumFromTimeAgo(yearsAgo);

        if (!quotesMomentum) return res.status(200).json({ stocks: [] });

        quotesMomentum.forEach((tickerQuotes) => {
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

            stock.pastPrice =
                Math.round(stock.historicalDataPrice.quote_past * 100) / 100;
            stock.momentum =
                Math.round(
                    (stock.price / stock.pastPrice - 1) * 10000
                ) / 100;
            stock.annualizedReturn =
                Math.round(
                    ((stock.price / stock.pastPrice) **
                        (1 / yearsAgo) -
                        1) *
                        10000
                ) / 100;
            return stock;
        });

        filteredStocks = filteredStocks
            .filter((stock) => stock)
            .filter((stock) => {
                return stock.pastPrice;
            });
        const orderedByMomentum = JSON.parse(
            JSON.stringify(filteredStocks)
        ).sort((a: Stock, b: Stock) => b.momentum - a.momentum);

        filteredStocks = JSON.parse(JSON.stringify(filteredStocks))
            .map((company: Stock) => ({
                rank:
                    orderedByMomentum.findIndex(
                        (c: Stock) => c.ticker === company.ticker
                    ) + 1,
                ...company,
            }))
            .sort(
                (a: Stock & { rank: number }, b: Stock & { rank: number }) =>
                    a.rank - b.rank
            );

        mountedStocks = filteredStocks;
    } catch (error) {
        console.log(error);
    }

    const response = {
        stocks: mountedStocks,
    };
    res.status(200).json(response);
}
