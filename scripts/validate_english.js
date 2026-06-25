// 验证所有 g2_english_XXX_010.json 文件
const fs = require('fs');
const path = require('path');

const dir = 'd:\\obj\\学生复习\\data\\examples';
const files = fs.readdirSync(dir).filter(f => /^g2_english_[ul]\d{3}_010\.json$/.test(f)).sort();

console.log(`找到 ${files.length} 个 g2_english_XXX_010.json 文件\n`);

let allValid = true;
let totalQuestions = 0;
let placeholderFound = [];

// 按上册/下册统计
let upperCount = 0;
let lowerCount = 0;
let upperValid = 0;
let lowerValid = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // 统计上下册
    if (file.includes('_u')) {
      upperCount++;
    } else if (file.includes('_l')) {
      lowerCount++;
    }

    if (!Array.isArray(data)) {
      console.log(`✗ ${file}: 不是数组`);
      allValid = false;
      continue;
    }

    if (data.length !== 10) {
      console.log(`✗ ${file}: 题目数量 ${data.length} ≠ 10`);
      allValid = false;
      continue;
    }

    // 检查每道题
    let fileHasIssue = false;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const expectedId = file.replace('_010.json', `_ex${String(i + 1).padStart(2, '0')}`);

      if (!item.id || item.id !== expectedId) {
        console.log(`✗ ${file} 第${i + 1}题: id不正确 (${item.id} ≠ ${expectedId})`);
        allValid = false;
        fileHasIssue = true;
      }
      if (!item.knowledge_id) {
        console.log(`✗ ${file} 第${i + 1}题: 缺少 knowledge_id`);
        allValid = false;
        fileHasIssue = true;
      }
      if (!item.question || typeof item.question !== 'string' || item.question.length < 5) {
        console.log(`✗ ${file} 第${i + 1}题: question 缺失或过短`);
        allValid = false;
        fileHasIssue = true;
      }
      if (!item.answer || typeof item.answer !== 'string' || item.answer.length < 5) {
        console.log(`✗ ${file} 第${i + 1}题: answer 缺失或过短`);
        allValid = false;
        fileHasIssue = true;
      }

      // 检查占位符
      if (item.question.includes('相关练习题目') || item.answer.includes('答案和详细解析')) {
        placeholderFound.push(`${file} 第${i + 1}题`);
        fileHasIssue = true;
      }
    }

    if (!fileHasIssue) {
      if (file.includes('_u')) upperValid++;
      else lowerValid++;
    }

    totalQuestions += data.length;
  } catch (e) {
    console.log(`✗ ${file}: 解析失败 - ${e.message}`);
    allValid = false;
  }
}

console.log(`\n=== 验证结果 ===`);
console.log(`文件总数: ${files.length}`);
console.log(`题目总数: ${totalQuestions}`);
console.log(`全部有效: ${allValid ? '✓ 是' : '✗ 否'}`);
console.log(`发现占位符: ${placeholderFound.length} 个`);
if (placeholderFound.length > 0) {
  placeholderFound.forEach(p => console.log(`  - ${p}`));
}

console.log(`\n=== 分类统计 ===`);
console.log(`上册 (u001-u045): ${upperCount} 个文件`);
console.log(`下册 (l001-l042): ${lowerCount} 个文件`);
console.log(`上册有效文件: ${upperValid} 个`);
console.log(`下册有效文件: ${lowerValid} 个`);

// 抽样显示前两个文件内容
console.log(`\n=== 抽样: g2_english_u001_010.json ===`);
try {
  const sample1 = JSON.parse(fs.readFileSync(path.join(dir, 'g2_english_u001_010.json'), 'utf-8'));
  console.log(`第1题: ${sample1[0].question.substring(0, 80)}...`);
  console.log(`第1答: ${sample1[0].answer.substring(0, 80)}...`);
} catch (e) {
  console.log(`读取失败: ${e.message}`);
}

console.log(`\n=== 抽样: g2_english_l001_010.json ===`);
try {
  const sample2 = JSON.parse(fs.readFileSync(path.join(dir, 'g2_english_l001_010.json'), 'utf-8'));
  console.log(`第1题: ${sample2[0].question.substring(0, 80)}...`);
  console.log(`第1答: ${sample2[0].answer.substring(0, 80)}...`);
} catch (e) {
  console.log(`读取失败: ${e.message}`);
}

console.log(`\n=== 抽样: g2_english_u045_010.json ===`);
try {
  const sample3 = JSON.parse(fs.readFileSync(path.join(dir, 'g2_english_u045_010.json'), 'utf-8'));
  console.log(`第1题: ${sample3[0].question.substring(0, 80)}...`);
  console.log(`第1答: ${sample3[0].answer.substring(0, 80)}...`);
} catch (e) {
  console.log(`读取失败: ${e.message}`);
}

console.log(`\n=== 抽样: g2_english_l042_010.json ===`);
try {
  const sample4 = JSON.parse(fs.readFileSync(path.join(dir, 'g2_english_l042_010.json'), 'utf-8'));
  console.log(`第1题: ${sample4[0].question.substring(0, 80)}...`);
  console.log(`第1答: ${sample4[0].answer.substring(0, 80)}...`);
} catch (e) {
  console.log(`读取失败: ${e.message}`);
}
