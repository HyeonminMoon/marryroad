/**
 * Quest 재구성 스크립트
 * 137개 tasks를 15개의 논리적 Quest로 재분류
 */

const fs = require('fs');
const path = require('path');

// Read original data
const stagesPath = path.join(__dirname, '..', 'lib', 'data', 'stages.json');
const stages = JSON.parse(fs.readFileSync(stagesPath, 'utf8'));

console.log(`✅ Loaded ${stages.length} stages`);

// 새로운 Quest 매핑 정의
const QUEST_MAPPING = {
  '1': { newId: '1', newName: '결혼 준비 기획 & 예산 관리', icon: 'ClipboardList', color: '#6366F1' },
  '2': { newId: '2', newName: '상견례 / 첫인사', icon: 'Users', color: '#8B5CF6' },
  '3': { newId: '3', newName: '웨딩홀 선정 & 플래너', icon: 'Building2', color: '#EC4899' },
  '4': { newId: '3', newName: '웨딩홀 선정 & 플래너', icon: 'Building2', color: '#EC4899' }, // 3과 4 통합
  '5': { newId: '4', newName: '스드메 패키지 (스튜디오+드레스+메이크업)', icon: 'Camera', color: '#EF4444' }, // 5,6,7 통합
  '6': { newId: '4', newName: '스드메 패키지 (스튜디오+드레스+메이크업)', icon: 'Camera', color: '#EF4444' },
  '7': { newId: '4', newName: '스드메 패키지 (스튜디오+드레스+메이크업)', icon: 'Camera', color: '#EF4444' },
  '8': { newId: '5', newName: '신랑 준비 (예복+관리)', icon: 'User', color: '#F59E0B' }, // 8, 16 통합
  '9': { newId: '6', newName: '예물 / 예단', icon: 'Gem', color: '#10B981' },
  '10': { newId: '11', newName: '혼주 의상 & 본식 준비', icon: 'Heart', color: '#06B6D4' }, // 10, 15 통합
  '11': { newId: '8', newName: '신혼집 준비', icon: 'Home', color: '#3B82F6' },
  '12': { newId: '9', newName: '인테리어', icon: 'Hammer', color: '#6366F1' },
  '13': { newId: '10', newName: '혼수 / 가전 / 가구', icon: 'Sofa', color: '#8B5CF6' },
  '14': { newId: '7', newName: '청첩장 / 하객 관리', icon: 'Mail', color: '#EC4899' },
  '15': { newId: '11', newName: '혼주 의상 & 본식 준비', icon: 'Heart', color: '#06B6D4' }, // 10, 15 통합
  '16': { newId: '5', newName: '신랑 준비 (예복+관리)', icon: 'User', color: '#F59E0B' }, // 8, 16 통합
  '17': { newId: '12', newName: '허니문 (신혼여행)', icon: 'Plane', color: '#EF4444' },
  '18': { newId: '13', newName: '이사 / 입주', icon: 'Truck', color: '#F59E0B' },
  '19': { newId: '14', newName: '행정 / 재정', icon: 'FileText', color: '#10B981' },
};

// 종속성 정의 (논리적 순서)
const QUEST_DEPENDENCIES = {
  '1': [], // 제일 먼저
  '2': ['1'], // 기획 후 상견례
  '3': ['1', '2'], // 기획 & 상견례 후 웨딩홀
  '4': ['1', '3'], // 기획 & 웨딩홀 후 스드메
  '5': ['4'], // 스드메 후 신랑 준비
  '6': ['2'], // 상견례 후 예물
  '7': ['3'], // 웨딩홀 후 청첩장 (주소 필요)
  '8': ['2'], // 상견례 후 신혼집
  '9': ['8'], // 신혼집 후 인테리어
  '10': ['8', '9'], // 신혼집 & 인테리어 후 혼수
  '11': ['3', '4', '7'], // 웨딩홀, 스드메, 청첩장 후 본식 준비
  '12': ['1'], // 기획 후 허니문 (병렬 가능)
  '13': ['10'], // 혼수 후 이사
  '14': ['11'], // 본식 후 행정
};

// Stages 재분류
const updatedStages = stages.map(stage => {
  const mapping = QUEST_MAPPING[stage.categoryId];
  if (!mapping) {
    console.warn(`⚠️  No mapping for category ${stage.categoryId}`);
    return stage;
  }
  
  return {
    ...stage,
    categoryId: mapping.newId,
    category: mapping.newName,
  };
});

// 저장
fs.writeFileSync(stagesPath, JSON.stringify(updatedStages, null, 2));
console.log(`✅ Updated stages.json (${updatedStages.length} stages)`);

// Quest 생성
const questMap = new Map();

updatedStages.forEach(stage => {
  if (!questMap.has(stage.categoryId)) {
    const mapping = Object.values(QUEST_MAPPING).find(m => m.newId === stage.categoryId);
    questMap.set(stage.categoryId, {
      id: stage.categoryId,
      title: stage.category,
      icon: mapping.icon,
      color: mapping.color,
      xp: 100,
      dependencies: QUEST_DEPENDENCIES[stage.categoryId] || [],
      tasks: []
    });
  }
  
  questMap.get(stage.categoryId).tasks.push({
    id: stage.id,
    title: stage.title,
    description: stage.description || '',
    priority: stage.priority,
    recommendedTiming: stage.timing,
    estimatedDuration: stage.duration,
    checklist: stage.checklist,
    isOptional: stage.isOptional,
    tags: stage.tags,
    typicalCostMin: stage.costMin,
    typicalCostMax: stage.costMax,
  });
});

const quests = Array.from(questMap.values()).sort((a, b) => 
  parseInt(a.id) - parseInt(b.id)
);

const questsPath = path.join(__dirname, '..', 'lib', 'data', 'quests.json');
fs.writeFileSync(questsPath, JSON.stringify(quests, null, 2));

console.log(`✅ Generated ${quests.length} quests → ${questsPath}`);

// Summary
console.log('\n=== QUEST SUMMARY ===');
quests.forEach(quest => {
  console.log(`${quest.id}. ${quest.title} (${quest.tasks.length} tasks, deps: [${quest.dependencies.join(', ')}])`);
});
