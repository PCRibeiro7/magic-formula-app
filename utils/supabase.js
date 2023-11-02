"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
exports.default = (0, supabase_js_1.createClient)(process.env.DATABASE_URL, process.env.SUPABASE_SERVICE_API_KEY, {
    auth: { persistSession: false },
    realtime: { logger: (log) => console.log(log), log_level: "debug" },
});
