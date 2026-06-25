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

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_chinese_') && f.endsWith('.json'));

let badCount = 0;
const badList = [];

files.forEach(f => {
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
    examples.forEach(ex => {
        let isBad = false;
        badPatterns.forEach(p => {
            if (new RegExp(p).test(ex.question) || new RegExp(p).test(ex.answer)) {
                isBad = true;
            }
        });
        if (isBad) {
            badCount++;
            badList.push({ file: f, id: ex.id, question: ex.question, answer: ex.answer });
        }
    });
});

console.log('找到低质量题目:', badCount);
badList.forEach(b => {
    console.log('\n文件:', b.file);
    console.log('ID:', b.id);
    console.log('题目:', b.question);
    console.log('答案:', b.answer);
});
