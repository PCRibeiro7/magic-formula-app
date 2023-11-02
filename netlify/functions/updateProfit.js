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
const statusInvest_1 = require("services/statusInvest");
// Grab our credentials from a .env file or environment variables
const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = process.env;
// Connect to our database
const supabase = (0, supabase_js_1.createClient)(DATABASE_URL, SUPABASE_SERVICE_API_KEY, {
    auth: { persistSession: false },
});
const myHandler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Updating profits...");
        const { data: [{ ticker }], error: tickerFetchError, } = yield supabase
            .from("tickers")
            .select("ticker")
            .order("last_updated", { ascending: true, nullsFirst: true })
            .limit(1);
        if (tickerFetchError) {
            throw tickerFetchError;
        }
        console.log(`Fetching profits for ${ticker}`);
        const profitData = yield (0, statusInvest_1.fetchStockProfit)({ ticker });
        console.log(`Fetched ${profitData.length} years of profit data for ${ticker}`);
        const formattedProfitData = profitData.map((yearProfit) => ({
            ticker: ticker,
            year: yearProfit.year,
            profit: Math.round(yearProfit.profit),
        }));
        console.log(`Updating profits for ${ticker}`);
        const { error: profitUpdateError } = yield supabase
            .from("profits")
            .upsert(formattedProfitData);
        if (profitUpdateError) {
            throw profitUpdateError;
        }
        console.log(`Updating last updated for ${ticker}`);
        const { error: tickerUpdateError } = yield supabase
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
    }
    catch (error) {
        console.log(error);
    }
});
const handler = (0, functions_1.schedule)("*/5 * * * *", myHandler);
exports.handler = handler;
