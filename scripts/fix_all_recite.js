const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.includes('chinese_recite') && f.endsWith('.json'));

let totalRemoved = 0;

files.forEach(f => {
    const filePath = path.join(EXAMPLE_DIR, f);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const before = data.length;
    const after = data.filter(ex => !ex.answer.includes('题答案和解析'));
    if (after.length < before) {
        fs.writeFileSync(filePath, JSON.stringify(after, null, 2));
        totalRemoved += before - after.length;
        console.log('修复: ' + f + ' 删除' + (before - after.length) + '道');
    }
});

console.log('\n总计删除: ' + totalRemoved + ' 道空模板题');
