'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/header';
import { useQuestStore } from '@/lib/stores/quest-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Search, Filter, ArrowUpDown, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { motion } from 'framer-motion';
import { Task } from '@/lib/types/quest';
import { VendorCompare } from '@/components/database/vendor-compare';
import { CostBreakdown } from '@/components/database/cost-breakdown';
import { PriorityProgress } from '@/components/database/priority-progress';

/** 플랫 리스트용 확장 Task 타입 - Quest 메타정보 포함 */
interface FlatTask extends Task {
  questId: string;
  questTitle: string;
  questColor: string;
  questIcon: string;
  isCompleted: boolean;
  userCost?: number;
  completedDate?: string;
}

type SortField = 'title' | 'priority' | 'status' | 'completedDate' | 'cost';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'completed' | 'incomplete';

export default function DatabasePage() {
  const { quests, progress, initialize } = useQuestStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterQuest, setFilterQuest] = useState<string | null>(null);

  const hiddenQuestIds = progress.hiddenQuestIds || [];

  // 모든 작업을 플랫 리스트로 변환
  const allTasks = useMemo(() => {
    const tasks: FlatTask[] = [];

    quests.forEach(quest => {
      // H-07: Skip hidden quests
      if (hiddenQuestIds.includes(quest.id)) return;

      const questProgress = progress.taskProgress[quest.id];
      const completedTaskIds = questProgress?.completedTaskIds || [];

      quest.tasks.forEach(task => {
        const isCompleted = completedTaskIds.includes(task.id);
        const userCost = questProgress?.taskCosts?.[task.id];
        const extData = questProgress?.taskExtendedData?.[task.id];

        tasks.push({
          ...task,
          completedDate: extData?.completedDate,
          questId: quest.id,
          questTitle: quest.title,
          questColor: quest.color,
          questIcon: quest.icon,
          isCompleted,
          userCost,
        });
      });
    });

    return tasks;
  }, [quests, progress, hiddenQuestIds]);

  // 필터링 및 정렬
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = allTasks;

    // 검색
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.questTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task =>
        filterStatus === 'completed' ? task.isCompleted : !task.isCompleted
      );
    }

    // 우선순위 필터
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // 퀘스트 필터
    if (filterQuest) {
      filtered = filtered.filter(task => task.questId === filterQuest);
    }

    // 정렬
    filtered.sort((a, b) => {
      // M-10: completedDate — tasks without date always go to the end
      if (sortField === 'completedDate') {
        const aHas = !!a.completedDate;
        const bHas = !!b.completedDate;
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        if (!aHas && !bHas) return 0;
        const cmp = a.completedDate!.localeCompare(b.completedDate!);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      // M-09: cost — null/undefined always go to the end, 0 is a valid value
      if (sortField === 'cost') {
        const aHas = a.userCost != null;
        const bHas = b.userCost != null;
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        if (!aHas && !bHas) return 0;
        const diff = a.userCost! - b.userCost!;
        return sortOrder === 'asc' ? diff : -diff;
      }

      let aValue: string | number, bValue: string | number;

      switch (sortField) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'priority':
          const priorityOrder = { '상': 1, '중': 2, '하': 3 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'status':
          aValue = a.isCompleted ? 1 : 0;
          bValue = b.isCompleted ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allTasks, searchQuery, sortField, sortOrder, filterStatus, filterPriority, filterQuest]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusIcon = (task: FlatTask) => {
    if (task.isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    switch (task.priority) {
      case '상':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case '중':
        return <Circle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const stats = {
    total: allTasks.length,
    completed: allTasks.filter(t => t.isCompleted).length,
    totalCost: allTasks.reduce((sum, t) => sum + (t.userCost || 0), 0),
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col bg-gradient-to-br from-purple-50/30 via-white to-pink-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Database className="w-8 h-8 text-indigo-600" />
                데이터베이스 뷰
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                모든 작업을 테이블 형식으로 관리하세요
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">전체 작업</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">완료</div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 비용</div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalCost.toLocaleString()}원</div>
            </div>
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50 space-y-4">
            <div className="flex gap-4 flex-wrap">
              {/* 검색 */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="작업 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 상태 필터 */}
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="incomplete">미완료</SelectItem>
                </SelectContent>
              </Select>

              {/* 우선순위 필터 */}
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="우선순위" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="상">높음</SelectItem>
                  <SelectItem value="중">중간</SelectItem>
                  <SelectItem value="하">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedTasks.length}개 작업 표시 중
            </div>
          </div>
        </div>

        {/* Priority Progress */}
        <PriorityProgress tasks={allTasks} />

        {/* Cost Breakdown */}
        <CostBreakdown
          quests={quests}
          progress={progress}
          activeQuestId={filterQuest}
          onQuestClick={(id) => setFilterQuest(filterQuest === id ? null : id)}
        />

        {/* Vendor Compare */}
        <VendorCompare quests={quests} progress={progress} />

        {/* Active quest filter chip */}
        {filterQuest && (() => {
          const q = quests.find(quest => quest.id === filterQuest);
          if (!q) return null;
          const QIcon = getQuestIcon(q.icon);
          return (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">필터:</span>
              <button
                onClick={() => setFilterQuest(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white transition-colors hover:opacity-80"
                style={{ backgroundColor: q.color }}
              >
                <QIcon className="w-3 h-3" />
                {q.title}
                <span className="ml-1">×</span>
              </button>
            </div>
          );
        })()}

        {/* Mobile Card View */}
        <div className="md:hidden space-y-2">
          {filteredAndSortedTasks.map((task, index) => {
            const Icon = getQuestIcon(task.questIcon);
            return (
              <motion.div
                key={`m-${task.questId}-${task.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.015 }}
                className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 shadow-sm ${
                  task.isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">{getStatusIcon(task)}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Icon className="w-3 h-3" style={{ color: task.questColor }} />
                        <span className="text-[11px] text-gray-500">{task.questTitle}</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          task.priority === '상'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : task.priority === '중'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.userCost ? (
                        <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
                          {task.userCost.toLocaleString()}원
                        </span>
                      ) : null}
                      {task.completedDate && (
                        <span className="text-[11px] text-gray-400">{task.completedDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filteredAndSortedTasks.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              조건에 맞는 태스크가 없어요. 필터를 조정해보세요.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort('status')}
                      className="font-semibold"
                    >
                      상태
                      {sortField === 'status' && (
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort('title')}
                      className="font-semibold"
                    >
                      작업명
                      {sortField === 'title' && (
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">퀘스트</th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort('priority')}
                      className="font-semibold"
                    >
                      우선순위
                      {sortField === 'priority' && (
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort('completedDate')}
                      className="font-semibold"
                    >
                      완료일
                      {sortField === 'completedDate' && (
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort('cost')}
                      className="font-semibold"
                    >
                      비용
                      {sortField === 'cost' && (
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedTasks.map((task, index) => {
                  const Icon = getQuestIcon(task.questIcon);
                  return (
                    <motion.tr
                      key={`${task.questId}-${task.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {getStatusIcon(task)}
                      </td>
                      <td className="px-4 py-3">
                        <div className={task.isCompleted ? 'line-through text-gray-500' : ''}>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: task.questColor }} />
                          <span className="text-sm">{task.questTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            task.priority === '상'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              : task.priority === '중'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {task.completedDate || '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {task.userCost ? `${task.userCost.toLocaleString()}원` : '-'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSortedTasks.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              조건에 맞는 태스크가 없어요. 필터를 조정해보세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
