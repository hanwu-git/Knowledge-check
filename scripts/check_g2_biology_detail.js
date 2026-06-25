const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const file = 'g2_biology_quality.json';
const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));

const badPatterns = [
    '根据知识点判断',
    '根据知识点填写',
    '选项A',
    '的某个重要性质',
    '占位符',
    '答案和详细解析',
    '的主要特征的主要特征',
];

// 按知识点统计
const kpStats = {};
let totalBad = 0;

examples.forEach(ex => {
    const kp = ex.knowledge_id;
    if (!kpStats[kp]) kpStats[kp] = { total: 0, bad: 0 };
    kpStats[kp].total++;

    let isBad = false;
    badPatterns.forEach(p => {
        if (ex.question.includes(p) || ex.answer.includes(p)) {
            isBad = true;
        }
    });
    if (isBad) {
        kpStats[kp].bad++;
        totalBad++;
    }
});

console.log(`总题数: ${examples.length}, 低质量: ${totalBad}\n`);
console.log('按知识点统计（有问题的）：');
let badKpCount = 0;
Object.entries(kpStats).forEach(([kp, s]) => {
    if (s.bad > 0) {
        badKpCount++;
        console.log(`  ${kp}: ${s.bad}/${s.total} 废题`);
    }
});
console.log(`\n有问题的知识点数: ${badKpCount}`);
