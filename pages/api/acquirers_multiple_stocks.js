import { fetchAllStocks } from "services/statusInvest";
import { Api } from "services/bovespaApi.ts";
import moment from "moment";

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
                range: "6mo",
                interval: "1mo",
            }
        );

        data.results
            .filter((ticker) => ticker.historicalDataPrice)
            .map((ticker, index) => {
                ticker.historicalDataPrice = ticker?.historicalDataPrice?.sort(
                    (a, b) => a.date - b.date
                );
                ticker.historicalDataPrice = ticker.historicalDataPrice.map(
                    (d) => ({
                        ...d,
                        formattedDate: moment.unix(d.date).format("DD/MM/YYYY"),
                    })
                );
                const tickerKey = ticker.symbol;

                const desiredThreeMonthDate = moment().subtract(3, "months");
                const desiredSixMonthDate = moment().subtract(6, "months");

                const matchedThreeMonthDate = ticker.historicalDataPrice.find(
                    (dateObj) => {
                        return (
                            moment
                                .unix(dateObj.date)
                                .isSame(desiredThreeMonthDate, "month") ||
                            moment
                                .unix(dateObj.date)
                                .isSame(
                                    moment(desiredThreeMonthDate).add(
                                        1,
                                        "month"
                                    ),
                                    "month"
                                )
                        );
                    }
                );

                const matchedSixMonthDate = ticker.historicalDataPrice.find(
                    (dateObj) => {
                        return (
                            moment
                                .unix(dateObj.date)
                                .isSame(desiredSixMonthDate, "month") ||
                            moment
                                .unix(dateObj.date)
                                .isSame(
                                    moment(desiredSixMonthDate).add(1, "month"),
                                    "month"
                                )
                        );
                    }
                );

                const sixMonthsBeforePrice = matchedSixMonthDate?.adjustedClose;
                const threeMonthsBeforePrice =
                    matchedThreeMonthDate?.adjustedClose;

                const currentPrice =
                    ticker?.historicalDataPrice?.[
                        ticker.historicalDataPrice.length - 1
                    ]?.adjustedClose;
                const stockMatch = filteredStocks.find(
                    (currStock) => currStock.ticker === tickerKey
                );
                if (currentPrice && sixMonthsBeforePrice) {
                    stockMatch.currentPrice = currentPrice;
                    stockMatch.sixMonthsBeforePrice = sixMonthsBeforePrice;
                    stockMatch.threeMonthsBeforePrice = threeMonthsBeforePrice;
                    stockMatch.momentum6M =
                        Math.round(
                            (currentPrice / sixMonthsBeforePrice - 1) * 10000
                        ) / 100;
                    stockMatch.momentum3M =
                        Math.round(
                            (currentPrice / threeMonthsBeforePrice - 1) * 10000
                        ) / 100;
                    if (!sixMonthsBeforeDateEpoch)
                        sixMonthsBeforeDateEpoch =
                            matchedSixMonthDate?.date;
                    if (!threeMonthsBeforeDateEpoch)
                        threeMonthsBeforeDateEpoch =
                            matchedThreeMonthDate?.date;
                }
            });
    } catch (error) {
        console.log(error);
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
                orderedByMomentum.findIndex(
                    (c) => c.ticker === company.ticker
                ) +
                orderedByEV_EBIT.findIndex((c) => c.ticker === company.ticker) +
                2,
            rank_EV_EBIT:
                orderedByEV_EBIT.findIndex((c) => c.ticker === company.ticker) +
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
