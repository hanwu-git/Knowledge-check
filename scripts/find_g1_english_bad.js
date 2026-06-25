const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const badPatterns = [
    '是.*的重要内容',
    '是.*学习中的重要内容',
    '需要理解和掌握',
    '指导我们的行为',
    '对我们的生活有重要指导意义',
];

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g1_english_') && f.endsWith('.json') && !f.includes('_vocab_'));

files.forEach(f => {
    const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
    examples.forEach(ex => {
        badPatterns.forEach(p => {
            if (new RegExp(p).test(ex.answer)) {
                console.log(`${f} - ${ex.id}`);
                console.log(`  答案: ${ex.answer.substring(0, 150).replace(/\n/g, ' ')}`);
            }
        });
    });
});
