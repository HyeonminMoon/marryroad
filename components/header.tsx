'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useQuestStore } from '@/lib/stores/quest-store'
import { getDdayCount } from '@/lib/utils/dday'
import { calculateStreak } from '@/lib/utils/streak'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Bell, User, LogOut, Settings, Home, DollarSign, Calendar, Gamepad2, Database, Menu, X, BookHeart } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

function DdayBadge() {
  const weddingDate = useQuestStore((state) => state.progress.weddingDate)
  if (!weddingDate) return null

  const dday = getDdayCount(weddingDate)
  const label = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day' : `D+${Math.abs(dday)}`
  const colorClass =
    dday <= 30
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
      : dday <= 90
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
      : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400'

  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colorClass}`}>
      {label}
    </span>
  )
}

function StreakBadge() {
  const activeDates = useQuestStore((state) => state.progress.activeDates)
  const streak = calculateStreak(activeDates || [])
  if (streak <= 0) return null

  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
      🔥 {streak}
    </span>
  )
}

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // 사용자 정보 가져오기
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // 읽지 않은 알림 개수 가져오기 (추후 구현)
      if (user) {
        // const { count } = await supabase
        //   .from('notifications')
        //   .select('*', { count: 'exact', head: true })
        //   .eq('user_id', user.id)
        //   .eq('read', false)
        // setUnreadCount(count || 0)
      }
    }

    getUser()

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    return user?.email || '사용자'
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 + D-Day */}
        <div className="flex items-center gap-3">
          <Link href={user ? '/roadmap' : '/'} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">💍</span>
            <h1 className="text-xl font-bold text-slate-900">MarryRoad</h1>
          </Link>
          <DdayBadge />
          <StreakBadge />
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/roadmap">
            <Button
              variant="ghost"
              className={`gap-2 rounded-none border-b-[3px] transition-colors ${
                isActive('/roadmap')
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Home className="h-4 w-4" />
              홈
            </Button>
          </Link>
          <Link href="/journey">
            <Button
              variant="ghost"
              className={`gap-2 rounded-none border-b-[3px] transition-colors ${
                isActive('/journey')
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <BookHeart className="h-4 w-4" />
              여정
            </Button>
          </Link>
          <Link href="/calendar">
            <Button
              variant="ghost"
              className={`gap-2 rounded-none border-b-[3px] transition-colors ${
                isActive('/calendar')
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Calendar className="h-4 w-4" />
              캘린더
            </Button>
          </Link>
          <Link href="/database">
            <Button
              variant="ghost"
              className={`gap-2 rounded-none border-b-[3px] transition-colors ${
                isActive('/database')
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Database className="h-4 w-4" />
              데이터베이스
            </Button>
          </Link>
        </nav>

        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-xl">💍</span>
                  MarryRoad
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                <Link href="/roadmap" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 border-l-[3px] rounded-none ${
                      isActive('/roadmap')
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/30'
                        : 'border-transparent'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    홈
                  </Button>
                </Link>
                <Link href="/journey" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 border-l-[3px] rounded-none ${
                      isActive('/journey')
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/30'
                        : 'border-transparent'
                    }`}
                  >
                    <BookHeart className="h-4 w-4" />
                    여정
                  </Button>
                </Link>
                <Link href="/calendar" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 border-l-[3px] rounded-none ${
                      isActive('/calendar')
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/30'
                        : 'border-transparent'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    캘린더
                  </Button>
                </Link>
                <Link href="/database" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 border-l-[3px] rounded-none ${
                      isActive('/database')
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/30'
                        : 'border-transparent'
                    }`}
                  >
                    <Database className="h-4 w-4" />
                    데이터베이스
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* 우측 메뉴 */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* 알림 버튼 */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* 사용자 메뉴 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {getInitials(user.email ?? '')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">
                      {getUserName()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserName()}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      프로필
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      설정
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* 비로그인 상태 */
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">시작하기</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
