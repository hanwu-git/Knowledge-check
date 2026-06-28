const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');
const QUALITY_FILE = path.join(EXAMPLE_DIR, 'g2_math_quality.json');

const allExamples = JSON.parse(fs.readFileSync(QUALITY_FILE, 'utf8'));

// 按knowledge_id分组
const grouped = {};
allExamples.forEach(ex => {
    if (!ex.knowledge_id) return;
    if (!grouped[ex.knowledge_id]) {
        grouped[ex.knowledge_id] = [];
    }
    grouped[ex.knowledge_id].push(ex);
});

// 保存为单独文件
let count = 0;
Object.entries(grouped).forEach(([kpId, examples]) => {
    const fileName = `${kpId}_010.json`;
    fs.writeFileSync(
        path.join(EXAMPLE_DIR, fileName),
        JSON.stringify(examples, null, 2)
    );
    count++;
    console.log(`✅ 生成: ${fileName} (${examples.length}题)`);
});

console.log(`\n🎉 共生成 ${count} 个初二数学知识点的例题文件`);
