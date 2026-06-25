const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_chinese_recite_') && f.endsWith('.json'));

let totalRemoved = 0;
let fileCount = 0;

files.forEach(f => {
    const filePath = path.join(EXAMPLE_DIR, f);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const originalLen = data.length;
    data = data.filter(ex => !ex.answer.includes('赏析题答案和解析') && !ex.answer.includes('根据知识点'));
    if (data.length < originalLen) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        totalRemoved += (originalLen - data.length);
        fileCount++;
    }
});

console.log(`修复完成！删除了 ${totalRemoved} 道空模板题，涉及 ${fileCount} 个文件`);
