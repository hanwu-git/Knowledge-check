const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'examples', 'g2_physics_lower_quality.json');
const examples = JSON.parse(fs.readFileSync(file, 'utf8'));

let fixed = 0;

examples.forEach(ex => {
    const q = ex.question || '';
    
    // 检查题目中是否包含"答案："
    const answerIndex = q.indexOf('答案：');
    if (answerIndex !== -1) {
        // 提取答案部分
        const answerPart = q.substring(answerIndex).trim();
        const questionPart = q.substring(0, answerIndex).trim();
        
        // 检查原来的answer字段
        const oldAnswer = ex.answer || '';
        
        // 如果原来的answer是空或者很短，就用提取出来的
        if (oldAnswer.length < answerPart.length) {
            ex.question = questionPart;
            ex.answer = answerPart;
            fixed++;
            console.log(`修复: ${ex.id}`);
            console.log(`  题目: ${questionPart.substring(0, 50)}...`);
        }
    }
});

fs.writeFileSync(file, JSON.stringify(examples, null, 2), 'utf8');
console.log(`\n共修复 ${fixed} 道题目`);
