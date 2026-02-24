import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase Admin 클라이언트
 * 
 * ⚠️ WARNING: 이 클라이언트는 Service Role Key를 사용하므로
 * RLS를 우회합니다. 서버 사이드 API 라우트에서만 사용하세요.
 * 
 * 절대로 클라이언트 코드에서 import하지 마세요!
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
