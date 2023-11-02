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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const quotesMomentum_1 = require("services/quotesMomentum");
const statusInvest_1 = require("services/statusInvest");
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const yearsAgoParam = req.query.yearsAgo;
        const yearsAgo = Number(yearsAgoParam);
        const stocks = yield (0, statusInvest_1.fetchAllStocks)();
        let filteredStocks = stocks.filter((stock) => {
            return stock.ev_ebit > 0;
        });
        let mountedStocks = [];
        try {
            const quotesMomentum = yield (0, quotesMomentum_1.getQuotesMomentumFromTimeAgo)(yearsAgo);
            quotesMomentum.forEach((tickerQuotes, index) => {
                const tickerKey = tickerQuotes.ticker;
                const stockMatch = filteredStocks.find((currStock) => currStock.ticker === tickerKey);
                if (!stockMatch) {
                    return;
                }
                stockMatch.historicalDataPrice = tickerQuotes;
            });
            filteredStocks = filteredStocks.filter((stock) => stock.historicalDataPrice);
            filteredStocks = [...filteredStocks].map((stock) => {
                const pastYear = (0, moment_1.default)().subtract(yearsAgo, "year");
                const quoteYear = (0, moment_1.default)(stock.historicalDataPrice.date_past);
                if (!quoteYear.isSame(pastYear, "year")) {
                    return stock;
                }
                stock.sixMonthsBeforePrice =
                    Math.round(stock.historicalDataPrice.quote_past * 100) / 100;
                stock.momentum6M =
                    Math.round((stock.price / stock.sixMonthsBeforePrice - 1) * 10000) / 100;
                stock.annualizedReturn =
                    Math.round(((stock.price / stock.sixMonthsBeforePrice) **
                        (1 / yearsAgo) -
                        1) *
                        10000) / 100;
                return stock;
            });
            filteredStocks = filteredStocks
                .filter((stock) => stock)
                .filter((stock) => {
                return stock.sixMonthsBeforePrice;
            });
            const orderedByMomentum = JSON.parse(JSON.stringify(filteredStocks)).sort((a, b) => b.momentum6M - a.momentum6M);
            filteredStocks = JSON.parse(JSON.stringify(filteredStocks))
                .map((company) => (Object.assign({ rank: orderedByMomentum.findIndex((c) => c.ticker === company.ticker) + 1 }, company)))
                .sort((a, b) => a.rank - b.rank);
            mountedStocks = filteredStocks;
        }
        catch (error) {
            console.log(error);
        }
        const response = {
            stocks: mountedStocks,
            dates: {},
        };
        res.status(200).json(response);
    });
}
exports.default = handler;
