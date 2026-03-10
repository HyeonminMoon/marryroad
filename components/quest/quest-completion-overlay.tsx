'use client';

import React, { useEffect, useCallback } from 'react';
import { Quest } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface QuestCompletionOverlayProps {
  quest: Quest | null;
  onDismiss: () => void;
}

export function QuestCompletionOverlay({ quest, onDismiss }: QuestCompletionOverlayProps) {
  // Confetti bursts
  useEffect(() => {
    if (!quest) return;

    // Burst 1: left side
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.3, y: 0.5 },
      colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    });

    // Burst 2: right side, delayed
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.7, y: 0.5 },
        colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      });
    }, 400);

    // Auto-dismiss
    const dismissTimer = setTimeout(onDismiss, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [quest, onDismiss]);

  const handleClick = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  if (!quest) return null;
  const Icon = getQuestIcon(quest.icon);

  return (
    <AnimatePresence>
      {quest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={handleClick}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col items-center text-center px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quest Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
              style={{ backgroundColor: quest.color }}
            >
              <Icon className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              퀘스트 완료!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 mb-6"
            >
              {quest.title}
            </motion.p>

            {/* XP Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 400 }}
              className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full text-lg font-bold shadow-lg"
            >
              +{quest.xp} XP
            </motion.div>

            {/* Dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-white/40 text-sm mt-8"
            >
              아무 곳이나 터치하세요
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
