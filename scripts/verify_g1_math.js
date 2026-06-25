const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');
const file = path.join(EXAMPLE_DIR, 'g1_math_quality.json');

const badPatterns = [
    '这是.*的正确描述',
    '与该知识点无关的错误说法',
    '完全相反的错误说法',
    '混淆概念的错误说法',
    '只需要记住结论，不需要理解原理',
    '只需要死记硬背',
    '是.*的重要概念',
    '是.*学习中的重要知识点',
    '掌握公式是解决.*问题的基础',
    '掌握.*是学习该知识点的关键',
    '的公式是？',
    '的公式是______',
    '的核心公式是',
    '错误选项',
    '不存在',
    '任意值',
];

const examples = JSON.parse(fs.readFileSync(file, 'utf8'));
let total = 0;
let bad = 0;
const badList = [];

examples.forEach(ex => {
    total++;
    let isBad = false;
    badPatterns.forEach(p => {
        if (new RegExp(p).test(ex.question) || new RegExp(p).test(ex.answer)) {
            isBad = true;
        }
    });
    if (isBad) {
        bad++;
        if (badList.length < 5) {
            badList.push({ id: ex.id, q: ex.question.substring(0, 80).replace(/\n/g, ' ') });
        }
    }
});

console.log('=== 初一数学质量验证 ===');
console.log(`总题数: ${total}`);
console.log(`低质量: ${bad} (${(bad/total*100).toFixed(1)}%)`);

if (bad > 0) {
    console.log('\n低质量题目:');
    badList.forEach(b => console.log(`  [${b.id}] ${b.q}...`));
} else {
    console.log('\n✅ 初一数学题目质量合格！');
}
