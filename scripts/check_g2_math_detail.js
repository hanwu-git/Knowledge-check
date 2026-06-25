const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_math') && f.endsWith('.json'));

const badPatterns = [
    '某个重要性质',
    '选项A',
    '根据知识点判断',
    '错误说法A',
];

const kpStats = {};

files.forEach(f => {
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
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
        if (isBad) kpStats[kp].bad++;
    });
});

console.log('数学低质量知识点：');
Object.entries(kpStats).forEach(([kp, s]) => {
    if (s.bad > 0) {
        console.log(`  ${kp}: ${s.bad}/${s.total}`);
    }
});
