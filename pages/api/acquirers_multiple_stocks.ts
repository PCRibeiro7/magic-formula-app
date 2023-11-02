import { fetchAllStocks } from "services/statusInvest";
import supabase from "utils/supabase";
import { getQuotesMomentumFromTimeAgo } from "services/quotesMomentum";

export default async function handler(req, res) {
    let sixMonthsBeforeDateEpoch, threeMonthsBeforeDateEpoch;

    const stocks = await fetchAllStocks();
    // const stocks = (await fetchAllStocks()).slice(0,1)

    let filteredStocks = stocks.filter((stock) => {
        return (
            stock.ev_ebit > 0 &&
            stock.liquidezmediadiaria > 1000 &&
            stock.vpa > 0 &&
            stock.p_l > 0
        );
    });

    try {
        const quotesMomentum = await getQuotesMomentumFromTimeAgo("6m");

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

    filteredStocks = filteredStocks.map((stock) => {
        const stockProfits = profits.find(
            (profit) => profit.ticker === stock.ticker
        );
        if (!stockProfits) return stock;
        const yearsWithProfitCount = stockProfits.years_with_profit_count;
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
    }).filter(stock => stock.profits);

    const orderedByev_ebit = JSON.parse(JSON.stringify(filteredStocks)).sort(
        (a, b) => a.ev_ebit - b.ev_ebit
    );

    const orderedByMomentum = JSON.parse(JSON.stringify(filteredStocks)).sort(
        (a, b) => b.momentum6M - a.momentum6M
    );

    const mountedStocks = JSON.parse(JSON.stringify(filteredStocks))
        .map((company) => ({
            rank:
                orderedByMomentum.findIndex(
                    (c) => c.ticker === company.ticker
                ) +
                orderedByev_ebit.findIndex((c) => c.ticker === company.ticker) +
                2,
            rank_ev_ebit:
                orderedByev_ebit.findIndex((c) => c.ticker === company.ticker) +
                1,
            rank_Momentum_6M:
                orderedByMomentum.findIndex(
                    (c) => c.ticker === company.ticker
                ) + 1,

            ...company,
        }))
        .sort((a, b) => a.rank - b.rank);

    const response = {
        stocks: mountedStocks,
        dates: {
            sixMonths: sixMonthsBeforeDateEpoch,
            threeMonths: threeMonthsBeforeDateEpoch,
        },
    };
    res.status(200).json(response);
}
