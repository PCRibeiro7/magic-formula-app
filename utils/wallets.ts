export const filterByMagicFormula = (stocks) => {
    const filteredStocks = stocks.filter((stock) => {
        return stock.ev_ebit > 0 && stock.roic > 0;
    });

    const orderedByev_ebit = JSON.parse(JSON.stringify(filteredStocks)).sort(
        (a, b) => a.ev_ebit - b.ev_ebit
    );
    const orderedByROIC = JSON.parse(JSON.stringify(filteredStocks)).sort(
        (a, b) => b.roic - a.roic
    );

    return JSON.parse(JSON.stringify(filteredStocks))
        .map((company) => ({
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
        .sort((a, b) => a.rank - b.rank);
};

const getGrahamPrice = (stock) => {
    const profitPerStock = stock.price / stock.p_l;
    const equityValuePerStock = stock.price / stock.p_vp;
    const grahamPrice = (22.5 * profitPerStock * equityValuePerStock) ** 0.5;
    return Math.floor(grahamPrice * 100) / 100;
};

export const filterByGraham = (stocks) => {
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
                stock.p_vp > 0 &&
                stock.p_l > 0 &&
                stock.graham_price_diff >= 0.2
            );
        })
        .sort((a, b) => b.graham_price_diff - a.graham_price_diff);
};

export const filterByDecioBasin = (stocks) => {
    return stocks.filter((stock) => {
        return stock.p_l > 0 && stock.lpa > 0;
    });
};

export const checkIfTickerIsBestRanked = (ticker, stocks) => {
    const tickerIndex = stocks.findIndex((stock) => stock.ticker === ticker);

    const bestRankedTicker = stocks.findIndex(
        (stock) =>
            stock.ticker.replace(/[0-9]/g, "") === ticker.replace(/[0-9]/g, "")
    );
    return tickerIndex === bestRankedTicker;
};
