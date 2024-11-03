import { Stock } from "@/types/stock";

export const filterByMagicFormula = (stocks: Stock[]) => {
    const filteredStocks = stocks.filter((stock) => {
        if (!stock.ev_ebit || !stock.roic) {
            return false;
        }
        return stock.ev_ebit > 0 && stock.roic > 0;
    });

    const orderedByev_ebit: Stock[] = JSON.parse(
        JSON.stringify(filteredStocks)
    ).sort((a: Stock, b: Stock) => (a.ev_ebit || 0) - (b.ev_ebit || 0));
    const orderedByROIC: Stock[] = JSON.parse(
        JSON.stringify(filteredStocks)
    ).sort((a: Stock, b: Stock) => (b.roic || 0) - (a.roic || 0));

    return JSON.parse(JSON.stringify(filteredStocks))
        .map((company: Stock) => ({
            rank:
                orderedByev_ebit.findIndex((c) => c.ticker === company.ticker) +
                orderedByROIC.findIndex((c) => c.ticker === company.ticker) +
                2,
            rank_ev_ebit:
                orderedByev_ebit.findIndex((c) => c.ticker === company.ticker) +
                1,
            rank_ROIC:
                orderedByROIC.findIndex((c) => c.ticker === company.ticker) + 1,
            ...company,
        }))
        .sort(
            (a: Stock & { rank: number }, b: Stock & { rank: number }) =>
                a.rank - b.rank
        );
};

const getGrahamPrice = (stock: Stock) => {
    if (!stock.p_l || !stock.p_vp) return 0;
    const profitPerStock = stock.price / stock.p_l;
    const equityValuePerStock = stock.price / stock.p_vp;
    const grahamPrice = (22.5 * profitPerStock * equityValuePerStock) ** 0.5;
    return Math.floor(grahamPrice * 100) / 100;
};

export const filterByGraham = (stocks: Stock[]) => {
    const stocksWithGraham = stocks.map((stock) => {
        const graham_price = getGrahamPrice(stock);
        const graham_price_diff =
            Math.floor(((graham_price - stock.price) / graham_price) * 10000) /
            100;
        return {
            graham_price,
            graham_price_diff,
            ...stock,
        };
    });
    return stocksWithGraham
        .filter((stock) => {
            return (
                stock.p_vp &&
                stock.p_vp > 0 &&
                stock.p_l > 0 &&
                stock.graham_price_diff >= 0.2
            );
        })
        .sort((a, b) => b.graham_price_diff - a.graham_price_diff);
};

export const filterPositiveProfitStocks = (stocks: Stock[]) => {
    return stocks.filter((stock) => {
        return stock.p_l > 0 && stock.lpa > 0;
    });
};

export const checkIfTickerIsBestRanked = (ticker: string, stocks: Stock[]) => {
    const tickerIndex = stocks.findIndex((stock) => stock.ticker === ticker);

    const bestRankedTicker = stocks.findIndex(
        (stock) =>
            stock.ticker.replace(/[0-9]/g, "") === ticker.replace(/[0-9]/g, "")
    );
    return tickerIndex === bestRankedTicker;
};
