'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestStore } from '@/lib/stores/quest-store';
import { Heart, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomePage() {
  const router = useRouter();
  const { setCoupleNames, setWeddingDate } = useQuestStore();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [dateInput, setDateInput] = useState('');

  const handleStep1 = () => {
    if (userName.trim() && partnerName.trim()) {
      setCoupleNames(userName.trim(), partnerName.trim());
      localStorage.setItem('marryroad-couple-setup-dismissed', 'true');
      setStep(2);
    }
  };

  const handleStep2 = () => {
    if (dateInput) {
      setWeddingDate(dateInput);
    }
    router.replace('/roadmap');
  };

  const handleSkipDate = () => {
    router.replace('/roadmap');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-white fill-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              반갑습니다!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              두 분의 이름을 알려주세요
            </p>

            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="나의 이름"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-center text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
              <div className="text-pink-400 font-bold text-lg">&</div>
              <input
                type="text"
                placeholder="상대방 이름"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-center text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleStep1}
              disabled={!userName.trim() || !partnerName.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              다음
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              결혼식 날짜가 정해졌나요?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              날짜를 알려주시면 일정에 맞춰 안내해드릴게요
            </p>

            <div className="mb-6">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-center text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStep2}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {dateInput ? '시작하기' : '날짜 없이 시작하기'}
              </button>
              {dateInput && (
                <button
                  onClick={handleSkipDate}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  나중에 설정할게요
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
