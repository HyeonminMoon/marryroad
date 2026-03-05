'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Map, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-20 h-20 text-pink-500 fill-pink-500" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            MarryRoad
          </h1>
          
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            결혼 준비, 이제 <span className="font-bold text-purple-600">게임처럼</span> 즐기세요!
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            137개의 복잡한 결혼 준비 과정을 19개의 퀘스트로 재구성했습니다. 
            한번에 여기서 모든 일을 차례대로, 당신의 속도대로 진행하세요.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/roadmap')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              퀘스트 시작하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
              <Map className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">시각적 로드맵</h3>
            <p className="text-gray-600 dark:text-gray-400">
              19개 퀘스트로 구성된 명확한 로드맵. 종속성을 한눈에 파악하세요.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">게임화된 경험</h3>
            <p className="text-gray-600 dark:text-gray-400">
              작업 완료 시 XP 획득, 레벨업 시스템으로 동기부여를 유지하세요.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">진행률 추적</h3>
            <p className="text-gray-600 dark:text-gray-400">
              실시간으로 진행 상황을 확인하고 예산을 관리하세요.
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 max-w-3xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              복잡한 결혼 준비, 이제 즐겁게!
            </h2>
            <p className="text-lg mb-8 opacity-90">
              "왜 이걸 지금 해야 하지?"라는 의문을 종속성 시스템으로 해결했습니다.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/roadmap')}
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              지금 시작하기
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

