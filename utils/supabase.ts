import { createClient } from "@supabase/supabase-js";
import { Database } from "types/supabase";

export default createClient<Database>(
    process.env.DATABASE_URL,
    process.env.SUPABASE_SERVICE_API_KEY,
    {
        auth: { persistSession: false },
        realtime: { logger: (log) => console.log(log), log_level: "debug" },
    }
);
