const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');
const errors = [];
const results = [];

const files = fs.readdirSync(EXAMPLE_DIR)
    .filter(f => f.startsWith('g2_physics_') && f.endsWith('_010.json'))
    .sort();

files.forEach(fileName => {
  const filePath = path.join(EXAMPLE_DIR, fileName);

  const result = {
    fileName,
    exists: false,
    isValidJson: false,
    questionCount: 0,
    hasSubstantiveContent: false,
    knowledgeId: '',
    errors: []
  };

  if (!fs.existsSync(filePath)) {
    result.errors.push('文件不存在');
    errors.push(result);
    results.push(result);
    return;
  }

  result.exists = true;
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    result.errors.push(`读取失败: ${e.message}`);
    errors.push(result);
    results.push(result);
    return;
  }

  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    result.errors.push(`JSON解析失败: ${e.message}`);
    errors.push(result);
    results.push(result);
    return;
  }
  result.isValidJson = true;

  if (!Array.isArray(data)) {
    result.errors.push('内容不是数组');
    errors.push(result);
    results.push(result);
    return;
  }

  result.questionCount = data.length;

  if (data.length !== 10) {
    result.errors.push(`题目数量不是10，实际为${data.length}`);
  }

  let isPlaceholder = false;
  for (const item of data) {
    if (!item.question || !item.answer) {
      result.errors.push('题目缺少question或answer字段');
    }
    if (item.question && (item.question.includes('练习') && item.question.includes('请根据所学知识'))) {
      isPlaceholder = true;
    }
    if (item.answer && item.answer.includes('本题答案为：xxx')) {
      isPlaceholder = true;
    }
  }

  if (isPlaceholder) {
    result.errors.push('内容仍为占位符');
  } else {
    result.hasSubstantiveContent = true;
  }

  if (data[0] && data[0].knowledge_id) {
    result.knowledgeId = data[0].knowledge_id;
  }

  if (result.errors.length > 0) {
    errors.push(result);
  }
  results.push(result);
});

console.log('=== 验证结果汇总 ===');
console.log(`总文件数: ${results.length}`);
console.log(`有错误的文件数: ${errors.length}`);
console.log(`有效文件数: ${results.length - errors.length}`);
console.log();

if (errors.length > 0) {
  console.log('=== 错误详情 ===');
  errors.forEach(r => {
    console.log(`文件 ${r.fileName}:`);
    r.errors.forEach(e => console.log(`  - ${e}`));
  });
} else {
  console.log('所有文件验证通过！');
}

const totalQuestions = results.reduce((sum, r) => sum + r.questionCount, 0);
console.log(`\n总题数: ${totalQuestions}`);
