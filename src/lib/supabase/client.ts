import { createBrowserClient } from "@supabase/ssr/dist";
// import { Database } from "@/lib/supabaseTypes";
export const createClient = () =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
