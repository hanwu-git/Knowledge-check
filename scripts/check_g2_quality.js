const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const badPatterns = [
    '根据知识点判断',
    '根据知识点填写',
    '选项A',
    '的某个重要性质',
    '占位符',
    '答案和详细解析',
    '相关练习题目',
];

const subjects = {};
const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_') && f.endsWith('.json'));

files.forEach(f => {
    const prefixMatch = f.match(/^(g2_[a-z]+)/);
    if (!prefixMatch) return;
    const prefix = prefixMatch[1];

    let examples;
    try {
        examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
    } catch(e) { return; }

    if (!subjects[prefix]) subjects[prefix] = { total: 0, bad: 0, badList: [] };

    examples.forEach(ex => {
        subjects[prefix].total++;
        let isBad = false;
        badPatterns.forEach(p => {
            if (ex.question.includes(p) || ex.answer.includes(p)) {
                isBad = true;
            }
        });
        if (isBad) {
            subjects[prefix].bad++;
            if (subjects[prefix].badList.length < 3) {
                subjects[prefix].badList.push({ id: ex.id, q: ex.question.substring(0, 80).replace(/\n/g, ' ') });
            }
        }
    });
});

console.log('=== 初二低质量题目检查 ===\n');
let totalAll = 0, badAll = 0;
Object.entries(subjects).forEach(([name, s]) => {
    totalAll += s.total;
    badAll += s.bad;
    const rate = s.total > 0 ? ((1 - s.bad/s.total) * 100).toFixed(1) : '0.0';
    const status = s.bad > 0 ? '❌' : '✅';
    console.log(`${status} ${name}: ${s.total}题, ${s.bad}道低质量, 合格率 ${rate}%`);
    if (s.badList.length > 0) {
        s.badList.forEach(b => console.log(`     - ${b.id}: ${b.q}`));
    }
});
console.log(`\n总计: ${totalAll}题, ${badAll}道低质量, 合格率 ${((1-badAll/totalAll)*100).toFixed(1)}%`);
