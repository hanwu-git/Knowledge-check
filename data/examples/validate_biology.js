// 验证生物例题文件
const fs = require('fs');
const path = require('path');

const baseDir = 'd:\\obj\\学生复习\\data\\examples';

let totalFiles = 0;
let validFiles = 0;
let invalidFiles = [];
let filesWithoutPlaceholders = 0;
let filesWithPlaceholders = [];

console.log('开始验证JSON文件...\n');

// 检查上册文件
console.log('=== 验证上册文件 (g2_biology_u001~u033) ===');
for (let i = 1; i <= 33; i++) {
  const num = String(i).padStart(3, '0');
  const fileName = `g2_biology_u${num}_010.json`;
  const filePath = path.join(baseDir, fileName);
  
  totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // 检查是否10道题
    if (data.length !== 10) {
      invalidFiles.push(`${fileName}: 题数${data.length}不为10`);
      continue;
    }
    
    // 检查是否有占位符
    let hasPlaceholder = false;
    for (const item of data) {
      if (item.answer && item.answer.includes('xxx')) {
        hasPlaceholder = true;
        break;
      }
    }
    
    if (hasPlaceholder) {
      filesWithPlaceholders.push(fileName);
    } else {
      filesWithoutPlaceholders++;
    }
    
    // 验证每道题的格式
    let formatValid = true;
    for (const item of data) {
      if (!item.id || !item.knowledge_id || !item.question || !item.answer) {
        formatValid = false;
        break;
      }
    }
    
    if (formatValid) {
      validFiles++;
    } else {
      invalidFiles.push(`${fileName}: 题目格式不完整`);
    }
    
  } catch (e) {
    invalidFiles.push(`${fileName}: JSON解析错误 - ${e.message}`);
  }
}

// 检查下册文件
console.log('=== 验证下册文件 (g2_biology_l001~l033) ===');
for (let i = 1; i <= 33; i++) {
  const num = String(i).padStart(3, '0');
  const fileName = `g2_biology_l${num}_010.json`;
  const filePath = path.join(baseDir, fileName);
  
  totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // 检查是否10道题
    if (data.length !== 10) {
      invalidFiles.push(`${fileName}: 题数${data.length}不为10`);
      continue;
    }
    
    // 检查是否有占位符
    let hasPlaceholder = false;
    for (const item of data) {
      if (item.answer && item.answer.includes('xxx')) {
        hasPlaceholder = true;
        break;
      }
    }
    
    if (hasPlaceholder) {
      filesWithPlaceholders.push(fileName);
    } else {
      filesWithoutPlaceholders++;
    }
    
    // 验证每道题的格式
    let formatValid = true;
    for (const item of data) {
      if (!item.id || !item.knowledge_id || !item.question || !item.answer) {
        formatValid = false;
        break;
      }
    }
    
    if (formatValid) {
      validFiles++;
    } else {
      invalidFiles.push(`${fileName}: 题目格式不完整`);
    }
    
  } catch (e) {
    invalidFiles.push(`${fileName}: JSON解析错误 - ${e.message}`);
  }
}

// 输出验证报告
console.log('\n========== 验证结果报告 ==========');
console.log(`总文件数: ${totalFiles}`);
console.log(`有效文件数: ${validFiles}`);
console.log(`无效文件数: ${invalidFiles.length}`);
console.log(`无占位符文件数: ${filesWithoutPlaceholders}`);
console.log(`含占位符文件数: ${filesWithPlaceholders.length}`);

if (invalidFiles.length > 0) {
  console.log('\n无效文件列表:');
  invalidFiles.forEach(f => console.log(`  - ${f}`));
}

if (filesWithPlaceholders.length > 0) {
  console.log('\n含占位符文件列表:');
  filesWithPlaceholders.forEach(f => console.log(`  - ${f}`));
}

if (validFiles === 66 && filesWithPlaceholders.length === 0) {
  console.log('\n✓ 所有文件验证通过！');
} else {
  console.log('\n✗ 存在问题，请检查！');
}
