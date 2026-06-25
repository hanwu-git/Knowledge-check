const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g1_english_') && f.endsWith('.json') && !f.includes('_vocab_'));

let total = 0;
let bad = 0;
const badFiles = {};

files.forEach(f => {
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
    let fileBad = 0;
    examples.forEach(ex => {
        total++;
        if (ex.question.includes('请根据所学知识回答') || ex.answer.includes('根据.*知识点回答') || ex.answer.includes('是.*的重要内容')) {
            bad++;
            fileBad++;
        }
    });
    if (fileBad > 0) {
        badFiles[f] = { total: examples.length, bad: fileBad };
    }
});

console.log(`初一英语总题数: ${total}`);
console.log(`废题/模板化题: ${bad} (${(bad/total*100).toFixed(1)}%)\n`);
console.log('问题文件:');
Object.entries(badFiles).forEach(([f, s]) => {
    console.log(`  ${f}: ${s.bad}/${s.total} 废题`);
});
