'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Share2, Download, Loader2, X } from 'lucide-react';
import { generateShareCard, shareCard, downloadCard } from '@/lib/utils/share-card';
import { useQuestStore } from '@/lib/stores/quest-store';
import { motion } from 'framer-motion';

export function ShareCardButton() {
  const { progress, quests } = useQuestStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalQuests = quests.length;
  const completedQuests = progress.completedQuestIds.length;
  const progressPercent = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  const dDay = progress.weddingDate
    ? Math.ceil((new Date(progress.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const generatedBlob = await generateShareCard({
        coupleName: progress.coupleNames || undefined,
        progressPercent,
        completedQuests,
        totalQuests,
        dDay,
      });
      const url = URL.createObjectURL(generatedBlob);
      setPreviewUrl(url);
      setBlob(generatedBlob);
      setDialogOpen(true);
    } catch (err) {
      console.error('Failed to generate share card:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [progress.coupleNames, progressPercent, completedQuests, totalQuests, dDay]);

  const handleShare = useCallback(async () => {
    if (blob) await shareCard(blob);
  }, [blob]);

  const handleDownload = useCallback(() => {
    if (blob) downloadCard(blob);
  }, [blob]);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setBlob(null);
  }, [previewUrl]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">진행률 공유하기</h3>
            <p className="text-white/70 text-xs mt-0.5">
              예쁜 카드로 결혼 준비 현황을 공유하세요
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="sm"
            className="bg-white text-purple-600 hover:bg-white/90 shadow-sm"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-1.5" />
                만들기
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Preview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>진행률 카드</DialogTitle>
            <DialogDescription>
              이미지를 공유하거나 다운로드하세요
            </DialogDescription>
          </DialogHeader>

          {previewUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="진행률 카드 미리보기"
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <Button onClick={handleShare} className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
