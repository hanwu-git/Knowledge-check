const fs = require('fs');
const path = require('path');

const outputDir = './data/examples/';
let errors = [];
let totalFiles = 0;
let totalQuestions = 0;

function validate() {
  // 检查上册 u001-u030
  for (let i = 1; i <= 30; i++) {
    const num = String(i).padStart(3, '0');
    const filename = `g2_daofa_u${num}_010.json`;
    const filepath = path.join(outputDir, filename);
    validateFile(filepath, filename, `g2_daofa_u${num}`);
  }

  // 检查下册 l001-l030
  for (let i = 1; i <= 30; i++) {
    const num = String(i).padStart(3, '0');
    const filename = `g2_daofa_l${num}_010.json`;
    const filepath = path.join(outputDir, filename);
    validateFile(filepath, filename, `g2_daofa_l${num}`);
  }

  console.log('\n========== 验证结果 ==========');
  console.log(`总文件数: ${totalFiles}`);
  console.log(`总题数: ${totalQuestions}`);
  console.log(`错误数: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n错误列表:');
    errors.forEach(e => console.log(`- ${e}`));
  } else {
    console.log('\n所有文件验证通过！');
  }
}

function validateFile(filepath, filename, expectedKid) {
  totalFiles++;

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);

    // 检查是否为数组
    if (!Array.isArray(data)) {
      errors.push(`${filename}: 不是数组格式`);
      return;
    }

    // 检查是否包含10道题
    if (data.length !== 10) {
      errors.push(`${filename}: 包含 ${data.length} 道题，期望10道`);
      return;
    }

    totalQuestions += data.length;

    // 检查每道题
    data.forEach((q, i) => {
      // 检查id格式
      if (!q.id || !q.id.startsWith(`${expectedKid}_ex`)) {
        errors.push(`${filename}: 第${i+1}题ID格式错误: ${q.id}`);
      }

      // 检查knowledge_id
      if (q.knowledge_id !== expectedKid) {
        errors.push(`${filename}: 第${i+1}题knowledge_id错误: ${q.knowledge_id}`);
      }

      // 检查是否有占位符
      if (q.question.includes('xxx') || q.answer.includes('xxx')) {
        errors.push(`${filename}: 第${i+1}题包含占位符`);
      }

      // 检查question和answer不为空
      if (!q.question || q.question.trim() === '') {
        errors.push(`${filename}: 第${i+1}题question为空`);
      }
      if (!q.answer || q.answer.trim() === '') {
        errors.push(`${filename}: 第${i+1}题answer为空`);
      }
    });

  } catch (e) {
    errors.push(`${filename}: JSON解析失败 - ${e.message}`);
  }
}

validate();
