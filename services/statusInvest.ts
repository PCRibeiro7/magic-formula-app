import { Profit } from "@/types/profits";
import { Stock } from "@/types/stock";

const axios = require("axios");
const { indexBy } = require("underscore");

export const fetchAllStocks = async (): Promise<Stock[]> => {
    try {
        const stocksResponse = await axios.get(
            "https://statusinvest.com.br/category/advancedsearchresultpaginated?search=%7B%22Sector%22%3A%22%22%2C%22SubSector%22%3A%22%22%2C%22Segment%22%3A%22%22%2C%22my_range%22%3A%22-20%3B100%22%2C%22forecast%22%3A%7B%22upsidedownside%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22estimatesnumber%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22revisedup%22%3Atrue%2C%22reviseddown%22%3Atrue%2C%22consensus%22%3A%5B%5D%7D%2C%22dy%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_l%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22peg_ratio%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_vp%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_ativo%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22margembruta%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22margemebit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22margemliquida%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_ebit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22ev_ebit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22dividaliquidaebit%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22dividaliquidapatrimonioliquido%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_sr%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_capitalgiro%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_ativocirculante%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22roe%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22roic%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22roa%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22liquidezcorrente%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22pl_ativo%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22passivo_ativo%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22giroativos%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22receitas_cagr5%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22lucros_cagr5%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22liquidezmediadiaria%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22vpa%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22lpa%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22valormercado%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%7D&orderColumn=&isAsc=&page=0&take=1000&CategoryType=1",
            {
                headers: {
                    accept: "*/*",
                    "accept-language":
                        "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,es-MX;q=0.6,es;q=0.5",
                    "content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest",
                    "user-agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
                },
            }
        );
        return stocksResponse.data.list;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const fetchStockProfit = async ({ ticker }: { ticker: string }) => {
    try {
        const stockResponse: { data: Profit } = await axios.get(
            `https://statusinvest.com.br/acao/payoutresult?code=${ticker}&companyid=280&type=2`,
            {
                headers: {
                    accept: "*/*",
                    "accept-language":
                        "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,es-MX;q=0.6,es;q=0.5",
                    "content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest",
                    "user-agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
                },
            }
        );
        const formattedResponse = stockResponse.data.chart.category.map(
            (year, index) => {
                return {
                    year: year,
                    profit: stockResponse.data.chart.series.lucroLiquido[index]
                        .value,
                };
            }
        );
        return formattedResponse;
    } catch (error) {
        console.log(error);
    }
};

const getStockHistoricalInfo = async ({ ticker }: { ticker: string }) => {
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

export const fetchDividendData = async ({ ticker }: { ticker: string }) => {
    const stockHistoricalInfoUrl = `https://statusinvest.com.br/acao/companytickerprovents?ticker=${ticker}&chartProventsType=2`;
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
        method: "GET",
    });
    return { [ticker]: { ...data } };
};

export const fetchHistoricalData = async ({ ticker }: { ticker: string }) => {
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

export const keyMap = {
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
    peg_ratio: "PEGRatio",
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

export const toReadableStockHistoricalInfoResult = (infos: any[]) => {
    return infos.map(
        (info: {
            key: keyof typeof keyMap;
            actual: any;
            avg: any;
            avgDifference: any;
            minValue: any;
            minValueRank: any;
            maxValue: any;
            maxValueRank: any;
            ranks: any[];
        }) => ({
            key: keyMap[info.key],
            currentValue: info.actual,
            avgValue: info.avg,
            avgDiffValue: info.avgDifference,
            minValue: info.minValue,
            minValueYear: info.minValueRank,
            maxValue: info.maxValue,
            maxValueYear: info.maxValueRank,
            series: info.ranks.map((rank: { rank: any; value: any }) => ({
                year: rank.rank,
                value: rank.value || null,
            })),
        })
    );
};

export const getHistoricalDataInBatches = async (
    stocks: { ticker: string }[]
) => {
    let historicalData: any[] = [];
    const batchSize = 50;
    for (let i = 0; i < stocks.length; i = i + batchSize) {
        const currStocksBatch = stocks.slice(i, i + batchSize);
        const currHistoricalData = await Promise.all(
            currStocksBatch.map((stock: { ticker: string }) => {
                return getStockHistoricalInfo({
                    ticker: stock.ticker,
                });
            })
        );
        historicalData = [...historicalData, ...currHistoricalData];
    }
    return historicalData;
};
