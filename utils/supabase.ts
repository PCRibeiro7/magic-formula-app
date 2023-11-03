import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.DATABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export default createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    realtime: { logger: (log: any) => console.log(log), log_level: "debug" },
});
