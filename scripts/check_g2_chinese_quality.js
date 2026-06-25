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

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_chinese_') && f.endsWith('.json') && !f.includes('_recite_'));

let total = 0;
let bad = 0;
const badList = [];

files.forEach(f => {
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
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
            if (badList.length < 5) {
                badList.push({ id: ex.id, a: ex.answer.substring(0, 100).replace(/\n/g, ' ') });
            }
        }
    });
});

console.log(`初二语文总题数: ${total}`);
console.log(`模板化答案: ${bad} (${(bad/total*100).toFixed(1)}%)`);
console.log('\n样例:');
badList.forEach(b => console.log(`  ${b.id}: ${b.a}`));
