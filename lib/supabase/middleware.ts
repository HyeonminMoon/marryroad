import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase 클라이언트 (Middleware용)
 * 요청/응답 쿠키를 관리하며, 인증 상태를 체크합니다.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (만료 체크)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호된 경로 체크
  const protectedPaths = ['/budget', '/admin']
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // 인증되지 않은 사용자가 보호된 경로에 접근하면 로그인 페이지로 리다이렉트
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // 관리자 경로 체크
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const userRole = user?.user_metadata?.role
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}
