const MESSAGES = [
  '{partner}와(과) 함께할 내일이 기대돼요 ✨',
  '오늘의 준비가 {partner}와(과)의 아름다운 하루를 만들어요',
  '결혼 준비, 힘들지만 {partner} 생각하면 괜찮죠? 💕',
  '{user}님, 오늘도 사랑하는 사람을 위해 한 걸음 더 👣',
  '세상에서 가장 설레는 프로젝트를 진행 중이에요',
  '{partner}와(과)의 특별한 날을 위해, 오늘도 파이팅!',
  '하나씩 완료할 때마다 {partner}와(과) 더 가까워져요',
  '당신이 준비하는 모든 것이 {partner}에게 감동이 될 거예요',
  '오늘 한 가지만 해도 괜찮아요. 중요한 건 함께하는 마음 💛',
  '{partner}와(과) 나누게 될 순간들을 상상해보세요 🌸',
  '완벽하지 않아도 돼요. {partner}와(과) 함께라면 그게 완벽이에요',
  '지금 이 순간도 나중에 소중한 추억이 될 거예요',
  '{user}님의 정성이 가장 아름다운 웨딩을 만들어요',
  '결혼 준비의 모든 순간이 러브스토리의 한 장면이에요 📖',
  '오늘도 {partner}를 위해 시간을 쓰는 당신이 멋져요',
  '힘들 때는 쉬어가도 돼요. {partner}도 그걸 바랄 거예요 🤗',
  '둘이서 함께 만드는 이야기, 가장 아름다운 챕터예요',
  '{partner}와(과) 웃으며 이 시간을 돌아볼 날이 올 거예요',
  '사랑하는 사람을 위한 준비, 그 자체가 사랑이에요 💍',
  '오늘 완료한 태스크 하나가 꿈꾸던 웨딩에 한 발 더 가까이',
];

/** Get today's motivational message with couple names */
export function getDailyMessage(userName?: string, partnerName?: string): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const template = MESSAGES[dayOfYear % MESSAGES.length];
  return template
    .replace(/\{partner\}/g, partnerName || '소중한 사람')
    .replace(/\{user\}/g, userName || '당신');
}
