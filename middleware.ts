import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // For now, just return without any auth checks
  return
}

export const config = {
  matcher: []  // Empty matcher means no routes will be checked
}