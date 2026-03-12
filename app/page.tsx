'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // 이미 진행 중인 유저라면 바로 /roadmap으로 리다이렉트
  useEffect(() => {
    try {
      const stored = localStorage.getItem('marryroad-quest-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        const progress = parsed?.state?.progress;
        // 진행 중인지 판단: 하나라도 완료된 퀘스트가 있거나, 태스크가 있거나, XP가 있으면
        if (
          progress &&
          (progress.completedQuestIds?.length > 0 ||
            Object.keys(progress.taskProgress || {}).length > 0 ||
            progress.xp > 0)
        ) {
          router.replace('/roadmap');
          return;
        }
      }
    } catch {
      // localStorage 접근 실패 시 무시
    }
    setChecking(false);
  }, [router]);

  // 리다이렉트 체크 중이면 아무것도 보여주지 않음 (깜빡임 방지)
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center px-4">
      {/* 메인 콘텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        {/* 큰 일러스트 / 아이콘 */}
        <motion.div
          className="mb-8"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
            <Heart className="w-16 h-16 text-white fill-white" />
          </div>
        </motion.div>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          MarryRoad
        </h1>

        <p className="text-xl text-gray-700 dark:text-gray-300 mb-3">
          결혼 준비를 <span className="font-bold text-purple-600">게임처럼</span> 깨세요
        </p>

        <p className="text-base text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
          137개 할 일을 14개 퀘스트로 정리했습니다.
          <br />
          하나씩, 당신의 속도로.
        </p>

        {/* CTA 버튼들 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => router.push('/signup')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            회원가입
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/login')}
            className="text-lg px-8 py-6 rounded-2xl"
          >
            로그인
          </Button>
        </div>

        {/* 게스트 모드 */}
        <button
          onClick={() => router.push('/welcome')}
          className="mt-6 text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 underline"
        >
          게스트로 시작하기
        </button>
      </motion.div>

      {/* 하단 부가 텍스트 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-16 text-sm text-gray-400 dark:text-gray-500"
      >
        계정을 만들고 데이터를 저장하세요
      </motion.p>
    </div>
  );
}
