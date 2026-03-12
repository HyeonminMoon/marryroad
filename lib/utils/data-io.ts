import { QuestProgress } from '@/lib/types/quest';

const QUEST_STORAGE_KEY = 'marryroad-quest-storage';
const GUEST_STORAGE_KEY = 'marryroad-guests';
const DATA_VERSION = 2;

interface ExportData {
  version: number;
  exportDate: string;
  appName: 'MarryRoad';
  data: {
    quest: { state: { progress: QuestProgress } };
    guests?: unknown;
  };
}

/** Legacy format (v1) for backward compatibility */
interface ExportDataV1 {
  version: number;
  exportDate: string;
  appName: 'MarryRoad';
  data: {
    state: { progress: QuestProgress };
  };
}

type ImportPayload = ExportData | ExportDataV1;

/** Export current progress as a downloadable JSON file */
export function exportData(): { success: boolean; message: string } {
  try {
    const questRaw = localStorage.getItem(QUEST_STORAGE_KEY);
    if (!questRaw) {
      return { success: false, message: '저장된 데이터가 없습니다.' };
    }

    const questParsed = JSON.parse(questRaw);
    const guestRaw = localStorage.getItem(GUEST_STORAGE_KEY);
    const guestParsed = guestRaw ? JSON.parse(guestRaw) : null;

    const exportPayload: ExportData = {
      version: DATA_VERSION,
      exportDate: new Date().toISOString(),
      appName: 'MarryRoad',
      data: {
        quest: questParsed,
        ...(guestParsed ? { guests: guestParsed } : {}),
      },
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

    return { success: true, message: '백업 파일이 다운로드되었습니다.' };
  } catch {
    return { success: false, message: '데이터 내보내기 중 오류가 발생했습니다.' };
  }
}

/** Check if payload is legacy v1 format */
function isV1Format(data: ImportPayload): data is ExportDataV1 {
  const d = data as unknown as Record<string, unknown>;
  const inner = d.data as Record<string, unknown>;
  return inner.state !== undefined && inner.quest === undefined;
}

/** Validate imported JSON structure */
function validateImportData(data: unknown): data is ImportPayload {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;

  if (d.appName !== 'MarryRoad') return false;
  if (typeof d.version !== 'number') return false;
  if (typeof d.data !== 'object' || d.data === null) return false;

  const inner = d.data as Record<string, unknown>;

  // v2 format: data.quest.state.progress
  if (inner.quest !== undefined) {
    if (typeof inner.quest !== 'object' || inner.quest === null) return false;
    const questData = inner.quest as Record<string, unknown>;
    if (typeof questData.state !== 'object' || questData.state === null) return false;
    const state = questData.state as Record<string, unknown>;
    if (typeof state.progress !== 'object' || state.progress === null) return false;
    const progress = state.progress as Record<string, unknown>;
    if (!Array.isArray(progress.completedQuestIds)) return false;
    if (typeof progress.taskProgress !== 'object') return false;
    if (typeof progress.xp !== 'number') return false;
    return true;
  }

  // v1 format: data.state.progress
  if (typeof inner.state !== 'object' || inner.state === null) return false;
  const state = inner.state as Record<string, unknown>;
  if (typeof state.progress !== 'object' || state.progress === null) return false;
  const progress = state.progress as Record<string, unknown>;
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

        // Handle v1 and v2 formats
        let questStorageData: Record<string, unknown>;
        if (isV1Format(parsed)) {
          // v1: wrap in zustand persist format { state: { progress }, version: 0 }
          const v1Data = parsed.data as { state: { progress: QuestProgress } };
          questStorageData = {
            state: { progress: v1Data.state.progress },
            version: 0,
          };
        } else {
          // v2: data.quest is already in zustand persist format
          questStorageData = parsed.data.quest as Record<string, unknown>;
          if (parsed.data.guests) {
            localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(parsed.data.guests));
          }
        }

        // Recalculate budget.spent from taskCosts
        const stateObj = questStorageData.state as { progress: QuestProgress } | undefined;
        if (stateObj?.progress?.taskProgress) {
          let totalSpent = 0;
          for (const qp of Object.values(stateObj.progress.taskProgress)) {
            if (qp?.taskCosts) {
              for (const cost of Object.values(qp.taskCosts)) {
                totalSpent += cost || 0;
              }
            }
          }
          stateObj.progress.budget = {
            ...(stateObj.progress.budget || {}),
            total: stateObj.progress.budget?.total ?? 0,
            spent: totalSpent,
          };
        }

        localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(questStorageData));

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
