import { fetchAllStocks } from "@/services/statusInvest";
import supabase from "@/utils/supabase";
import { getQuotesMomentumFromTimeAgo } from "@/services/quotesMomentum";
import { NextApiHandler } from "next";
import { Stock } from "@/types/stock";

const handler: NextApiHandler = async (_req, res) => {
    const stocks = await fetchAllStocks();
    // const stocks = (await fetchAllStocks()).slice(0,1)

    let filteredStocks = stocks.filter((stock) => {
        return (
            stock.ev_ebit &&
            stock.ev_ebit > 0 &&
            stock.liquidezmediadiaria &&
            stock.liquidezmediadiaria > 1000 &&
            stock.vpa > 0 &&
            stock.p_l > 0
        );
    });

    try {
        const quotesMomentum = await getQuotesMomentumFromTimeAgo("6m");

        if (!quotesMomentum) return res.status(200).json({ stocks: [] });

        quotesMomentum.forEach((tickerQuotes) => {
            const tickerKey = tickerQuotes.ticker;

            const sixMonthsBeforePrice = tickerQuotes.quote_past;

            const currentPrice = tickerQuotes.quote_current;

            const stockMatch = filteredStocks.find(
                (currStock) => currStock.ticker === tickerKey
            );
            if (!stockMatch) return;

            stockMatch.currentPrice = currentPrice;
            stockMatch.sixMonthsBeforePrice = sixMonthsBeforePrice;
            stockMatch.momentum6M =
                Math.round((currentPrice / sixMonthsBeforePrice - 1) * 10000) /
                100;
        });
    } catch (error) {
        console.log(error);
    }

    const { data: profits } = await supabase.from("profit_kings").select();

    if (!profits) return res.status(200).json({ stocks: [] });

    filteredStocks = filteredStocks
        .map((stock) => {
            const stockProfits = profits.find(
                (profit) => profit.ticker === stock.ticker
            );
            if (!stockProfits) return stock;
            const yearsWithProfitCount = stockProfits.years_with_profit_count;
            if (!yearsWithProfitCount) return stock;
            if (!stockProfits.years_count) return stock;
            const yearsWithProfitPercentage =
                Math.round(
                    (yearsWithProfitCount * 10000) / stockProfits.years_count
                ) / 100;

            const stockWithProfits = {
                ...stock,
                profits: stockProfits,
                yearsWithProfitPercentage: yearsWithProfitPercentage,
            };
            return stockWithProfits;
        })
        .filter((stock) => stock.profits);

    const orderedByev_ebit = JSON.parse(JSON.stringify(filteredStocks)).sort(
        (a: Stock, b: Stock) => (a.ev_ebit || 0) - (b.ev_ebit || 0)
    );

    const orderedByMomentum = JSON.parse(JSON.stringify(filteredStocks)).sort(
        (a: Stock, b: Stock) => (b.momentum6M || 0) - (a.momentum6M || 0)
    );

    const mountedStocks = JSON.parse(JSON.stringify(filteredStocks))
        .map((company: Stock) => ({
            rank:
                orderedByMomentum.findIndex(
                    (c: Stock) => c.ticker === company.ticker
                ) +
                orderedByev_ebit.findIndex(
                    (c: Stock) => c.ticker === company.ticker
                ) +
                2,
            rank_ev_ebit:
                orderedByev_ebit.findIndex(
                    (c: Stock) => c.ticker === company.ticker
                ) + 1,
            rank_Momentum_6M:
                orderedByMomentum.findIndex(
                    (c: Stock) => c.ticker === company.ticker
                ) + 1,

            ...company,
        }))
        .sort(
            (a: Stock & { rank: number }, b: Stock & { rank: number }) =>
                a.rank - b.rank
        );

    const response = {
        stocks: mountedStocks,
    };
    res.status(200).json(response);
};

export default handler;
