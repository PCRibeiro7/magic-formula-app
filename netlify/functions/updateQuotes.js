"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const functions_1 = require("@netlify/functions");
const supabase_js_1 = require("@supabase/supabase-js");
const yahooFinance2_1 = require("services/yahooFinance2");
// Grab our credentials from a .env file or environment variables
const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = process.env;
// Connect to our database
const supabase = (0, supabase_js_1.createClient)(DATABASE_URL, SUPABASE_SERVICE_API_KEY, {
    auth: { persistSession: false },
});
const myHandler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Updating quotes...");
        const { data: [{ ticker }], error: tickerFetchError, } = yield supabase
            .from("tickers")
            .select("ticker")
            .order("last_updated_quotes", { ascending: true, nullsFirst: true })
            .limit(1);
        if (tickerFetchError) {
            throw tickerFetchError;
        }
        console.log(`Fetching quotes for ${ticker}`);
        const { data: quotesData, error: getHistoricalPricesError } = yield (0, yahooFinance2_1.getHistoricalPrices)({ symbol: `${ticker}.SA` });
        if (getHistoricalPricesError) {
            if (getHistoricalPricesError.code === 404) {
                console.log(`Ticker quotes for ${ticker} not found on yahoo-finance, skipping...`);
                yield updateLastUpdateQuotesTimestamp({ ticker });
                return {
                    statusCode: 200,
                };
            }
        }
        console.log(`Fetched ${quotesData.length} days of quotes data for ${ticker}`);
        const formattedQuotesData = quotesData.map((dayQuote) => ({
            ticker: ticker,
            date: dayQuote.date,
            quote: dayQuote.adjClose,
        }));
        console.log(`Updating quotes for ${ticker}`);
        const { error: profitUpdateError } = yield supabase
            .from("quotes")
            .upsert(formattedQuotesData);
        if (profitUpdateError) {
            throw profitUpdateError;
        }
        yield updateLastUpdateQuotesTimestamp({ ticker });
        return {
            statusCode: 200,
        };
    }
    catch (error) {
        console.log(error);
    }
});
const updateLastUpdateQuotesTimestamp = ({ ticker }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Updating last_updated_quotes for ${ticker}`);
    const { error: tickerUpdateError } = yield supabase.from("tickers").upsert({
        ticker: ticker,
        last_updated_quotes: new Date().toISOString(),
    });
    console.log(`Updated last_updated_quotes for ${ticker}`);
    if (tickerUpdateError) {
        throw tickerUpdateError;
    }
});
const handler = (0, functions_1.schedule)("*/5 * * * *", myHandler);
exports.handler = handler;
