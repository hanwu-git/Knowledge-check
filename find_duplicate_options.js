const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

function findDuplicateOptions(prefix) {
    const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith(prefix) && f.endsWith('.json'));
    const issues = [];
    
    files.forEach(file => {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));
        examples.forEach(ex => {
            const choiceMatch = ex.question.match(/(A\.[^A-D]+)\s*(B\.[^A-D]+)\s*(C\.[^A-D]+)\s*(D\.[^A-D]+)/);
            if (choiceMatch) {
                const opts = [choiceMatch[1], choiceMatch[2], choiceMatch[3], choiceMatch[4]]
                    .map(o => o.replace(/^[A-D]\.\s*/, '').trim());
                const uniqueOpts = [...new Set(opts)];
                if (uniqueOpts.length !== opts.length) {
                    issues.push({
                        file: file,
                        id: ex.id,
                        question: ex.question,
                        opts: opts
                    });
                }
            }
        });
    });
    
    return issues;
}

console.log('='.repeat(70));
console.log('🔍 查找所有选项重复的题目');
console.log('='.repeat(70));

const allIssues = [];

const subjects = [
    { prefix: 'g2_english_u', name: '初二英语上册' },
    { prefix: 'g2_english_l', name: '初二英语下册' },
    { prefix: 'g2_history_u', name: '初二历史上册' },
    { prefix: 'g2_history_l', name: '初二历史下册' },
    { prefix: 'g1_math_u', name: '初一数学上册' },
    { prefix: 'g1_math_l', name: '初一数学下册' },
    { prefix: 'g2_math_', name: '初二数学' },
    { prefix: 'g2_physics_', name: '初二物理' },
];

subjects.forEach(s => {
    const issues = findDuplicateOptions(s.prefix);
    if (issues.length > 0) {
        console.log(`\n${s.name}: 发现 ${issues.length} 个选项重复问题`);
        issues.forEach((issue, i) => {
            console.log(`  ${i+1}. [${issue.id}] ${issue.question.substring(0, 60)}...`);
            console.log(`     选项: ${issue.opts.join(' | ')}`);
        });
        allIssues.push(...issues);
    }
});

console.log('\n' + '='.repeat(70));
console.log(`总计发现: ${allIssues.length} 个选项重复问题`);
console.log('='.repeat(70));

fs.writeFileSync('duplicate_options_issues.json', JSON.stringify(allIssues, null, 2));
