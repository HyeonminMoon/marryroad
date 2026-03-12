'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

interface CelebrationToastProps {
  visible: boolean;
  taskTitle: string;
  onSaveMemo: (memo: string) => void;
  onDismiss: () => void;
  showJourneyLink: boolean;
}

const AUTO_DISMISS_MS = 6000;

export function CelebrationToast({
  visible,
  taskTitle,
  onSaveMemo,
  onDismiss,
  showJourneyLink,
}: CelebrationToastProps) {
  const [memo, setMemo] = useState('');
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // Auto-dismiss timer
  useEffect(() => {
    if (!visible) {
      setMemo('');
      setElapsed(0);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!paused) {
        setElapsed(prev => {
          const next = prev + 100;
          if (next >= AUTO_DISMISS_MS) {
            onDismissRef.current();
            return 0;
          }
          return next;
        });
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, paused]);

  const handleSubmit = useCallback(() => {
    if (memo.trim()) {
      onSaveMemo(memo.trim());
    }
    onDismiss();
  }, [memo, onSaveMemo, onDismiss]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onDismiss();
  };

  const progressPercent = Math.min((elapsed / AUTO_DISMISS_MS) * 100, 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                  {taskTitle} 완료!
                </p>
              </div>
              <button
                onClick={onDismiss}
                aria-label="닫기"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Memo input */}
            <div className="px-4 pb-3">
              <input
                ref={inputRef}
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                onKeyDown={handleKeyDown}
                placeholder="한 줄로 기록해볼까요?"
                className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 pb-3">
              <button
                onClick={onDismiss}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                건너뛰기
              </button>

              <div className="flex items-center gap-3">
                {showJourneyLink && (
                  <Link
                    href="/journey"
                    onClick={onDismiss}
                    className="text-xs text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    여정에서 보기
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!memo.trim()}
                  className="text-xs font-semibold text-white bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 px-4 py-1.5 rounded-lg transition-colors"
                >
                  저장
                </button>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="h-1 bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full bg-purple-400 dark:bg-purple-600 transition-all duration-100 ease-linear"
                style={{ width: `${100 - progressPercent}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
