'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Quest, Task, TaskExtendedData } from '@/lib/types/quest';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Circle,
  CircleDot,
  Edit3,
  ChevronRight,
  DollarSign,
  FileText,
  Calendar,
  Building2,
  Star,
} from 'lucide-react';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useQuestStore } from '@/lib/stores/quest-store';
import { TaskDetailForm } from './task-detail-form';

interface TaskModalProps {
  quest: Quest | null;
  open: boolean;
  onClose: () => void;
}

export function TaskModal({ quest, open, onClose }: TaskModalProps) {
  const { completeTask, progress } = useQuestStore();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  if (!quest) return null;
  
  const questProgress = progress.taskProgress[quest.id];
  const completedTaskIds = questProgress?.completedTaskIds || [];
  
  const handleTaskComplete = (taskId: string, data: {
    cost?: number;
    memo?: string;
    date?: string;
    vendorInfo?: TaskExtendedData['vendorInfo'];
    rating?: number;
    photos?: string[];
  }) => {
    // Build extended data from the form submission
    const extendedData = {
      memo: data.memo,
      completedDate: data.date || new Date().toISOString().split('T')[0],
      vendorInfo: data.vendorInfo,
      rating: data.rating,
      photos: data.photos,
    };

    // Pass both cost and extended data to the store
    completeTask(quest.id, taskId, data.cost, extendedData);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    
    setExpandedTaskId(null);
  };
  
  const Icon = getQuestIcon(quest.icon);
  
  const getTaskIcon = (task: Task) => {
    const isCompleted = completedTaskIds.includes(task.id);
    
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
    }
    
    switch (task.priority) {
      case '상':
        return <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case '중':
        return <Circle className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
      default:
        return <CircleDot className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl" style={{ backgroundColor: quest.color + '20' }}>
              <Icon className="w-8 h-8" style={{ color: quest.color }} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{quest.title}</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {quest.tasks.length}개 작업 • {quest.progress}% 완료 • +{quest.xp} XP
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">전체 진행률</span>
            <span className="text-lg font-bold" style={{ color: quest.color }}>
              {completedTaskIds.length} / {quest.tasks.length}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: quest.color }}
              initial={{ width: 0 }}
              animate={{ width: `${quest.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {quest.tasks.map((task, index) => {
              const isCompleted = completedTaskIds.includes(task.id);
              const userCost = questProgress?.taskCosts[task.id];
              const extData = questProgress?.taskExtendedData?.[task.id];
              const isExpanded = expandedTaskId === task.id;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-lg p-4 ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                      : isExpanded
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getTaskIcon(task)}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                              {task.recommendedTiming}
                            </span>
                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                              {task.estimatedDuration}
                            </span>
                            {task.isOptional && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                                선택사항
                              </span>
                            )}
                          </div>
                          {task.prerequisiteNote && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-amber-700 dark:text-amber-300">{task.prerequisiteNote}</p>
                            </div>
                          )}
                        </div>

                        {!isCompleted && !isExpanded && (
                          <Button
                            size="sm"
                            onClick={() => setExpandedTaskId(task.id)}
                            className="ml-2"
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            기록하기
                          </Button>
                        )}
                      </div>
                      
                      {task.checklist.length > 0 && (
                        <div className="mt-3 space-y-2 pl-2 border-l-2 border-gray-300 dark:border-gray-700">
                          {task.checklist.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                              </div>
                              {item.tips && (
                                <div className="ml-6 mt-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  💡 {item.tips}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 확장된 입력 폼 */}
                      {isExpanded && !isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 border-t pt-4"
                        >
                          <TaskDetailForm
                            task={task}
                            isCompleted={isCompleted}
                            onComplete={(data) => handleTaskComplete(task.id, data)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedTaskId(null)}
                            className="mt-2 w-full"
                          >
                            취소
                          </Button>
                        </motion.div>
                      )}
                      
                      {/* 완료된 작업 정보 표시 - extended data from store */}
                      {isCompleted && (
                        <div className="mt-3 space-y-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          {userCost && (
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">비용:</span>
                              <span className="font-semibold">{userCost.toLocaleString()}원</span>
                            </div>
                          )}
                          {extData?.memo && (
                            <div className="flex items-start gap-2 text-sm">
                              <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">메모:</span>
                                <p className="text-gray-700 dark:text-gray-300 mt-1">{extData.memo}</p>
                              </div>
                            </div>
                          )}
                          {extData?.completedDate && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">완료:</span>
                              <span className="font-semibold">{extData.completedDate}</span>
                            </div>
                          )}
                          {extData?.vendorInfo && (
                            <div className="flex items-start gap-2 text-sm">
                              <Building2 className="w-4 h-4 text-gray-500 mt-0.5" />
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">업체:</span>
                                <p className="font-semibold">{extData.vendorInfo.name}</p>
                                {extData.vendorInfo.contact && (
                                  <p className="text-xs text-gray-500">{extData.vendorInfo.contact}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {extData?.rating && (
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-gray-600 dark:text-gray-400">평점:</span>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < extData.rating!
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
