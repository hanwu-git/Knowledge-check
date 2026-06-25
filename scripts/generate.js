// 生成初二数学例题JSON文件 - 主入口脚本
const fs = require('fs');
const path = require('path');

const outputDir = 'd:\\obj\\学生复习\\data\\examples';

// 加载所有数据
const data = {};
const dataDir = path.join(__dirname, 'data');
const dataFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('math_') && f.endsWith('.js')).sort();

for (const file of dataFiles) {
  const module = require(path.join(dataDir, file));
  Object.assign(data, module);
}

// 统计
const ids = Object.keys(data);
console.log(`加载了 ${ids.length} 个知识点`);

let successCount = 0;
let errorCount = 0;
let placeholderCount = 0;
const errors = [];

for (const kid of ids) {
  const questions = data[kid];
  if (!Array.isArray(questions) || questions.length !== 10) {
    errorCount++;
    errors.push(`${kid}: 题目数量不是10 (${questions ? questions.length : 0})`);
    continue;
  }

  const items = questions.map((q, i) => ({
    id: `${kid}_ex${String(i + 1).padStart(2, '0')}`,
    knowledge_id: kid,
    question: q.q,
    answer: q.a
  }));

  const filePath = path.join(outputDir, `${kid}_010.json`);
  try {
    const content = JSON.stringify(items, null, 2);
    // 验证JSON可解析
    JSON.parse(content);
    fs.writeFileSync(filePath, content, 'utf-8');
    // 检查是否为占位符
    const isPlaceholder = items.some(it => it.question.includes('相关练习题目') || it.answer.includes('答案和详细解析'));
    if (isPlaceholder) {
      placeholderCount++;
      errors.push(`${kid}: 仍包含占位符内容`);
    } else {
      successCount++;
    }
  } catch (e) {
    errorCount++;
    errors.push(`${kid}: ${e.message}`);
  }
}

console.log(`\n=== 统计 ===`);
console.log(`成功生成: ${successCount}`);
console.log(`错误: ${errorCount}`);
console.log(`占位符: ${placeholderCount}`);
console.log(`总计: ${ids.length}`);

if (errors.length > 0) {
  console.log(`\n=== 错误列表 ===`);
  errors.forEach(e => console.log(e));
}

// 验证目录中所有g2_math_XXX_010.json文件
console.log(`\n=== 目录验证 ===`);
const dirFiles = fs.readdirSync(outputDir).filter(f => /^g2_math_\d{3}_010\.json$/.test(f));
console.log(`目录中 g2_math_XXX_010.json 格式的文件数: ${dirFiles.length}`);
const dirIds = new Set(dirFiles.map(f => f.replace('_010.json', '')));
const missing = ids.filter(id => !dirIds.has(id));
const extra = [...dirIds].filter(id => !ids.includes(id));
console.log(`生成但目录中没有: ${missing.length} 个`);
if (missing.length > 0) console.log('  ' + missing.join(', '));
console.log(`目录中有但未生成: ${extra.length} 个`);
if (extra.length > 0) console.log('  ' + extra.join(', '));
