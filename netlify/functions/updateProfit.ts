import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { fetchStockProfit } from "@/services/statusInvest";

// Grab our credentials from a .env file or environment variables
const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = process.env;

// Connect to our database
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY, {
    auth: { persistSession: false },
});

const myHandler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
) => {
    try {
        console.log("Updating profits...");
        const {
            data: [{ ticker }],
            error: tickerFetchError,
        } = await supabase
            .from("tickers")
            .select("ticker")
            .order("last_updated", { ascending: true, nullsFirst: true })
            .limit(1);

        if (tickerFetchError) {
            throw tickerFetchError;
        }

        console.log(`Fetching profits for ${ticker}`);

        const profitData = await fetchStockProfit({ ticker });

        console.log(
            `Fetched ${profitData.length} years of profit data for ${ticker}`
        );

        const formattedProfitData = profitData.map((yearProfit) => ({
            ticker: ticker,
            year: yearProfit.year,
            profit: Math.round(yearProfit.profit),
        }));

        console.log(`Updating profits for ${ticker}`);

        const { error: profitUpdateError } = await supabase
            .from("profits")
            .upsert(formattedProfitData);

        if (profitUpdateError) {
            throw profitUpdateError;
        }

        console.log(`Updating last updated for ${ticker}`);

        const { error: tickerUpdateError } = await supabase
            .from("tickers")
            .upsert({
                ticker: ticker,
                last_updated: new Date().toISOString(),
            });

        console.log(`Updated last updated for ${ticker}`);

        if (tickerUpdateError) {
            throw tickerUpdateError;
        }

        return {
            statusCode: 200,
        };
    } catch (error) {
        console.log(error);
    }
};

const handler = schedule("*/5 * * * *", myHandler);

export { handler };
