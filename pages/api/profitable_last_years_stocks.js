// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { fetchAllStocks, fetchHistoricalData } from "services/statusInvest";

export default async function handler(req, res) {
  let stocks = await fetchAllStocks();
  let historicalData = [];
  const batchSize = 100;
  for (let i = 0; i < stocks.length; i = i + batchSize) {
    const currStocksBatch = stocks.slice(i, i + batchSize);
    const currHistoricalData = await Promise.all(
      currStocksBatch.map((stock) =>
        fetchHistoricalData({
          ticker: stock.ticker,
        })
      )
    );
    historicalData = [...historicalData, ...currHistoricalData];
  }
  const historicalDataWithTicker = historicalData.map((companyData, index) => {
    return {
      ticker: stocks[index].ticker,
      LPA: companyData.LPA,
      ["P/L"]: companyData["P/L"],
    };
  });

  stocks = stocks.map((stock) => ({
    ...stock,
    historicalData: historicalDataWithTicker.find(
      (historicalStock) => historicalStock.ticker === stock.ticker
    ),
  }));
  res.status(200).json(stocks);
}
