'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookHeart, Calendar, Users, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/roadmap', label: '홈', icon: Home },
  { href: '/journey', label: '여정', icon: BookHeart },
  { href: '/calendar', label: '캘린더', icon: Calendar },
  { href: '/guests', label: '하객', icon: Users },
  { href: '/settings', label: '설정', icon: Settings },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  // Don't show on landing, welcome, or auth pages
  if (!pathname || pathname === '/' || pathname.startsWith('/welcome') || pathname.startsWith('/auth')) {
    return null
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] ${isActive ? 'font-bold' : ''}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
