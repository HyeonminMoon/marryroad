import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabase 클라이언트 (Server Component용)
 * 서버에서만 실행되며, 쿠키 기반 세션 관리를 합니다.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 쿠키를 설정할 수 없는 경우 무시
          }
        },
      },
    }
  )
}
