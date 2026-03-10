'use client';

import React, { useState, useEffect } from 'react';
import { Task, Quest, TaskExtendedData } from '@/lib/types/quest';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  DollarSign,
  FileText,
  Calendar,
  Building2,
  Star,
  ChevronRight,
  AlertTriangle,
  Pencil,
  Clock,
  Tag,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskDetailSheetProps {
  task: Task | null;
  quest: Quest;
  isCompleted: boolean;
  existingData?: {
    cost?: number;
    memo?: string;
    date?: string;
    vendorInfo?: TaskExtendedData['vendorInfo'];
    rating?: number;
  };
  open: boolean;
  onClose: () => void;
  onComplete: (taskId: string, data: {
    cost?: number;
    memo?: string;
    date?: string;
    vendorInfo?: TaskExtendedData['vendorInfo'];
    rating?: number;
  }) => void;
  onQuickComplete: (taskId: string) => void;
}

export function TaskDetailSheet({
  task,
  quest,
  isCompleted,
  existingData,
  open,
  onClose,
  onComplete,
  onQuickComplete,
}: TaskDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showVendor, setShowVendor] = useState(false);
  const [formData, setFormData] = useState({
    cost: '',
    memo: '',
    date: new Date().toISOString().split('T')[0],
    vendorName: '',
    vendorContact: '',
    vendorWebsite: '',
    vendorAddress: '',
    rating: 0,
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        cost: existingData?.cost?.toString() || '',
        memo: existingData?.memo || '',
        date: existingData?.date || new Date().toISOString().split('T')[0],
        vendorName: existingData?.vendorInfo?.name || '',
        vendorContact: existingData?.vendorInfo?.contact || '',
        vendorWebsite: existingData?.vendorInfo?.website || '',
        vendorAddress: existingData?.vendorInfo?.address || '',
        rating: existingData?.rating || 0,
      });
      setIsEditing(false);
      setShowVendor(!!(existingData?.vendorInfo?.name));
    }
  }, [task, existingData]);

  if (!task) return null;

  const hasCostField = task.typicalCostMin !== null || task.typicalCostMax !== null;
  const canEdit = !isCompleted || isEditing;

  const handleSubmit = () => {
    onComplete(task.id, {
      cost: formData.cost ? parseInt(formData.cost) : undefined,
      memo: formData.memo || undefined,
      date: formData.date || undefined,
      vendorInfo: formData.vendorName ? {
        name: formData.vendorName,
        contact: formData.vendorContact || undefined,
        website: formData.vendorWebsite || undefined,
        address: formData.vendorAddress || undefined,
      } : undefined,
      rating: formData.rating > 0 ? formData.rating : undefined,
    });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-2xl dark:bg-gray-900"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        <SheetHeader className="text-left px-2">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: quest.color + '20' }}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <span className="text-lg font-bold" style={{ color: quest.color }}>
                  {task.id.split('.').pop()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className={`text-lg ${isCompleted ? 'text-green-700 dark:text-green-400' : ''}`}>
                {task.title}
              </SheetTitle>
              <SheetDescription className="mt-1">
                {task.description}
              </SheetDescription>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
              <Calendar className="w-3 h-3" />
              {task.recommendedTiming}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {task.estimatedDuration}
            </span>
            {task.isOptional && (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                선택사항
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                완료
              </span>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-2">
          {/* Prerequisite Note */}
          {task.prerequisiteNote && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {task.prerequisiteNote}
              </p>
            </div>
          )}

          {/* Checklist */}
          {task.checklist.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                체크리스트
              </h4>
              <div className="space-y-2.5">
                {task.checklist.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.text}
                      </span>
                    </div>
                    {item.tips && (
                      <div className="ml-6 mt-1.5 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                        {item.tips}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Card */}
          {hasCostField && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
              <Label className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <DollarSign className="w-4 h-4" />
                비용
              </Label>
              {(task.typicalCostMin || task.typicalCostMax) && (
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 mb-2">
                  평균 {task.typicalCostMin?.toLocaleString()}~{task.typicalCostMax?.toLocaleString()}원
                </p>
              )}
              {canEdit ? (
                <Input
                  type="number"
                  placeholder="실제 비용을 입력하세요"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="bg-white dark:bg-gray-900"
                />
              ) : (
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {formData.cost ? `${parseInt(formData.cost).toLocaleString()}원` : '미입력'}
                </p>
              )}
            </div>
          )}

          {/* Memo Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FileText className="w-4 h-4" />
              메모
            </Label>
            {canEdit ? (
              <Textarea
                placeholder="이 작업에 대한 메모..."
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                className="mt-2 min-h-[80px] bg-white dark:bg-gray-900"
              />
            ) : (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {formData.memo || '메모 없음'}
              </p>
            )}
          </div>

          {/* Date Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              {isCompleted ? '완료 날짜' : '예정 날짜'}
            </Label>
            {canEdit ? (
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-2 bg-white dark:bg-gray-900"
              />
            ) : (
              <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formData.date}
              </p>
            )}
          </div>

          {/* Vendor Card (collapsible) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowVendor(!showVendor)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Building2 className="w-4 h-4" />
                업체 정보
                {formData.vendorName && !showVendor && (
                  <span className="text-xs font-normal text-gray-500">
                    — {formData.vendorName}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showVendor ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showVendor && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 space-y-3"
                >
                  {canEdit ? (
                    <>
                      <div>
                        <Label className="text-xs text-gray-500">업체명</Label>
                        <Input
                          placeholder="업체 이름"
                          value={formData.vendorName}
                          onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                          className="mt-1 bg-white dark:bg-gray-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">연락처</Label>
                          <Input
                            placeholder="010-0000-0000"
                            value={formData.vendorContact}
                            onChange={(e) => setFormData({ ...formData, vendorContact: e.target.value })}
                            className="mt-1 bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">웹사이트</Label>
                          <Input
                            placeholder="https://..."
                            value={formData.vendorWebsite}
                            onChange={(e) => setFormData({ ...formData, vendorWebsite: e.target.value })}
                            className="mt-1 bg-white dark:bg-gray-900"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">주소</Label>
                        <Input
                          placeholder="업체 주소"
                          value={formData.vendorAddress}
                          onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                          className="mt-1 bg-white dark:bg-gray-900"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      {formData.vendorName ? (
                        <>
                          <p className="font-semibold text-sm">{formData.vendorName}</p>
                          {formData.vendorContact && (
                            <p className="text-xs text-gray-500">{formData.vendorContact}</p>
                          )}
                          {formData.vendorWebsite && (
                            <p className="text-xs text-blue-500">{formData.vendorWebsite}</p>
                          )}
                          {formData.vendorAddress && (
                            <p className="text-xs text-gray-500">{formData.vendorAddress}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">업체 정보 없음</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rating Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
              <Star className="w-4 h-4" />
              만족도
            </Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => canEdit && setFormData({ ...formData, rating: star })}
                  className={`transition-transform ${canEdit ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                  disabled={!canEdit}
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 px-2 pb-4 sticky bottom-0 bg-white dark:bg-gray-900">
          {!isCompleted ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { onQuickComplete(task.id); onClose(); }}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                바로 완료
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                style={{ backgroundColor: quest.color }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                기록하고 완료
              </Button>
            </div>
          ) : !isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              <Pencil className="w-4 h-4 mr-2" />
              수정하기
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={() => { handleSubmit(); setIsEditing(false); }}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                저장하기
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
