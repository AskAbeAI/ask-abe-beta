"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createClient as createClientDefault } from "@supabase/supabase-js";

async function setOrganization(userId: string, organization_id: string) {
	const supabase = createClientDefault(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	);

	// Access auth admin api

	const { data } = await supabase.auth.admin.updateUserById(userId, {
		app_metadata: { organization_id: organization_id },
	});
	return;
}
export async function signup(formData: FormData) {
	const supabase = createClient();

	const organization_id: string = formData.get("organizationId") as string;
	const { data, error } = await supabase.auth.signUp({
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		options: {
			data: {
				first_name: formData.get("firstName") as string,
				last_name: formData.get("lastName") as string,
			},
			emailRedirectTo: `${process.env.VERCEL_URL}/auth/callback`,
		},
	});

	if (error) {
		console.log(`Error from supabase Signup action: ${error}`);
		redirect("/signup?message=Could not sign up user");
	}
	await setOrganization(data.user!.id, organization_id);

	revalidatePath("/", "layout");
	redirect("/signup?message=Check email to continue sign in process");
}
