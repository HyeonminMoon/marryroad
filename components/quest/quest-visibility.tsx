'use client';

import { EyeOff, Eye } from 'lucide-react';
import { getQuestIcon } from '@/lib/utils/icon-map';
import type { Quest } from '@/lib/types/quest';

interface QuestVisibilityProps {
  quests: Quest[];
  hiddenQuestIds: string[];
  onToggle: (questId: string) => void;
}

export function QuestVisibility({ quests, hiddenQuestIds, onToggle }: QuestVisibilityProps) {
  const hiddenCount = hiddenQuestIds.length;

  if (quests.length === 0) return null;

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <EyeOff className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">퀘스트 표시 관리</span>
        {hiddenCount > 0 && (
          <span className="ml-auto text-[10px] text-gray-400">{hiddenCount}개 숨김</span>
        )}
      </div>

      <div className="space-y-1.5">
        {quests.map(quest => {
          const Icon = getQuestIcon(quest.icon);
          const isHidden = hiddenQuestIds.includes(quest.id);
          return (
            <button
              key={quest.id}
              onClick={() => onToggle(quest.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                isHidden
                  ? 'bg-gray-100 dark:bg-gray-800 opacity-50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isHidden ? '#9ca3af' : quest.color }} />
              <span className={`text-xs flex-1 ${isHidden ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {quest.title}
              </span>
              {isHidden ? (
                <EyeOff className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
