'use client';

import { useState, useMemo } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { getDdayCount, getUrgentTasks, type TaskUrgency, type UrgentTask } from '@/lib/utils/dday';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { Calendar, Clock, AlertTriangle, ChevronDown, ChevronUp, Heart, Pencil, Check as CheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DdayDashboardProps {
  quests: Quest[];
  progress: QuestProgress;
  onSetWeddingDate: (date: string) => void;
  onQuestClick: (quest: Quest) => void;
}

const URGENCY_CONFIG: Record<TaskUrgency, { label: string; color: string; bg: string; icon: string }> = {
  overdue: {
    label: '지금 해야 해요',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    icon: '🔴',
  },
  'due-soon': {
    label: '곧 해야 해요',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    icon: '🟡',
  },
  upcoming: {
    label: '다가오는 할 일',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    icon: '🔵',
  },
  later: {
    label: '아직 여유 있어요',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    icon: '🟢',
  },
};

function WeddingDatePicker({ onSetDate }: { onSetDate: (date: string) => void }) {
  const [dateInput, setDateInput] = useState('');

  const handleSubmit = () => {
    if (dateInput) onSetDate(dateInput);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
        <Heart className="w-8 h-8 text-white fill-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
        결혼식 날짜를 알려주세요
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        날짜를 설정하면 언제 무엇을 해야 하는지 알려드릴게요
      </p>
      <div className="flex items-center justify-center gap-3">
        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={!dateInput}
          className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          설정
        </button>
      </div>
    </div>
  );
}

function DdayCountdown({
  weddingDate,
  onChangeDate,
}: {
  weddingDate: string;
  onChangeDate: (date: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [dateInput, setDateInput] = useState(weddingDate);

  const dday = getDdayCount(weddingDate);
  const weddingDateObj = new Date(weddingDate);
  const formattedDate = weddingDateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const totalDays = 365;
  const elapsed = totalDays - Math.max(0, dday);
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));

  const saveDate = () => {
    if (dateInput) onChangeDate(dateInput);
    setEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveDate();
                  if (e.key === 'Escape') setEditing(false);
                }}
                autoFocus
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-0.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
              <button onClick={saveDate} className="p-0.5 text-green-600 hover:text-green-700">
                <CheckIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setDateInput(weddingDate); setEditing(true); }}
              className="group flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <span>{formattedDate}</span>
              <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
        <span className={`text-2xl font-black ${
          dday <= 30 ? 'text-red-500' : dday <= 90 ? 'text-amber-500' : 'text-purple-600 dark:text-purple-400'
        }`}>
          D{dday > 0 ? `-${dday}` : dday === 0 ? '-Day' : `+${Math.abs(dday)}`}
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
        준비 진행률 {progressPercent}%
      </p>
    </div>
  );
}

const INITIAL_SHOW_LIMIT = 5;

function UrgencyGroup({
  urgency,
  tasks,
  quests,
  onQuestClick,
  defaultOpen = false,
}: {
  urgency: TaskUrgency;
  tasks: UrgentTask[];
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [expanded, setExpanded] = useState(false);
  const config = URGENCY_CONFIG[urgency];

  if (tasks.length === 0) return null;

  const shouldLimit = urgency === 'later' || urgency === 'upcoming';
  const visibleTasks = shouldLimit && !expanded ? tasks.slice(0, INITIAL_SHOW_LIMIT) : tasks;
  const hiddenCount = tasks.length - visibleTasks.length;

  return (
    <div className={`rounded-xl border ${config.bg} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span>{config.icon}</span>
          <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-2">
              {visibleTasks.map((task) => {
                const quest = quests.find(q => q.id === task.questId);
                const Icon = getQuestIcon(task.questIcon);
                return (
                  <div
                    key={task.taskId}
                    onClick={() => quest && onQuestClick(quest)}
                    className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: task.questColor + '20' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: task.questColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {task.questTitle}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {task.daysUntilTarget < 0
                            ? `${Math.abs(task.daysUntilTarget)}일 지남`
                            : task.daysUntilTarget === 0
                            ? '오늘'
                            : `${task.daysUntilTarget}일 후`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {hiddenCount > 0 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 transition-colors"
                >
                  {hiddenCount}개 더 보기
                </button>
              )}
              {expanded && shouldLimit && tasks.length > INITIAL_SHOW_LIMIT && (
                <button
                  onClick={() => setExpanded(false)}
                  className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 transition-colors"
                >
                  접기
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DdayDashboard({ quests, progress, onSetWeddingDate, onQuestClick }: DdayDashboardProps) {
  const weddingDate = progress.weddingDate;

  const urgentTasks = useMemo(() => {
    if (!weddingDate) return [];
    return getUrgentTasks(quests, progress, weddingDate);
  }, [quests, progress, weddingDate]);

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskUrgency, UrgentTask[]> = {
      overdue: [],
      'due-soon': [],
      upcoming: [],
      later: [],
    };
    for (const task of urgentTasks) {
      groups[task.urgency].push(task);
    }
    return groups;
  }, [urgentTasks]);

  if (!weddingDate) {
    return <WeddingDatePicker onSetDate={onSetWeddingDate} />;
  }

  const overdueCount = groupedTasks.overdue.length;
  const dueSoonCount = groupedTasks['due-soon'].length;

  return (
    <div className="space-y-3">
      <DdayCountdown weddingDate={weddingDate} onChangeDate={onSetWeddingDate} />

      {overdueCount > 0 && (
        <div className="flex items-center gap-2 px-1">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            {overdueCount}개의 할 일이 기한을 넘겼어요
            {dueSoonCount > 0 && `, ${dueSoonCount}개가 곧 다가와요`}
          </p>
        </div>
      )}

      <UrgencyGroup urgency="overdue" tasks={groupedTasks.overdue} quests={quests} onQuestClick={onQuestClick} defaultOpen={true} />
      <UrgencyGroup urgency="due-soon" tasks={groupedTasks['due-soon']} quests={quests} onQuestClick={onQuestClick} defaultOpen={true} />
      <UrgencyGroup urgency="upcoming" tasks={groupedTasks.upcoming} quests={quests} onQuestClick={onQuestClick} defaultOpen={false} />
      <UrgencyGroup urgency="later" tasks={groupedTasks.later} quests={quests} onQuestClick={onQuestClick} defaultOpen={false} />
    </div>
  );
}
