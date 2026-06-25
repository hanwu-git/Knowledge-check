const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g1_') && f.endsWith('.json'));

let allExamples = [];
files.forEach(f => {
    try {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
        examples.forEach(ex => {
            allExamples.push({ ...ex, file: f });
        });
    } catch(e) {}
});

console.log(`初一例题总数: ${allExamples.length}\n`);

// 随机抽3道
const shuffled = allExamples.sort(() => Math.random() - 0.5);
const picked = shuffled.slice(0, 3);

picked.forEach((ex, i) => {
    console.log(`===== 第${i+1}题 =====`);
    console.log(`来源文件: ${ex.file}`);
    console.log(`知识点ID: ${ex.knowledge_id}`);
    console.log(`题目ID: ${ex.id}`);
    console.log('题目:');
    console.log(ex.question);
    console.log('\n答案:');
    console.log(ex.answer);
    console.log('\n');
});
