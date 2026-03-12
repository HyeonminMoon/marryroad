'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, CheckCircle2, CalendarHeart, Sparkles } from 'lucide-react';

interface GuideSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  action: () => void;
}

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (target: 'today' | 'settings' | 'quest') => void;
}

export function OnboardingGuide({ isOpen, onClose, onNavigate }: OnboardingGuideProps) {
  const [expandedId, setExpandedId] = useState<string | null>('first-task');

  const sections: GuideSection[] = [
    {
      id: 'first-task',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      title: '1. 첫 번째 할 일 완료하기',
      body: '홈 화면 \'오늘\' 탭에서 추천 태스크를 하나 골라 체크해보세요. 완료하면 축하 토스트와 함께 XP를 받을 수 있어요!',
      cta: '해보기',
      action: () => { onClose(); onNavigate('today'); },
    },
    {
      id: 'dday',
      icon: <CalendarHeart className="w-5 h-5 text-pink-500" />,
      title: '2. 결혼식 날짜 설정하기',
      body: '설정에서 D-Day를 입력하면 남은 일수와 추천 일정이 자동으로 계산돼요. 언제까지 뭘 해야 하는지 한눈에 볼 수 있습니다.',
      cta: '설정 열기',
      action: () => { onClose(); onNavigate('settings'); },
    },
    {
      id: 'today',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      title: '3. 오늘 뭐 하지? 확인하기',
      body: '홈 화면 \'오늘\' 탭에서 D-Day 기반 추천 태스크를 확인하세요. 긴급한 것부터 알려드려요. 막막할 때 여기만 보면 됩니다.',
      cta: '오늘 탭 보기',
      action: () => { onClose(); onNavigate('today'); },
    },
  ];

  const toggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[75vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-5 pt-3 pb-2 border-b border-gray-100 dark:border-gray-700 rounded-t-2xl">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  MarryRoad 시작 가이드
                </h2>
                <button
                  onClick={onClose}
                  aria-label="가이드 닫기"
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                3가지만 하면 결혼 준비 시작 완료!
              </p>
            </div>

            <div className="px-5 py-4 space-y-3">
              {sections.map((section) => {
                const isExpanded = expandedId === section.id;
                return (
                  <div
                    key={section.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(section.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      {section.icon}
                      <span className="flex-1 font-medium text-gray-900 dark:text-white text-sm">
                        {section.title}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 pb-4 pt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                              {section.body}
                            </p>
                            <button
                              onClick={section.action}
                              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                            >
                              {section.cta} →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-6 pt-2">
              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                언제든 우하단 &apos;?&apos; 버튼으로 다시 볼 수 있어요
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
