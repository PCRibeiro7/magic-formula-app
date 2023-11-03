export type Stock = {
    companyid: number;
    companyname: string;
    ticker: string;
    price: number;
    p_l: number;
    p_vp?: number;
    p_ebit: number;
    p_ativo: number;
    ev_ebit?: number;
    margembruta?: number;
    margemebit?: number;
    margemliquida?: number;
    p_sr?: number;
    p_capitalgiro?: number;
    p_ativocirculante?: number;
    giroativos: number;
    roe?: number;
    roa: number;
    roic?: number;
    dividaliquidapatrimonioliquido?: number;
    dividaliquidaebit?: number;
    pl_ativo: number;
    passivo_ativo: number;
    liquidezcorrente?: number;
    peg_ratio?: number;
    receitas_cagr5?: number;
    liquidezmediadiaria?: number;
    vpa: number;
    lpa: number;
    valormercado?: number;
    segmentid: number;
    sectorid?: number;
    subsectorid?: number;
    subsectorname?: string;
    segmentname?: string;
    sectorname?: Sectorname;
    dy?: number;
    lucros_cagr5?: number;
};

export type Sectorname =
    | "Saúde"
    | "Financeiro e Outros"
    | "Consumo não Cíclico"
    | "Bens Industriais"
    | "Utilidade Pública"
    | "Consumo Cíclico"
    | "Materiais Básicos"
    | "Tecnologia da Informação"
    | "Comunicações"
    | "Petróleo. Gás e Biocombustíveis";
