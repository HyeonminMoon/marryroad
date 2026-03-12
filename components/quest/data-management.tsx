'use client';

import { useRef, useState } from 'react';
import { Download, Upload, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportData, importData } from '@/lib/utils/data-io';
import { motion, AnimatePresence } from 'framer-motion';

export function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmImport, setConfirmImport] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleExport = () => {
    const result = exportData();
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setConfirmImport(true);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;
    const result = await importData(pendingFile);
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    setConfirmImport(false);
    setPendingFile(null);

    if (result.success) {
      // Reload to re-initialize store from updated localStorage
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">데이터 관리</span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        진행 상황을 파일로 백업하거나 이전 백업을 불러올 수 있습니다.
      </p>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExport} className="flex-1">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          내보내기
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <Upload className="w-3.5 h-3.5 mr-1.5" />
          불러오기
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Import confirmation */}
      <AnimatePresence>
        {confirmImport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800"
          >
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
              기존 데이터를 덮어쓰게 됩니다. 계속하시겠습니까?
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleConfirmImport} className="text-xs">
                덮어쓰기
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setConfirmImport(false); setPendingFile(null); }}
                className="text-xs"
              >
                취소
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 flex items-center gap-2 text-xs p-2 rounded-lg ${
              feedback.type === 'success'
                ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
