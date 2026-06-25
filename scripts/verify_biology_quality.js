const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

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
    '其他公式',
    '没有公式',
    '错误的公式',
    '不存在',
    '任意值',
];

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_biology_') && f.endsWith('.json'));
console.log('生物文件:', files);

let total = 0;
let bad = 0;
const badList = [];

files.forEach(f => {
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
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
            if (badList.length < 10) {
                badList.push({ file: f, q: ex.question.substring(0, 80).replace(/\n/g, ' ') });
            }
        }
    });
});

console.log('\n=== 生物题目质量验证 ===');
console.log(`总题数: ${total}`);
console.log(`低质量: ${bad} (${(bad/total*100).toFixed(1)}%)`);

if (bad > 0) {
    console.log('\n低质量题目示例:');
    badList.forEach(b => console.log(`  [${b.file}] ${b.q}...`));
} else {
    console.log('\n✅ 生物题目质量合格！');
}
