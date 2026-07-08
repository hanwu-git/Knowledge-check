const fs = require('fs');
const path = require('path');

const files = ['g3_history_031_010.json', 'g3_history_032_010.json', 'g3_history_033_010.json'];

for (const file of files) {
  const filePath = path.join('data', 'examples', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/"答案：\s*"/g, '"答案：');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`已修复 ${file}`);
}

console.log('\n修复完成，再次验证...');

for (const file of files) {
  const filePath = path.join('data', 'examples', file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`${file}: OK (${data.length}道题)`);
  } catch (e) {
    console.log(`${file}: 错误 - ${e.message}`);
  }
}
