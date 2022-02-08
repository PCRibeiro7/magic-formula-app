const axios = require("axios");
const { indexBy } = require("underscore");

export const fetchAllStocks = async () => {
  const stocksResponse = await axios.get(
    "https://statusinvest.com.br/category/advancedsearchresult?search=%7B%22Sector%22%3A%22%22%2C%22SubSector%22%3A%22%22%2C%22Segment%22%3A%22%22%2C%22my_range%22%3A%22-20%3B100%22%2C%22forecast%22%3A%7B%22upsideDownside%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22estimatesNumber%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22revisedUp%22%3Atrue%2C%22revisedDown%22%3Atrue%2C%22consensus%22%3A%5B%5D%7D%2C%22dy%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_L%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22peg_Ratio%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_VP%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_Ativo%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22margemBruta%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22margemEbit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22margemLiquida%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_Ebit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22eV_Ebit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22dividaLiquidaEbit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22dividaliquidaPatrimonioLiquido%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_SR%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_CapitalGiro%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_AtivoCirculante%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22roe%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22roic%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22roa%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22liquidezCorrente%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22pl_Ativo%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22passivo_Ativo%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22giroAtivos%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22receitas_Cagr5%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22lucros_Cagr5%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22liquidezMediaDiaria%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22vpa%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22lpa%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22valorMercado%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%7D&CategoryType=1",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua":
          '"Chromium";v="96", "Opera GX";v="82", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: "https://statusinvest.com.br/acoes/busca-avancada",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  );
  return stocksResponse.data;
};

const getStockHistoricalInfo = async ({ ticker }) => {
  const stockHistoricalInfoUrl =
    "https://statusinvest.com.br/acao/indicatorhistorical";
  const { data } = await axios.request(stockHistoricalInfoUrl, {
    headers: {
      accept: "*/*",
      "accept-language":
        "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,es-MX;q=0.6,es;q=0.5",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
    },
    method: "POST",
    data: `ticker=${ticker}&time=5`,
  });
  if (!data.success) {
    return null;
  }
  return indexBy(toReadableStockHistoricalInfoResult(data.data), "key");
};

export const fetchHistoricalData = async ({ ticker }) => {
  const stockHistoricalInfoUrl =
    "https://statusinvest.com.br/acao/indicatorhistoricallist";
  const { data } = await axios.request(stockHistoricalInfoUrl, {
    headers: {
      accept: "*/*",
      "accept-language":
        "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,es-MX;q=0.6,es;q=0.5",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
    },
    method: "POST",
    data: `codes=${ticker}&time=5`,
  });
  const dataKey = Object.keys(data.data)[0];
  if (!data.success) {
    return null;
  }
  return indexBy(
    toReadableStockHistoricalInfoResult(data.data[dataKey]),
    "key"
  );
};

const keyMap = {
  dy: "Dividend Yield",
  p_l: "P/L",
  p_vp: "P/VP",
  p_ebita: "P/EBITDA",
  p_ebit: "P/EBIT",
  p_sr: "PSR",
  p_ativo: "P/Ativo",
  p_capitlgiro: "P/Capital de Giro",
  p_ativocirculante: "P/ACL",
  ev_ebitda: "EV/EBITDA",
  ev_ebit: "EV/EBIT",
  lpa: "LPA",
  vpa: "VPA",
  peg_Ratio: "PEGRatio",
  dividaliquida_patrimonioliquido: "Dívida Líquida/Patrimônio",
  dividaliquida_ebitda: "Dívida Líquida/EBITDA",
  dividaliquida_ebit: "Dívida Líquida/EBIT",
  patrimonio_ativo: "Patrimônio/Ativos",
  passivo_ativo: "Passivos/Ativos",
  liquidezcorrente: "Liquidez Corrente",
  margembruta: "Margem Bruta",
  margemebitda: "Margem EBITDA",
  margemebit: "Margem EBIT",
  margeliquida: "Margem Líquida",
  roe: "ROE",
  roa: "ROA",
  roic: "ROIC",
  giro_ativos: "Giro Ativos",
  receitas_cagr5: "CAGR Receitas 5 Anos",
  lucros_cagr5: "CAGR Lucros 5 Anos",
};

export const toReadableStockHistoricalInfoResult = (infos) => {
  return infos.map((info) => ({
    key: keyMap[info.key],
    currentValue: info.actual,
    avgValue: info.avg,
    avgDiffValue: info.avgDifference,
    minValue: info.minValue,
    minValueYear: info.minValueRank,
    maxValue: info.maxValue,
    maxValueYear: info.maxValueRank,
    series: info.ranks.map((rank) => ({
      year: rank.rank,
      value: rank.value || null,
    })),
  }));
};

export const getHistoricalDataInBatches = async (stocks) => {
  let historicalData = [];
  const batchSize = 50;
  for (let i = 0; i < stocks.length; i = i + batchSize) {
    const currStocksBatch = stocks.slice(i, i + batchSize);
    const currHistoricalData = await Promise.all(
      currStocksBatch.map((stock) =>
        getStockHistoricalInfo({
          ticker: stock.ticker,
        })
      )
    );
    historicalData = [...historicalData, ...currHistoricalData];
  }
  return historicalData;
};
