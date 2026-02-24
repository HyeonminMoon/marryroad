import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase 클라이언트 (Client Component용)
 * 브라우저에서만 실행되며, 공개 anon key를 사용합니다.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
