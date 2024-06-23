'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const formAuthData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signInWithPassword(formAuthData)

  if (error) {
    console.log(`Error from supabase login action: ${error}`)
    redirect("/login?message=Wrong username or password");
  }
  const organizationId: string = data.user.app_metadata.organization_id;

  revalidatePath('/dashboard/[organizationId]', 'page')
  redirect(`/dashboard/${organizationId}`)
}

export async function loginDemo() {
	const supabase = createClient()
  
	// type-casting here for convenience
	// in practice, you should validate your inputs
	const formAuthData = {
	  email: "demo@demo.com",
	  password: process.env.DEMO_PASSWORD!
	}
  
	const { data, error } = await supabase.auth.signInWithPassword(formAuthData)
  
	if (error) {
	  console.log(`Error from supabase login action: ${error}`)
	  redirect("/login?message=Wrong username or password");
	}
  
	revalidatePath('/dashboard/[organizationId]', 'page')
	redirect(`/dashboard/${data.user.app_metadata.organization_id}`)
  }

export async function signup(formData: FormData) {
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${process.env.VERCEL_URL}/auth/callback`,
    },
  });
  
  if (error) {
    console.log(`Error from supabase Signup action: ${error}`)
    redirect("/login?message=Could not sign up user");
  }
  revalidatePath('/', 'layout')
  redirect("/login?message=Check email to continue sign in process");

}