import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const returnUrl = url.searchParams.get('returnUrl') || '/';
    
    // Fix: Await headers() call
    const headersList = await headers();
    const host = headersList.get('host');
    const origin = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`;

    if (code) {
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(`${origin}${returnUrl}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    // Fix: Await headers() in error handler as well
    const headersList = await headers();
    const host = headersList.get('host');
    const origin = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`;
    return NextResponse.redirect(`${origin}/auth-error`);
  }
}
