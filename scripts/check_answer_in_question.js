const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.endsWith('.json'));

let totalFiles = 0;
let totalQuestions = 0;
let badQuestions = [];

files.forEach(file => {
    totalFiles++;
    try {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));
        examples.forEach(ex => {
            totalQuestions++;
            const q = ex.question || '';
            const a = ex.answer || '';
            
            // 检查1：题目中包含"答案："
            if (q.includes('答案：') || q.includes('答案是') || q.includes('正确答案')) {
                badQuestions.push({ file, id: ex.id, type: '题目含答案字样', q: q.substring(0, 120).replace(/\n/g, ' ') });
                return;
            }
            
            // 检查2：题目中直接包含选项A/B/C/D的正确答案内容（例如选项里有"以上都对"且答案就是这个）
            // 先不检查这个，误判率高
            
            // 检查3：题目最后直接给出了解析/答案
            if (q.includes('解析：') || q.includes('解释：')) {
                badQuestions.push({ file, id: ex.id, type: '题目含解析', q: q.substring(0, 120).replace(/\n/g, ' ') });
                return;
            }
        });
    } catch(e) {
        console.log(`[错误] ${file}: ${e.message}`);
    }
});

console.log('=== 习题质量检查：答案是否出现在题目中 ===');
console.log(`检查文件数: ${totalFiles}`);
console.log(`检查题数: ${totalQuestions}`);
console.log(`问题题数: ${badQuestions.length}\n`);

if (badQuestions.length > 0) {
    console.log('问题题目列表：');
    badQuestions.forEach((b, i) => {
        console.log(`\n${i+1}. [${b.type}] ${b.file}`);
        console.log(`   ID: ${b.id}`);
        console.log(`   题目: ${b.q}...`);
    });
} else {
    console.log('✅ 所有题目都没有把答案直接放到题目中！');
}
