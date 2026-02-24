const fs = require('fs');
const path = require('path');

const sqlPath = path.resolve(__dirname, '../../seed_data.sql');
const outputDir = path.resolve(__dirname, '../lib/data');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const stagesOutputPath = path.join(outputDir, 'stages.json');
const dependenciesOutputPath = path.join(outputDir, 'dependencies.json');

try {
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  console.log(`Reading SQL from: ${sqlPath}`);
  
  // Regex to match INSERT INTO stages
  // Format: INSERT INTO stages (col1, col2, ...) VALUES ('val1', 'val2', ...);
  // This is a simple parser and might fail on complex SQL strings with nested parentheses/quotes
  const stageInsertRegex = /INSERT INTO stages\s*\([^)]+\)\s*VALUES\s*\(([\s\S]*?)\);/g;
  
  const stages = [];
  let match;
  
  while ((match = stageInsertRegex.exec(sqlContent)) !== null) {
    const valuesString = match[1];
    
    // Split by comma, respecting quotes
    const values = [];
    let currentVal = '';
    let inQuote = false;
    
    for (let i = 0; i < valuesString.length; i++) {
      const char = valuesString[i];
      if (char === "'" && (i === 0 || valuesString[i-1] !== '\\')) {
        inQuote = !inQuote;
        currentVal += char;
      } else if (char === ',' && !inQuote) {
        values.push(cleanValue(currentVal));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(cleanValue(currentVal));
    
    // Map to object
    // Schema: id, category_id, category_name, subcategory_id, subcategory_name, title, description, priority, recommended_timing, estimated_duration, typical_cost_min, typical_cost_max, cost_percentage_min, cost_percentage_max, stage_order, icon_name, color, checklist_items, is_optional, tags, resources
    if (values.length >= 15) {
      stages.push({
        id: values[0],
        categoryId: values[1],
        category: values[2],
        subcategoryId: values[3],
        subcategory: values[4],
        title: values[5],
        description: values[6],
        priority: values[7],
        timing: values[8],
        duration: values[9],
        costMin: values[10] === 'NULL' ? null : Number(values[10]),
        costMax: values[11] === 'NULL' ? null : Number(values[11]),
        order: Number(values[14]),
        icon: values[15],
        color: values[16],
        checklist: parseJson(values[17]),
        isOptional: values[18] === 'true' || values[18] === 't',
        tags: parseArray(values[19])
      });
    }
  }

  // Regex for dependencies
  // INSERT INTO stage_prerequisites (stage_id, prerequisite_stage_id, dependency_type) VALUES ('1.1.3', '1.1.1', 'required');
  const depInsertRegex = /INSERT INTO stage_prerequisites\s*\([^)]+\)\s*VALUES\s*\('([^']+)',\s*'([^']+)',\s*'([^']+)'\);/g;
  const dependencies = [];
  
  while ((match = depInsertRegex.exec(sqlContent)) !== null) {
    dependencies.push({
      source: match[2], // prerequisite is the source
      target: match[1], // stage is the target
      type: match[3]
    });
  }
  
  console.log(`Parsed ${stages.length} stages and ${dependencies.length} dependencies.`);
  
  fs.writeFileSync(stagesOutputPath, JSON.stringify(stages, null, 2));
  fs.writeFileSync(dependenciesOutputPath, JSON.stringify(dependencies, null, 2));
  console.log(`Saved to ${stagesOutputPath} and ${dependenciesOutputPath}`);

} catch (err) {
  console.error('Error parsing SQL:', err);
}

function cleanValue(val) {
  val = val.trim();
  if (val.startsWith("'") && val.endsWith("'")) {
    val = val.substring(1, val.length - 1);
    // Unescape single quotes
    val = val.replace(/''/g, "'");
  }
  return val;
}

function parseJson(val) {
  if (!val) return [];
  try {
    // Remove casting syntax like ::jsonb
    const jsonStr = val.replace(/::jsonb$/, '').replace(/^'|'$/g, '');
    return JSON.parse(jsonStr);
  } catch (e) {
    return [];
  }
}

function parseArray(val) {
  if (!val) return [];
  try {
    // Postgres array format: '{"a","b"}'
    val = val.replace(/^'|'$/g, '');
    if (val.startsWith('{') && val.endsWith('}')) {
      return val.substring(1, val.length - 1).split(',').map(s => s.replace(/"/g, ''));
    }
    return [];
  } catch (e) {
    return [];
  }
}
