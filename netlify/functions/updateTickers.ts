import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { fetchAllStocks } from "services/statusInvest";

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
        const stocks = await fetchAllStocks();

        const tickers = stocks.map((stock) => ({
            ticker: stock.ticker,
        }));

        await supabase.from("tickers").upsert(tickers);

        return {
            statusCode: 200,
        };
    } catch (error) {
        console.log(error);
    }
};

const handler = schedule("@weekly", myHandler);

export { handler };
