'use client';

import React, { useRef, useEffect, useMemo, useId } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';
import { Quest, QuestProgress, QuestStatus } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';

// ─── Types ───────────────────────────────────────────────────────────

interface QuestPathProps {
  quests: Quest[];
  progress: QuestProgress;
  onQuestClick: (quest: Quest) => void;
}

// ─── Status Calculation ──────────────────────────────────────────────

function calculateQuestStatus(
  questId: string,
  completedQuestIds: string[],
  quests: Quest[],
  taskProgress: QuestProgress['taskProgress']
): QuestStatus {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return 'locked';

  const allDependenciesCompleted = quest.dependencies.every(depId =>
    completedQuestIds.includes(depId)
  );

  if (!allDependenciesCompleted) return 'locked';
  if (completedQuestIds.includes(questId)) return 'completed';

  const questTaskProgress = taskProgress[questId];
  if (questTaskProgress && questTaskProgress.completedTaskIds.length > 0) {
    return 'in-progress';
  }

  return 'available';
}

function getCompletedCount(
  questId: string,
  taskProgress: QuestProgress['taskProgress']
): number {
  return taskProgress[questId]?.completedTaskIds?.length ?? 0;
}

// ─── Progress Ring (in-progress nodes) ──────────────────────────────

function ProgressRing({
  percent,
  size = 92,
  strokeWidth = 3,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0 -rotate-90"
      style={{ zIndex: 2 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ─── Quest Node Bubble ──────────────────────────────────────────────

function QuestBubble({
  quest,
  status,
  completedCount,
  totalCount,
  onClick,
}: {
  quest: Quest;
  status: QuestStatus;
  completedCount: number;
  totalCount: number;
  onClick: () => void;
}) {
  const Icon = getQuestIcon(quest.icon);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const bubbleClasses = (() => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-br from-emerald-400 to-green-500 border-white/30';
      case 'in-progress':
        return 'bg-gradient-to-br from-violet-500 to-purple-600 border-white/20';
      case 'available':
        return 'bg-gradient-to-br from-white/30 to-white/10 dark:from-white/15 dark:to-white/5 backdrop-blur-xl border-purple-400/50 border-dashed';
      case 'locked':
      default:
        return 'bg-gray-200/30 dark:bg-gray-700/20 backdrop-blur-sm border-gray-300/30 dark:border-gray-600/30 border-dashed';
    }
  })();

  const glowStyle = (() => {
    switch (status) {
      case 'completed':
        return '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.15), inset 0 1px 1px rgba(255,255,255,0.3)';
      case 'in-progress':
        return '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.15), inset 0 1px 1px rgba(255,255,255,0.2)';
      case 'available':
        return '0 0 24px rgba(139, 92, 246, 0.3), 0 0 48px rgba(139, 92, 246, 0.1)';
      default:
        return 'none';
    }
  })();

  return (
    <div className="flex flex-col items-center gap-2" style={{ zIndex: 1 }}>
      {/* Bubble */}
      <motion.button
        onClick={onClick}
        disabled={status === 'locked'}
        className={`relative w-[84px] h-[84px] rounded-full border-[3px] flex items-center justify-center
          ${bubbleClasses}
          ${status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-300
        `}
        style={{ boxShadow: glowStyle }}
        animate={
          status === 'available'
            ? { y: [0, -6, 0], scale: [1, 1.02, 1] }
            : status === 'completed'
            ? { boxShadow: [
                '0 0 20px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.15), inset 0 1px 1px rgba(255,255,255,0.3)',
                '0 0 28px rgba(34,197,94,0.6), 0 0 56px rgba(34,197,94,0.2), inset 0 1px 1px rgba(255,255,255,0.3)',
                '0 0 20px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.15), inset 0 1px 1px rgba(255,255,255,0.3)',
              ]}
            : {}
        }
        transition={
          status === 'available'
            ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            : status === 'completed'
            ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
        whileHover={status !== 'locked' ? { scale: 1.08 } : {}}
        whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
      >
        {/* Shimmer effect for available */}
        {status === 'available' && (
          <div
            className="absolute inset-0 rounded-full animate-shimmer opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        )}

        {/* Progress Ring */}
        {status === 'in-progress' && (
          <ProgressRing percent={progressPercent} size={92} strokeWidth={3} />
        )}

        {/* Icon */}
        <div className="relative z-10">
          {status === 'locked' ? (
            <Lock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          ) : status === 'completed' ? (
            <Check className="w-8 h-8 text-white stroke-[3] drop-shadow-sm" />
          ) : status === 'available' ? (
            <Icon className="w-7 h-7 text-purple-600 dark:text-purple-300 drop-shadow-sm" />
          ) : (
            <Icon className="w-7 h-7 text-white drop-shadow-sm" />
          )}
        </div>
      </motion.button>

      {/* "시작!" badge */}
      {status === 'available' && (
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-lg -mt-1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
        >
          시작!
        </motion.div>
      )}

      {/* Quest title */}
      <h3 className={`text-sm font-bold text-center leading-tight line-clamp-2 max-w-[120px] ${
        status === 'locked'
          ? 'text-gray-400 dark:text-gray-500'
          : 'text-gray-800 dark:text-gray-100'
      }`}>
        {quest.title}
      </h3>

      {/* Progress badge */}
      {status !== 'locked' && (
        <div className="flex items-center gap-1 text-xs">
          {status === 'completed' ? (
            <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3" />
              완료!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full font-medium shadow-sm">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

const NODE_GAP = 160;
const ZIGZAG_OFFSET = 60;

export default function QuestPath({ quests, progress, onQuestClick }: QuestPathProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const gradientId = useId();

  const questsWithStatus = useMemo(() => {
    return quests.map(quest => ({
      quest,
      status: calculateQuestStatus(
        quest.id,
        progress.completedQuestIds,
        quests,
        progress.taskProgress
      ),
      completedCount: getCompletedCount(quest.id, progress.taskProgress),
      totalCount: quest.tasks.length,
    }));
  }, [quests, progress]);

  const firstAvailableIndex = useMemo(() => {
    return questsWithStatus.findIndex(q => q.status === 'available');
  }, [questsWithStatus]);

  useEffect(() => {
    if (firstAvailableIndex === -1) return;
    const questId = questsWithStatus[firstAvailableIndex]?.quest.id;
    if (!questId) return;

    const timer = setTimeout(() => {
      const node = nodeRefs.current.get(questId);
      if (node && scrollRef.current) {
        const containerRect = scrollRef.current.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const scrollTop =
          node.offsetTop - containerRect.height / 2 + nodeRect.height / 2;
        scrollRef.current.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth',
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [firstAvailableIndex, questsWithStatus]);

  const totalHeight = questsWithStatus.length * NODE_GAP + 200;

  const getNodePosition = (index: number) => {
    const x = index % 2 === 0 ? -ZIGZAG_OFFSET : ZIGZAG_OFFSET;
    const y = index * NODE_GAP;
    return { x, y };
  };

  return (
    <div
      ref={scrollRef}
      className="relative w-full h-full overflow-y-auto overflow-x-hidden overscroll-y-contain
        -webkit-overflow-scrolling-touch"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative mx-auto"
        style={{
          height: totalHeight,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* SVG Connectors */}
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ height: totalHeight, zIndex: 0 }}
        >
          <defs>
            <linearGradient id={`${gradientId}-active`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id={`${gradientId}-glow`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {questsWithStatus.map((item, index) => {
            if (index === 0) return null;
            const from = getNodePosition(index - 1);
            const to = getNodePosition(index);

            const centerX = 200;
            const fromX = centerX + from.x;
            const fromY = from.y + 100 + 42;
            const toX = centerX + to.x;
            const toY = to.y + 100 - 10;

            const isActive = item.status !== 'locked';
            const midY = (fromY + toY) / 2;
            const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

            return (
              <g key={`connector-${index}`}>
                {/* Glow layer */}
                {isActive && (
                  <path
                    d={d}
                    fill="none"
                    stroke={`url(#${gradientId}-active)`}
                    strokeWidth={6}
                    strokeLinecap="round"
                    opacity={0.15}
                    filter={`url(#${gradientId}-glow)`}
                  />
                )}
                {/* Main path */}
                <path
                  d={d}
                  fill="none"
                  stroke={isActive ? `url(#${gradientId}-active)` : '#d1d5db'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isActive ? '8 4' : '4 8'}
                  strokeLinecap="round"
                  opacity={isActive ? 0.7 : 0.2}
                  className={isActive ? 'animate-flow-dash' : ''}
                />
              </g>
            );
          })}
        </svg>

        {/* Quest Nodes */}
        {questsWithStatus.map((item, index) => {
          const pos = getNodePosition(index);

          return (
            <motion.div
              key={item.quest.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(item.quest.id, el);
              }}
              className="absolute flex justify-center"
              style={{
                top: pos.y + 100,
                left: '50%',
                transform: `translateX(calc(-50% + ${pos.x}px))`,
                zIndex: 1,
              }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: 'easeOut',
              }}
            >
              <QuestBubble
                quest={item.quest}
                status={item.status}
                completedCount={item.completedCount}
                totalCount={item.totalCount}
                onClick={() => onQuestClick(item.quest)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
