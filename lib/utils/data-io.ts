import { QuestProgress } from '@/lib/types/quest';

const STORAGE_KEY = 'marryroad-quest-progress';
const DATA_VERSION = 1;

interface ExportData {
  version: number;
  exportDate: string;
  appName: 'MarryRoad';
  data: {
    state: { progress: QuestProgress };
  };
}

/** Export current progress as a downloadable JSON file */
export function exportData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    throw new Error('저장된 데이터가 없습니다.');
  }

  const parsed = JSON.parse(raw);

  const exportPayload: ExportData = {
    version: DATA_VERSION,
    exportDate: new Date().toISOString(),
    appName: 'MarryRoad',
    data: parsed,
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `marryroad-backup-${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Validate imported JSON structure */
function validateImportData(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;

  if (d.appName !== 'MarryRoad') return false;
  if (typeof d.version !== 'number') return false;
  if (typeof d.data !== 'object' || d.data === null) return false;

  const inner = d.data as Record<string, unknown>;
  if (typeof inner.state !== 'object' || inner.state === null) return false;

  const state = inner.state as Record<string, unknown>;
  if (typeof state.progress !== 'object' || state.progress === null) return false;

  const progress = state.progress as Record<string, unknown>;
  // Check essential fields
  if (!Array.isArray(progress.completedQuestIds)) return false;
  if (typeof progress.taskProgress !== 'object') return false;
  if (typeof progress.xp !== 'number') return false;

  return true;
}

/** Import progress data from a JSON file */
export function importData(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!validateImportData(parsed)) {
          resolve({
            success: false,
            message: '유효하지 않은 MarryRoad 백업 파일입니다.',
          });
          return;
        }

        // Write to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));

        resolve({
          success: true,
          message: `데이터를 성공적으로 불러왔습니다. (${parsed.exportDate?.split('T')[0] || '날짜 미상'} 백업)`,
        });
      } catch {
        resolve({
          success: false,
          message: '파일을 읽을 수 없습니다. JSON 형식인지 확인해주세요.',
        });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, message: '파일 읽기 오류가 발생했습니다.' });
    };

    reader.readAsText(file);
  });
}
