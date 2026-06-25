const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const badPatterns = [
    '不存在',
    '任意值',
];

const files = ['g2_physics_lower_quality.json', 'g2_physics_upper_quality.json'];

let total = 0;
let bad = 0;
const badList = [];

files.forEach(f => {
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
    examples.forEach(ex => {
        total++;
        let isBad = false;
        let matched = [];
        badPatterns.forEach(p => {
            if (new RegExp(p).test(ex.question) || new RegExp(p).test(ex.answer)) {
                isBad = true;
                matched.push(p);
            }
        });
        if (isBad) {
            bad++;
            badList.push({ file: f, id: ex.id, q: ex.question, a: ex.answer, matched });
        }
    });
});

console.log('总题数:', total);
console.log('匹配模式的题数:', bad);
console.log('\n具体题目:');
badList.forEach((b, i) => {
    console.log(`\n--- 第${i+1}题 ---`);
    console.log('文件:', b.file);
    console.log('ID:', b.id);
    console.log('匹配模式:', b.matched.join(', '));
    console.log('题目:', b.q.substring(0, 150));
    console.log('答案:', b.a.substring(0, 150));
});
