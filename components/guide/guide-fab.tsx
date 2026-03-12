'use client';

import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface GuideFabProps {
  onClick: () => void;
}

export function GuideFab({ onClick }: GuideFabProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      onClick={onClick}
      aria-label="사용 가이드 열기"
      className="fixed right-4 bottom-24 md:bottom-6 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 active:scale-95 transition-colors"
    >
      <HelpCircle className="w-5 h-5" />
    </motion.button>
  );
}
