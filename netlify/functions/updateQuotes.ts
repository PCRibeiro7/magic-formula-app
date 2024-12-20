import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { getHistoricalPrices } from "@/services/yahooFinance2";

// Grab our credentials from a .env file or environment variables
const { DATABASE_URL = "", SUPABASE_SERVICE_API_KEY = "" } = process.env;

// Connect to our database
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY, {
    auth: { persistSession: false },
});

const myHandler: Handler = async (
    _event: HandlerEvent,
    _context: HandlerContext
) => {
    try {
        console.log("Updating quotes...");
        const { data: tickerFetchData, error: tickerFetchError } =
            await supabase
                .from("tickers")
                .select("ticker")
                .order("last_updated_quotes", {
                    ascending: true,
                    nullsFirst: true,
                })
                .limit(1);

        if (!tickerFetchData) {
            throw new Error("Ticker fetch data is null");
        }

        const ticker = tickerFetchData[0].ticker;

        if (tickerFetchError) {
            throw tickerFetchError;
        }

        console.log(`Fetching quotes for ${ticker}`);

        const { data: quotesData, error: getHistoricalPricesError } =
            await getHistoricalPrices({ symbol: `${ticker}.SA` });

        if (getHistoricalPricesError) {
            console.log(
                `Ticker quotes for ${ticker} not found on yahoo-finance, skipping...`
            );
            await updateLastUpdateQuotesTimestamp({ ticker });
            return {
                statusCode: 200,
            };
        }

        if (!quotesData) {
            throw new Error("Quotes data is null");
        }

        console.log(
            `Fetched ${quotesData.length} days of quotes data for ${ticker}`
        );

        console.log(`Formatting quotes for ${ticker}`);

        const formattedQuotesData = quotesData.map((dayQuote) => ({
            ticker: ticker,
            date: dayQuote.date,
            quote: dayQuote.adjClose,
        }));

        const lastYearQuotes = formattedQuotesData.slice(
            quotesData.length - 260,
            quotesData.length
        );

        const historicalQuotes = formattedQuotesData
            .slice(0, quotesData.length - 260)
            .filter((_, index) => index % 100 === 0);

        console.log(`Deleting quotes for ${ticker}`);

        const { error: quotesDeleteError } = await supabase
            .from("quotes")
            .delete()
            .eq("ticker", ticker);

        if (quotesDeleteError) {
            throw quotesDeleteError;
        }

        console.log(`Updating quotes for ${ticker}`);

        const { error: profitUpdateError } = await supabase
            .from("quotes")
            .upsert([...historicalQuotes, ...lastYearQuotes]);

        if (profitUpdateError) {
            throw profitUpdateError;
        }

        await updateLastUpdateQuotesTimestamp({ ticker });

        return {
            statusCode: 200,
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateLastUpdateQuotesTimestamp = async ({
    ticker,
}: {
    ticker: string;
}) => {
    console.log(`Updating last_updated_quotes for ${ticker}`);

    const { error: tickerUpdateError } = await supabase.from("tickers").upsert({
        ticker: ticker,
        last_updated_quotes: new Date().toISOString(),
    });

    console.log(`Updated last_updated_quotes for ${ticker}`);

    if (tickerUpdateError) {
        throw tickerUpdateError;
    }
};

const handler = schedule("*/5 * * * *", myHandler);

export { handler };
