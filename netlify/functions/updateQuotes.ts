import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { getHistoricalPrices } from "services/yahooFinance2";

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
        console.log("Updating quotes...");
        const {
            data: [{ ticker }],
            error: tickerFetchError,
        } = await supabase
            .from("tickers")
            .select("ticker")
            .order("last_updated_quotes", { ascending: true, nullsFirst: true })
            .limit(1);

        if (tickerFetchError) {
            throw tickerFetchError;
        }

        console.log(`Fetching quotes for ${ticker}`);

        const quotesData = await getHistoricalPrices({ symbol: `${ticker}.SA` });

        console.log(
            `Fetched ${quotesData.length} days of quotes data for ${ticker}`
        );

        const formattedQuotesData = quotesData.map((dayQuote) => ({
            ticker: ticker,
            date: dayQuote.date,
            quote: dayQuote.adjClose,
        }));

        console.log(`Updating quotes for ${ticker}`);

        const { error: profitUpdateError } = await supabase
            .from("quotes")
            .upsert(formattedQuotesData);

        if (profitUpdateError) {
            throw profitUpdateError;
        }

        console.log(`Updating last_updated_quotes for ${ticker}`);

        const { error: tickerUpdateError } = await supabase
            .from("tickers")
            .upsert({
                ticker: ticker,
                last_updated_quotes: new Date().toISOString(),
            });

        console.log(`Updated last_updated_quotes for ${ticker}`);

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
