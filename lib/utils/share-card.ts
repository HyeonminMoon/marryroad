/**
 * Generate a share card image using Canvas API
 */

interface ShareCardParams {
  coupleName?: { user: string; partner: string };
  progressPercent: number;
  completedQuests: number;
  totalQuests: number;
  dDay?: number | null; // positive = days until, null = not set
}

const SIZE = 1080;
const HALF = SIZE / 2;

function drawGradientBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  gradient.addColorStop(0, '#e0e7ff');   // indigo-100
  gradient.addColorStop(0.5, '#ede9fe'); // violet-100
  gradient.addColorStop(1, '#fce7f3');   // pink-100
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle decorative circles
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.arc(SIZE * 0.15, SIZE * 0.2, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(SIZE * 0.85, SIZE * 0.75, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.15, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawProgressRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  percent: number
) {
  const lineWidth = 16;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * percent) / 100;

  // Background ring
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Progress arc with gradient
  if (percent > 0) {
    const gradient = ctx.createLinearGradient(x - radius, y, x + radius, y);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();
  }

  // Percentage text
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.round(percent)}%`, x, y);
}

export async function generateShareCard(params: ShareCardParams): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // Background
  drawGradientBackground(ctx);

  let yOffset = 160;

  // Couple name
  if (params.coupleName) {
    ctx.fillStyle = '#374151';
    ctx.font = '600 48px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${params.coupleName.user}  ♥  ${params.coupleName.partner}`,
      HALF,
      yOffset
    );
    yOffset += 80;
  } else {
    yOffset += 20;
  }

  // Progress ring
  const ringY = yOffset + 140;
  drawProgressRing(ctx, HALF, ringY, 120, params.progressPercent);
  yOffset = ringY + 180;

  // "우리의 결혼 준비"
  ctx.fillStyle = '#6b7280';
  ctx.font = '400 36px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('우리의 결혼 준비', HALF, yOffset);
  yOffset += 60;

  // Quest count
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `${params.completedQuests} / ${params.totalQuests} 퀘스트 완료`,
    HALF,
    yOffset
  );
  yOffset += 80;

  // D-Day
  if (params.dDay != null) {
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
    const dDayText = params.dDay > 0 ? `D-${params.dDay}` : params.dDay === 0 ? 'D-Day!' : `D+${Math.abs(params.dDay)}`;
    ctx.fillText(dDayText, HALF, yOffset);
    yOffset += 60;
  }

  // Separator line
  const lineY = SIZE - 140;
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(HALF - 200, lineY);
  ctx.lineTo(HALF + 200, lineY);
  ctx.stroke();

  // Watermark
  ctx.fillStyle = '#9ca3af';
  ctx.font = '400 28px system-ui, -apple-system, sans-serif';
  ctx.fillText('MarryRoad • Wedding OS', HALF, SIZE - 80);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate image'));
      },
      'image/png',
      1.0
    );
  });
}

export async function shareCard(blob: Blob): Promise<boolean> {
  const file = new File([blob], 'marryroad-progress.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: '결혼 준비 진행률',
        text: '우리의 결혼 준비 현황을 공유합니다!',
        files: [file],
      });
      return true;
    } catch {
      // User cancelled or error
      return false;
    }
  }

  // Fallback: download
  downloadCard(blob);
  return true;
}

export function downloadCard(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'marryroad-progress.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
