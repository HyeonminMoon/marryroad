import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">💍</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          페이지를 찾을 수 없어요
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <Link href="/roadmap">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Home className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  )
}
