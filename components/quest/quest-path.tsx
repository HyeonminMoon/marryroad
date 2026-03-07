'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Star, Sparkles } from 'lucide-react';
import { Quest, QuestProgress, QuestStatus } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';

// ─── Types ───────────────────────────────────────────────────────────

interface QuestPathProps {
  quests: Quest[];
  progress: QuestProgress;
  onQuestClick: (quest: Quest) => void;
}

// ─── Status Calculation (props 기반, store 직접 호출 안 함) ──────────

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

// ─── SVG Connector Path ──────────────────────────────────────────────

function ConnectorPath({
  fromX,
  fromY,
  toX,
  toY,
  status,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  status: QuestStatus;
}) {
  const midY = (fromY + toY) / 2;
  const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
  const isActive = status !== 'locked';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <path
        d={d}
        fill="none"
        stroke={isActive ? '#a78bfa' : '#d1d5db'}
        strokeWidth={3}
        strokeDasharray={isActive ? 'none' : '8 6'}
        strokeLinecap="round"
        opacity={isActive ? 0.6 : 0.3}
      />
    </svg>
  );
}

// ─── Progress Ring ───────────────────────────────────────────────────

function ProgressRing({
  percent,
  size = 88,
  strokeWidth = 4,
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
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
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

// ─── Star Burst Effect (completed) ──────────────────────────────────

function StarBurst() {
  return (
    <>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <motion.div
          key={angle}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            x: Math.cos((angle * Math.PI) / 180) * 50 - 6,
            y: Math.sin((angle * Math.PI) / 180) * 50 - 6,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            delay: angle * 0.05,
          }}
        >
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </motion.div>
      ))}
    </>
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

  // 상태별 스타일
  const bubbleStyle = (() => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300';
      case 'available':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-300';
      case 'in-progress':
        return 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300';
      case 'locked':
      default:
        return 'bg-gray-400 dark:bg-gray-600 border-gray-300 dark:border-gray-500';
    }
  })();

  const glowStyle = (() => {
    switch (status) {
      case 'completed':
        return '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)';
      case 'available':
        return '0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2)';
      case 'in-progress':
        return '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)';
      default:
        return 'none';
    }
  })();

  return (
    <div className="flex flex-col items-center gap-2" style={{ zIndex: 1 }}>
      {/* 버블 */}
      <motion.button
        onClick={onClick}
        disabled={status === 'locked'}
        className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center
          ${bubbleStyle}
          ${status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-colors
        `}
        style={{ boxShadow: glowStyle }}
        // available 노드 bounce 애니메이션
        animate={
          status === 'available'
            ? { y: [0, -8, 0] }
            : {}
        }
        transition={
          status === 'available'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
        whileHover={
          status !== 'locked'
            ? { scale: 1.1 }
            : {}
        }
        whileTap={
          status !== 'locked'
            ? { scale: 0.95 }
            : {}
        }
      >
        {/* Progress Ring (in-progress) */}
        {status === 'in-progress' && (
          <ProgressRing percent={progressPercent} size={88} strokeWidth={4} />
        )}

        {/* Star Burst (completed) */}
        {status === 'completed' && <StarBurst />}

        {/* 아이콘 */}
        <div className="relative z-10 text-white">
          {status === 'locked' ? (
            <Lock className="w-7 h-7" />
          ) : status === 'completed' ? (
            <Check className="w-8 h-8 stroke-[3]" />
          ) : (
            <Icon className="w-7 h-7" />
          )}
        </div>
      </motion.button>

      {/* "시작!" 텍스트 (available) */}
      {status === 'available' && (
        <motion.div
          className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md -mt-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          시작!
        </motion.div>
      )}

      {/* 퀘스트 제목 */}
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 text-center leading-tight line-clamp-2 max-w-[120px]">
        {quest.title}
      </h3>

      {/* 진행률 배지 */}
      {status !== 'locked' && (
        <div className="flex items-center gap-1 text-xs">
          {status === 'completed' ? (
            <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3" />
              완료!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">
              {completedCount}/{totalCount} 완료
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

const NODE_GAP = 160; // 노드 간 세로 간격
const ZIGZAG_OFFSET = 60; // 좌우 지그재그 오프셋

export default function QuestPath({ quests, progress, onQuestClick }: QuestPathProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 퀘스트별 상태 계산
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

  // 첫 번째 available 퀘스트 찾기
  const firstAvailableIndex = useMemo(() => {
    return questsWithStatus.findIndex(q => q.status === 'available');
  }, [questsWithStatus]);

  // 첫 available 퀘스트로 자동 스크롤
  useEffect(() => {
    if (firstAvailableIndex === -1) return;
    const questId = questsWithStatus[firstAvailableIndex]?.quest.id;
    if (!questId) return;

    // 약간의 딜레이로 DOM 렌더 이후 스크롤
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

  // 전체 경로 높이
  const totalHeight = questsWithStatus.length * NODE_GAP + 200;

  // 노드 위치 계산
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
      {/* 경로 컨테이너 */}
      <div
        className="relative mx-auto"
        style={{
          height: totalHeight,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* SVG 커넥터 라인 */}
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ height: totalHeight, zIndex: 0 }}
        >
          {questsWithStatus.map((item, index) => {
            if (index === 0) return null;
            const from = getNodePosition(index - 1);
            const to = getNodePosition(index);

            // 중앙 기준 오프셋 + 버블 중심
            const centerX = 200; // maxWidth/2
            const fromX = centerX + from.x;
            const fromY = from.y + 100 + 40; // padding-top + 버블 반지름 아래
            const toX = centerX + to.x;
            const toY = to.y + 100 - 10; // padding-top + 버블 상단 약간 위

            const isActive = item.status !== 'locked';
            const midY = (fromY + toY) / 2;
            const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

            return (
              <path
                key={`connector-${index}`}
                d={d}
                fill="none"
                stroke={isActive ? '#a78bfa' : '#d1d5db'}
                strokeWidth={3}
                strokeDasharray={isActive ? 'none' : '8 6'}
                strokeLinecap="round"
                opacity={isActive ? 0.6 : 0.3}
              />
            );
          })}
        </svg>

        {/* 퀘스트 노드들 */}
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
                top: pos.y + 100, // 상단 패딩
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
