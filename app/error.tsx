'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service in production
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          문제가 발생했어요
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          일시적인 오류입니다. 다시 시도해주세요.
        </p>
        <Button onClick={reset} className="bg-purple-600 hover:bg-purple-700 text-white">
          다시 시도
        </Button>
      </div>
    </div>
  )
}
