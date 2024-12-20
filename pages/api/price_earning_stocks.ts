// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { fetchAllStocks, fetchHistoricalData } from "@/services/statusInvest";
import { filterPositiveProfitStocks } from "@/utils/wallets";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    const stocks = await fetchAllStocks();
    let stocksWithRanking = filterPositiveProfitStocks(stocks);
    let historicalData: any[] = [];
    const batchSize = 100;
    for (let i = 0; i < stocksWithRanking.length; i = i + batchSize) {
        const currStocksBatch = stocksWithRanking.slice(i, i + batchSize);
        const currHistoricalData = await Promise.all(
            currStocksBatch.map((stock) =>
                fetchHistoricalData({
                    ticker: stock.ticker,
                })
            )
        );
        historicalData = [...historicalData, ...currHistoricalData];
    }
    const historicalDataWithTicker = historicalData.map(
        (companyData, index) => {
            return {
                ticker: stocksWithRanking[index].ticker,
                LPA: companyData.LPA,
                ["P/L"]: companyData["P/L"],
            };
        }
    );

    stocksWithRanking = stocksWithRanking.map((stock) => ({
        ...stock,
        historicalData: historicalDataWithTicker.find(
            (historicalStock) => historicalStock.ticker === stock.ticker
        ),
    }));
    res.status(200).json(stocksWithRanking);
}
