const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');
const count = parseInt(process.argv[2]) || 10;

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_') && f.endsWith('.json'));

let allExamples = [];
files.forEach(f => {
    try {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
        examples.forEach(ex => {
            allExamples.push({ ...ex, file: f });
        });
    } catch(e) {}
});

console.log(`初二例题总数: ${allExamples.length}\n`);

const shuffled = allExamples.sort(() => Math.random() - 0.5);
const picked = shuffled.slice(0, count);

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
