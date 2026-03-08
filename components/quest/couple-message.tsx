'use client';

import { useState } from 'react';
import { getDailyMessage } from '@/lib/data/daily-messages';
import { Heart, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoupleSetupProps {
  onSave: (user: string, partner: string) => void;
  onSkip: () => void;
}

export function CoupleSetup({ onSave, onSkip }: CoupleSetupProps) {
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  const handleSave = () => {
    if (userName.trim() && partnerName.trim()) {
      onSave(userName.trim(), partnerName.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl border border-pink-200 dark:border-pink-800 p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            우리 이름을 알려주세요
          </span>
        </div>
        <button onClick={onSkip} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        이름을 입력하면 매일 따뜻한 메시지를 보내드려요
      </p>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="나의 이름"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <span className="flex items-center text-pink-400 font-bold">&</span>
        <input
          type="text"
          placeholder="상대방 이름"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={!userName.trim() || !partnerName.trim()}
        className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:from-pink-600 hover:to-purple-600 transition-all"
      >
        저장하기
      </button>
    </motion.div>
  );
}

interface DailyMessageProps {
  userName?: string;
  partnerName?: string;
  onEditNames?: () => void;
}

export function DailyMessage({ userName, partnerName, onEditNames }: DailyMessageProps) {
  const message = getDailyMessage(userName, partnerName);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl border border-pink-200/50 dark:border-pink-800/50 px-5 py-4"
    >
      <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
        {message}
      </p>
      {onEditNames && (
        <button
          onClick={onEditNames}
          className="absolute top-2 right-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="이름 수정"
        >
          수정
        </button>
      )}
    </motion.div>
  );
}
