// Shared Supabase client. Loaded after config.js and the Supabase CDN script.
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
