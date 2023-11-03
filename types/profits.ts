export type Profit = {
    actual:          number;
    avg:             number;
    avgDifference:   number;
    minValue:        number;
    minValueRank:    number;
    maxValue:        number;
    maxValueRank:    number;
    actual_F:        string;
    avg_F:           string;
    avgDifference_F: string;
    minValue_F:      string;
    minValueRank_F:  string;
    maxValue_F:      string;
    maxValueRank_F:  string;
    chart:           Chart;
}

export type Chart = {
    categoryUnique: boolean;
    category:       string[];
    series:         Series;
}

export type Series = {
    percentual:   Percentual[];
    proventos:    LucroLiquido[];
    lucroLiquido: LucroLiquido[];
}

export type LucroLiquido = {
    value:        number;
    value_F:      string;
    valueSmall_F: string;
}

export type Percentual = {
    value:   number;
    value_F: string;
}
