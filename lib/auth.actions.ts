"use server";

import { createClient } from "@/utils/supabase/server";

export async function signInWithGoogle(formData: FormData) {

  const supabase = await createClient();
  // Fix type issue by ensuring returnUrl is a string
  const returnUrl = (formData.get("returnUrl") as string) || "/";

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
    },
  });

  // Instead of returning data, return the URL to redirect to
  return { url: data?.url };
}
