import supabase from "utils/supabase";

type TimeAgo = "3m" | "6m" | "1y" | "2y" | "5y" | "10y" | "20y" | "30y" | "max";

const mapTimeAgoToDaysAgo = (timeAgo: TimeAgo) => {
    return {
        "3m": 90,
        "6m": 180,
        "1y": 365,
        "2y": 730,
        "5y": 1825,
        "10y": 3650,
        "20y": 7300,
        "30y": 10950,
        max: 100000,
    }[timeAgo];
};

export const getQuotesMomentumFromTimeAgo = async (timeAgo: TimeAgo) => {
    const daysAgo = mapTimeAgoToDaysAgo(timeAgo);

    let { data, error } = await supabase.rpc("get_momentum_table", {
        days_ago: daysAgo,
    });

    if (error) {
        throw error;
    }

    return data;
};
