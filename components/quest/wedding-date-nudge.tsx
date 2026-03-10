'use client';

import { useState } from 'react';
import { Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeddingDateNudgeProps {
  onSetDate: (date: string) => void;
}

export function WeddingDateNudge({ onSetDate }: WeddingDateNudgeProps) {
  const [dateInput, setDateInput] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = () => {
    if (dateInput) onSetDate(dateInput);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-2xl border border-purple-200/60 dark:border-purple-800/40 shadow-sm overflow-hidden"
    >
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              결혼식 날짜를 설정해보세요
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              D-Day 카운트다운, 일정 추천, 준비 속도 분석이 활성화돼요
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
      ) : (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              결혼식은 언제인가요?
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-1 border border-purple-200 dark:border-purple-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!dateInput}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              설정
            </button>
          </div>

          <button
            onClick={() => setExpanded(false)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            나중에 할게요
          </button>
        </div>
      )}
    </motion.div>
  );
}
