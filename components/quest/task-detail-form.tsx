'use client';

import React, { useState } from 'react';
import { Task, TaskExtendedData } from '@/lib/types/quest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DollarSign,
  ChevronDown,
  FileText,
  Calendar,
  Building2,
  Star,
  Camera,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskDetailFormProps {
  task: Task;
  isCompleted: boolean;
  onComplete: (data: {
    cost?: number;
    memo?: string;
    date?: string;
    vendorInfo?: TaskExtendedData['vendorInfo'];
    rating?: number;
    photos?: string[];
  }) => void;
}

export function TaskDetailForm({ task, isCompleted, onComplete }: TaskDetailFormProps) {
  const [showDetails, setShowDetails] = useState(false);
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

  const handleSubmit = () => {
    onComplete({
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
  };

  const StarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setFormData({ ...formData, rating: star })}
          className="transition-transform hover:scale-110"
          disabled={isCompleted}
        >
          <Star
            className={`w-6 h-6 ${
              star <= formData.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 기본 정보: 비용 */}
      <div>
        <Label htmlFor={`cost-${task.id}`} className="text-sm font-semibold flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          실제 비용
        </Label>
        {(task.typicalCostMin || task.typicalCostMax) && (
          <p className="text-xs text-gray-500 mt-1">
            평균: {task.typicalCostMin?.toLocaleString()}~{task.typicalCostMax?.toLocaleString()}원
          </p>
        )}
        <Input
          id={`cost-${task.id}`}
          type="number"
          placeholder="실제 비용 입력"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          className="mt-2"
          disabled={isCompleted}
        />
      </div>

      {/* 펼치기/접기 버튼 */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full"
      >
        <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
        {showDetails ? '상세 정보 접기' : '상세 정보 추가하기'}
      </Button>

      {/* 상세 정보 (접을 수 있음) */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 border-t pt-4"
        >
          {/* 메모 */}
          <div>
            <Label htmlFor={`memo-${task.id}`} className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              메모
            </Label>
            <Textarea
              id={`memo-${task.id}`}
              placeholder="이 작업에 대한 메모를 입력하세요..."
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="mt-2 min-h-[100px]"
              disabled={isCompleted}
            />
          </div>

          {/* 완료 날짜 */}
          <div>
            <Label htmlFor={`date-${task.id}`} className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              완료 날짜
            </Label>
            <Input
              id={`date-${task.id}`}
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-2"
              disabled={isCompleted}
            />
          </div>

          {/* 업체 정보 */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              업체 정보
            </h4>
            
            <div>
              <Label htmlFor={`vendor-name-${task.id}`} className="text-xs">
                업체명
              </Label>
              <Input
                id={`vendor-name-${task.id}`}
                placeholder="업체 이름"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className="mt-1"
                disabled={isCompleted}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`vendor-contact-${task.id}`} className="text-xs">
                  연락처
                </Label>
                <Input
                  id={`vendor-contact-${task.id}`}
                  placeholder="010-0000-0000"
                  value={formData.vendorContact}
                  onChange={(e) => setFormData({ ...formData, vendorContact: e.target.value })}
                  className="mt-1"
                  disabled={isCompleted}
                />
              </div>
              <div>
                <Label htmlFor={`vendor-website-${task.id}`} className="text-xs">
                  웹사이트
                </Label>
                <Input
                  id={`vendor-website-${task.id}`}
                  placeholder="https://..."
                  value={formData.vendorWebsite}
                  onChange={(e) => setFormData({ ...formData, vendorWebsite: e.target.value })}
                  className="mt-1"
                  disabled={isCompleted}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`vendor-address-${task.id}`} className="text-xs">
                주소
              </Label>
              <Input
                id={`vendor-address-${task.id}`}
                placeholder="업체 주소"
                value={formData.vendorAddress}
                onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                className="mt-1"
                disabled={isCompleted}
              />
            </div>
          </div>

          {/* 평점 */}
          <div>
            <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Star className="w-4 h-4" />
              만족도
            </Label>
            <StarRating />
          </div>

          {/* 사진 (추후 구현) */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-semibold">사진 첨부</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              곧 사진 업로드 기능이 추가됩니다!
            </p>
          </div>
        </motion.div>
      )}

      {/* 완료 버튼 */}
      {!isCompleted && (
        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          작업 완료하기
        </Button>
      )}
    </div>
  );
}
