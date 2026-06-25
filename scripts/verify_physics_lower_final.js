const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'knowledge_physics.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const match = content.match(/const DATA_EXAMPLES = (\[.*?\]);/s);
if (!match) {
    console.log('未找到 DATA_EXAMPLES');
    process.exit(1);
}

const examples = JSON.parse(match[1]);
console.log('总例题数:', examples.length);

const lowerKps = examples.filter(e => {
    const m = e.knowledge_id.match(/g2_physics_(\d+)/);
    if (m) {
        const num = parseInt(m[1]);
        return num >= 29 && num <= 58;
    }
    return false;
});

console.log('下册例题数:', lowerKps.length);

const kpMap = {};
lowerKps.forEach(ex => {
    const kp = ex.knowledge_id;
    if (!kpMap[kp]) kpMap[kp] = [];
    kpMap[kp].push(ex);
});

console.log('下册知识点数:', Object.keys(kpMap).length);

let badCount = 0;
const badPatterns = [
    '这是.*的正确描述',
    '与该知识点无关的错误说法',
    '完全相反的错误说法',
    '混淆概念的错误说法',
    '只需要记住结论',
    '只需要死记硬背',
    '是物理学的重要概念',
    '掌握公式是解决物理问题的基础',
    '公式是？',
    '的公式是______',
    '的核心公式是',
];

Object.entries(kpMap).sort((a,b) => a[0].localeCompare(b[0])).forEach(([kp, list]) => {
    console.log(`\n${kp}: ${list.length} 道题`);
    list.forEach((ex, i) => {
        let isBad = false;
        badPatterns.forEach(p => {
            if (new RegExp(p).test(ex.question) || new RegExp(p).test(ex.answer)) {
                isBad = true;
            }
        });
        if (isBad) badCount++;
        const status = isBad ? '❌' : '✅';
        console.log(`  ${status} ex0${i+1}: ${ex.question.substring(0, 60).replace(/\n/g, ' ')}...`);
    });
});

console.log(`\n低质量题目数: ${badCount}`);
console.log(`低质量比例: ${(badCount/lowerKps.length*100).toFixed(1)}%`);
