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
exports.getQuotesMomentumFromTimeAgo = void 0;
const supabase_1 = __importDefault(require("utils/supabase"));
function getQuotesMomentumFromTimeAgo(timeAgo) {
    return __awaiter(this, void 0, void 0, function* () {
        let daysAgo;
        // If timeAgo is a number, it's in years
        if (typeof timeAgo === "number") {
            daysAgo = Math.ceil(timeAgo * 365.25);
        }
        else {
            daysAgo = mapTimeAgoToDaysAgo(timeAgo);
        }
        let { data, error } = yield supabase_1.default.rpc("get_momentum_table", {
            days_ago: daysAgo,
        });
        if (error) {
            throw error;
        }
        return data;
    });
}
exports.getQuotesMomentumFromTimeAgo = getQuotesMomentumFromTimeAgo;
const mapTimeAgoToDaysAgo = (timeAgo) => {
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
