'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuestStore } from '@/lib/stores/quest-store'
import { getDdayCount } from '@/lib/utils/dday'
import { calculateStreak } from '@/lib/utils/streak'
import { Button } from '@/components/ui/button'
import { Home, Calendar, Database, BookHeart, User, Settings } from 'lucide-react'

function CoupleNamesBadge() {
  const coupleNames = useQuestStore((state) => state.progress.coupleNames)
  if (!coupleNames) return null

  return (
    <span className="hidden sm:inline text-xs font-medium text-gray-500 dark:text-gray-400">
      {coupleNames.user} & {coupleNames.partner}
    </span>
  )
}

function DdayBadge() {
  const weddingDate = useQuestStore((state) => state.progress.weddingDate)

  if (!weddingDate) {
    return (
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        D-Day ?
      </span>
    )
  }

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
  const { current: streak } = calculateStreak(activeDates || [])
  if (streak <= 0) return null

  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
      🔥 {streak}
    </span>
  )
}

export function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* 로고 + D-Day */}
        <div className="flex items-center gap-3">
          <Link href="/roadmap" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">💍</span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">MarryRoad</h1>
          </Link>
          <CoupleNamesBadge />
          <DdayBadge />
          <StreakBadge />
        </div>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/roadmap">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 rounded-none border-b-[3px] transition-colors ${
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
              size="sm"
              className={`gap-1.5 rounded-none border-b-[3px] transition-colors ${
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
              size="sm"
              className={`gap-1.5 rounded-none border-b-[3px] transition-colors ${
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
              size="sm"
              className={`gap-1.5 rounded-none border-b-[3px] transition-colors ${
                isActive('/database')
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Database className="h-4 w-4" />
              DB
            </Button>
          </Link>
          <Link href="/guests">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 rounded-none border-b-[3px] transition-colors ${
                isActive('/guests')
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <User className="h-4 w-4" />
              하객
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 rounded-none border-b-[3px] transition-colors ${
                isActive('/settings')
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Settings className="h-4 w-4" />
              설정
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
