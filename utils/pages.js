import greenblattImage from "public/greenblatt.jpg";
import grahamImage from "public/graham.jpg";
import tobiasImage from "public/tobias-carlisle.jpg";
import decioImage from "public/decio-basin.jpg";
import valuationImage from "public/valuation.png";
import profitImage from "public/profit.jpg";


const pages = [
    {
        pagePath: "carteiras/magic_formula",
        image: greenblattImage,
        title: "Fórmula Mágica",
        description:
            "Ranking de ações baseado em um baixo EV/EBIT (empresas baratas) e um alto ROIC (empresas eficientes).",
        rules: [
            {
                direction: "high",
                indicator: "ROIC",
            },
            {
                direction: "low",
                indicator: "EV / EBIT",
            },
        ],
    },
    {
        pagePath: "carteiras/graham_wallet",
        image: grahamImage,
        title: "Carteira  Graham",
        description:
            "Ranking de ações baseado no preço justo de graham. Este preço é calculado em função do lucro e valor patrimonial da empresa.",
        rules: [
            {
                direction: "low",
                indicator: "P / VP",
            },
            {
                direction: "low",
                indicator: "P / L",
            },
        ],
    },
    {
        pagePath: "carteiras/acquirers_multiple",
        image: tobiasImage,
        title: "Carteira  Acquirers Multiple + Momentum",
        description:
            "Ranking de ações baseado em um baixo EV/EBIT (empresas baratas) e um alto Momentum de 6 Meses (empresas com tendência de alta).",
        rules: [
            {
                direction: "low",
                indicator: "EV /  EBIT",
            },
            {
                direction: "high",
                indicator: "Momentum de Preço",
            },
        ],
    },
    // {
    //     pagePath: "carteiras/decio_basin",
    //     image: decioImage,
    //     title: "Carteira  de Dividendos Décio Basin",
    //     description:
    //         "Ranking baseado em ações pagadoras de dividendos.  Calculamos o preço teto assumindo um yield alvo de 6%.",
    //     rules: [
    //         {
    //             direction: "high",
    //             indicator: "Dividend Yield",
    //         },
    //     ],
    // },
    // {
    //     pagePath: "carteiras/price_earnings",
    //     image: valuationImage,
    //     title: "Carteira  de P/L Abaixo da Média",
    //     description:
    //         "Ranking baseado em ações com indicador P/L atual abaixo da sua média histórica",
    //     rules: [
    //         {
    //             direction: "low",
    //             indicator: "P/L Atual",
    //         },
    //         {
    //             direction: "high",
    //             indicator: "P/L Médio Histórico",
    //         },
    //     ],
    // },
    // {
    //     pagePath: "carteiras/profitable_last_years",
    //     image: profitImage,
    //     title: "Carteira  de Anos Consecutivos de Lucro",
    //     description:
    //         "Ranking baseado em ações com histórico de lucro consecutivo",
    //     rules: [
    //         {
    //             direction: "high",
    //             indicator: "LPA",
    //         },
    //     ],
    // },
];

export default pages;