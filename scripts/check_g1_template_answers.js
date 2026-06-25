const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const badPatterns = [
    '是.*的重要内容',
    '是.*学习中的重要内容',
    '需要理解和掌握',
    '指导我们的行为',
    '对我们的生活有重要指导意义',
    '这是.*的核心要点',
    '需要我们认真学习',
    '是.*的重要知识点',
    '是.*的重要概念',
    '在.*中具有重要地位',
];

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g1_') && f.endsWith('.json'));

let totalAll = 0;
let badAll = 0;

const subjects = {};

files.forEach(f => {
    let subjectName = f;
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
    
    let total = 0;
    let bad = 0;
    const badList = [];
    
    examples.forEach(ex => {
        total++;
        let isBad = false;
        badPatterns.forEach(p => {
            if (new RegExp(p).test(ex.answer)) {
                isBad = true;
            }
        });
        if (isBad) {
            bad++;
            if (badList.length < 3) {
                badList.push({ id: ex.id, a: ex.answer.substring(0, 100).replace(/\n/g, ' ') });
            }
        }
    });
    
    totalAll += total;
    badAll += bad;
    
    // 按科目分组
    const prefix = f.replace(/_l\d+_.*\.json|_u\d+_.*\.json|_quality\.json/g, '');
    if (!subjects[prefix]) subjects[prefix] = { total: 0, bad: 0, files: 0 };
    subjects[prefix].total += total;
    subjects[prefix].bad += bad;
    subjects[prefix].files++;
});

console.log('=== 初一模板化答案检查（空话套话）===\n');
console.log(`总题数: ${totalAll}`);
console.log(`模板化答案: ${badAll} (${(badAll/totalAll*100).toFixed(1)}%)\n`);

console.log('按科目统计:');
Object.entries(subjects).forEach(([name, s]) => {
    const rate = s.total > 0 ? ((1 - s.bad/s.total) * 100).toFixed(1) : '0.0';
    const status = s.bad > 0 ? '❌' : '✅';
    console.log(`  ${status} ${name}: ${s.total}题, ${s.bad}道模板化, 合格率 ${rate}%`);
});
