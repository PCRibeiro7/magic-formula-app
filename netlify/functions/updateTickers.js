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
        const stocks = yield (0, statusInvest_1.fetchAllStocks)();
        const tickers = stocks.map((stock) => ({
            ticker: stock.ticker,
        }));
        yield supabase.from("tickers").upsert(tickers);
        return {
            statusCode: 200,
        };
    }
    catch (error) {
        console.log(error);
    }
});
const handler = (0, functions_1.schedule)("@weekly", myHandler);
exports.handler = handler;
