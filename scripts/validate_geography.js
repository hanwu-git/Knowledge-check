// 验证初二地理例题JSON文件
// 用法：node validate_geography.js

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');

const expectedIds = [];
for (let i = 1; i <= 50; i++) {
  const num = String(i).padStart(3, '0');
  expectedIds.push('g2_geography_u' + num);
}
for (let i = 1; i <= 35; i++) {
  const num = String(i).padStart(3, '0');
  expectedIds.push('g2_geography_l' + num);
}

let allValid = true;
let validCount = 0;
let fileCount = 0;
let totalQuestions = 0;
const errors = [];

// 验证所有文件
expectedIds.forEach(id => {
  const fileName = id + '_010.json';
  const filePath = path.join(OUTPUT_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    errors.push('文件不存在: ' + fileName);
    allValid = false;
    return;
  }

  fileCount++;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      errors.push(fileName + ': 不是数组');
      allValid = false;
      return;
    }

    if (data.length !== 10) {
      errors.push(fileName + ': 题目数量错误（应有10道，实际' + data.length + '道）');
      allValid = false;
      return;
    }

    // 验证每道题的格式
    data.forEach((q, index) => {
      if (!q.id || !q.knowledge_id || !q.question || !q.answer) {
        errors.push(fileName + ' 第' + (index+1) + '道题字段不完整');
        allValid = false;
      }
      if (q.knowledge_id !== id) {
        errors.push(fileName + ' 第' + (index+1) + '道题knowledge_id错误: ' + q.knowledge_id);
        allValid = false;
      }
      // 检查题目不是占位符
      if (q.question.includes('占位符') || q.question.includes('placeholder')) {
        errors.push(fileName + ' 第' + (index+1) + '道题是占位符');
        allValid = false;
      }
    });

    totalQuestions += data.length;
    validCount++;
  } catch (err) {
    errors.push(fileName + ': JSON解析失败 - ' + err.message);
    allValid = false;
  }
});

console.log('='.repeat(60));
console.log('初二地理例题JSON文件验证报告');
console.log('='.repeat(60));
console.log('期望文件数: ' + expectedIds.length);
console.log('实际文件数: ' + fileCount);
console.log('有效文件数: ' + validCount);
console.log('总题目数: ' + totalQuestions);
console.log('='.repeat(60));

if (errors.length > 0) {
  console.log('错误列表:');
  errors.forEach(err => console.log('  - ' + err));
  console.log('='.repeat(60));
  console.log('验证结果: ❌ 有错误');
} else {
  console.log('验证结果: ✅ 全部通过');
}
console.log('='.repeat(60));

process.exit(allValid ? 0 : 1);
