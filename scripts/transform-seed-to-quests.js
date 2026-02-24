/**
 * Transform stages.json + dependencies.json into Quest-Task JSON structure
 * 
 * Quest: 19 main categories (displayed on canvas)
 * Task: 137 detailed stages (displayed in modal checklist)
 */

const fs = require('fs');
const path = require('path');

// Read existing JSON files
const stagesPath = path.join(__dirname, '..', 'lib', 'data', 'stages.json');
const depsPath = path.join(__dirname, '..', 'lib', 'data', 'dependencies.json');

const stages = JSON.parse(fs.readFileSync(stagesPath, 'utf8'));
const dependencies = JSON.parse(fs.readFileSync(depsPath, 'utf8'));

// Filter out circular dependencies
const validDependencies = dependencies.filter(dep => {
  if (dep.source === dep.target) {
    console.warn(`⚠️  Circular dependency skipped: ${dep.source} → ${dep.target}`);
    return false;
  }
  return true;
});

console.log(`✅ Loaded ${stages.length} stages and ${validDependencies.length} dependencies (${dependencies.length - validDependencies.length} circular refs removed)`);

// Group stages by category
const questMap = new Map();

stages.forEach(stage => {
  if (!questMap.has(stage.categoryId)) {
    questMap.set(stage.categoryId, {
      id: stage.categoryId,
      title: stage.category,
      icon: getQuestIcon(stage.categoryId),
      color: getQuestColor(stage.categoryId),
      xp: calculateQuestXP(stage.categoryId),
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

// Convert to Quest array
const quests = Array.from(questMap.values()).sort((a, b) => parseInt(a.id) - parseInt(b.id));

// Calculate Quest-level dependencies
const questDependencies = calculateQuestDependencies(validDependencies, stages);

// Add dependencies to quests
quests.forEach(quest => {
  quest.dependencies = questDependencies.get(quest.id) || [];
});

// Save to JSON
const outputPath = path.join(__dirname, '..', 'lib', 'data', 'quests.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(quests, null, 2));

console.log(`✅ Generated ${quests.length} quests → ${outputPath}`);

// Generate summary
console.log('\n=== QUEST SUMMARY ===');
quests.forEach(quest => {
  console.log(`${quest.id}. ${quest.title} (${quest.tasks.length} tasks, deps: [${quest.dependencies.join(', ')}])`);
});

// Helper functions
function getQuestIcon(categoryId) {
  const icons = {
    '1': 'ClipboardList',
    '2': 'Users',
    '3': 'Sparkles',
    '4': 'Building2',
    '5': 'Camera',
    '6': 'Shirt',
    '7': 'Palette',
    '8': 'User',
    '9': 'Gem',
    '10': 'Heart',
    '11': 'Home',
    '12': 'Hammer',
    '13': 'Sofa',
    '14': 'Mail',
    '15': 'Calendar',
    '16': 'Smile',
    '17': 'Plane',
    '18': 'Truck',
    '19': 'FileText'
  };
  return icons[categoryId] || 'Circle';
}

function getQuestColor(categoryId) {
  const colors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B',
    '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
    '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4',
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
  ];
  return colors[parseInt(categoryId) - 1] || '#6366F1';
}

function calculateQuestXP(categoryId) {
  // Base XP: 100 per quest
  return 100;
}

function calculateQuestDependencies(dependencies, stages) {
  const questDeps = new Map();
  
  // Build stage-to-category map
  const stageCategoryMap = new Map();
  stages.forEach(s => stageCategoryMap.set(s.id, s.categoryId));
  
  // For each dependency, map to quest-level
  dependencies.forEach(dep => {
    const targetCategory = stageCategoryMap.get(dep.target);
    const prereqCategory = stageCategoryMap.get(dep.source);
    
    if (!targetCategory || !prereqCategory || targetCategory === prereqCategory) {
      return; // Skip intra-quest dependencies
    }
    
    if (!questDeps.has(targetCategory)) {
      questDeps.set(targetCategory, new Set());
    }
    questDeps.get(targetCategory).add(prereqCategory);
  });
  
  // Convert Sets to Arrays
  const result = new Map();
  questDeps.forEach((deps, questId) => {
    result.set(questId, Array.from(deps).sort());
  });
  
  return result;
}
