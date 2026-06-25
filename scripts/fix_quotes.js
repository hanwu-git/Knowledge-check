const fs = require('fs');
const path = require('path');

const baseDir = 'd:/obj/学生复习/data/examples';

const files = fs.readdirSync(baseDir).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} JSON files`);

let fixedCount = 0;

for (const filename of files) {
    const filepath = path.join(baseDir, filename);
    let content = fs.readFileSync(filepath, 'utf8');
    
    // 替换字符串内容中的中文引号
    // 注意：只替换在JSON字符串值内部的中文引号
    // 中文引号是 " 和 " (Unicode: \u201C 和 \u201D)
    const newContent = content
        .replace(/\u201C/g, '\\"')  // 左中文引号 " 替换为 \"
        .replace(/\u201D/g, '\\"');  // 右中文引号 " 替换为 \"
    
    if (content !== newContent) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Fixed: ${filename}`);
        fixedCount++;
    }
}

console.log(`Total fixed: ${fixedCount}`);