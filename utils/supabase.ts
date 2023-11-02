import { createClient } from "@supabase/supabase-js";

export default createClient(
    process.env.DATABASE_URL,
    process.env.SUPABASE_SERVICE_API_KEY,
    { auth: { persistSession: false } }
);
