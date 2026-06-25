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

function checkQuality(subjectKey, fileType) {
    const files = fs.readdirSync(EXAMPLE_DIR).filter(f => {
        const pattern = fileType === 'upper' 
            ? new RegExp(`g2_${subjectKey}_u\\d+_010\\.json`)
            : new RegExp(`g2_${subjectKey}_l\\d+_010\\.json`);
        return pattern.test(f);
    });
    
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
                if (badList.length < 5) {
                    badList.push({ file: f, q: ex.question.substring(0, 80).replace(/\n/g, ' ') });
                }
            }
        });
    });
    
    return { total, bad, percent: total > 0 ? (bad/total*100).toFixed(1) : 0, files: files.length, badList };
}

const upper = checkQuality('math', 'upper');
const lower = checkQuality('math', 'lower');

console.log('=== 数学题目质量检查 ===');
console.log('\n上册:');
console.log(`  文件数: ${upper.files}`);
console.log(`  总题数: ${upper.total}`);
console.log(`  低质量: ${upper.bad} (${upper.percent}%)`);
if (upper.badList.length > 0) {
    console.log('  示例:');
    upper.badList.forEach(b => console.log(`    [${b.file}] ${b.q}...`));
}

console.log('\n下册:');
console.log(`  文件数: ${lower.files}`);
console.log(`  总题数: ${lower.total}`);
console.log(`  低质量: ${lower.bad} (${lower.percent}%)`);
if (lower.badList.length > 0) {
    console.log('  示例:');
    lower.badList.forEach(b => console.log(`    [${b.file}] ${b.q}...`));
}

console.log('\n=== 结论 ===');
const needsFix = upper.bad > 0 || lower.bad > 0;
console.log(needsFix ? '❌ 需要重新生成高质量题目' : '✅ 质量合格');
