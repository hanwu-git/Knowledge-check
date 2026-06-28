const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');
const ALL_EXAMPLES = path.join(__dirname, 'data', 'all_examples.json');

const allExamples = JSON.parse(fs.readFileSync(ALL_EXAMPLES, 'utf8'));

// 按knowledge_id分组
const grouped = {};
allExamples.forEach(ex => {
    if (!ex.knowledge_id) return;
    if (!grouped[ex.knowledge_id]) {
        grouped[ex.knowledge_id] = [];
    }
    grouped[ex.knowledge_id].push(ex);
});

// 只恢复初二数学的
let count = 0;
Object.entries(grouped).forEach(([kpId, examples]) => {
    if (kpId.startsWith('g2_math_')) {
        const fileName = `${kpId}_010.json`;
        fs.writeFileSync(
            path.join(EXAMPLE_DIR, fileName),
            JSON.stringify(examples, null, 2)
        );
        count++;
        console.log(`✅ 恢复: ${fileName} (${examples.length}题)`);
    }
});

console.log(`\n🎉 共恢复 ${count} 个初二数学知识点的例题文件`);
