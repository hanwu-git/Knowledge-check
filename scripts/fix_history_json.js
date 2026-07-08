const fs = require('fs');
const path = require('path');

const files = ['g3_history_031_010.json', 'g3_history_032_010.json', 'g3_history_033_010.json'];

for (const file of files) {
  const filePath = path.join('data', 'examples', file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/"answer":\s*"答案":/g, '"answer": "答案：');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`已修复 ${file}`);
}

console.log('\n修复完成！');
