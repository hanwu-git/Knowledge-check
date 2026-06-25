const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

const badPatterns = [
    '与该知识点无关的错误说法',
    '完全相反的错误说法',
    '混淆概念的错误说法',
    '只需要记住结论，不需要理解原理',
    '只需要死记硬背',
    '不需要掌握，考试不考',
    '完全没有实际用处',
    '与其他知识点没有联系',
    '所在的章节是',
    '属于.*的内容',
    '学习.*只需要背公式',
    '与其他.*知识没有联系'
];

function analyzeExamples(subjectPrefix, subjectName) {
    const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith(subjectPrefix) && f.endsWith('.json'));
    let total = 0;
    let bad = 0;
    
    files.forEach(file => {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));
        examples.forEach(ex => {
            total++;
            badPatterns.forEach(pattern => {
                if (new RegExp(pattern).test(ex.question) || new RegExp(pattern).test(ex.answer)) {
                    bad++;
                }
            });
        });
    });
    
    const percent = total > 0 ? ((bad / total) * 100).toFixed(1) : 0;
    console.log(`📊 ${subjectName}: ${total}题, 低质量: ${bad} (${percent}%)`);
    return { total, bad, percent };
}

console.log('='.repeat(70));
console.log('🔍 例题质量验证');
console.log('='.repeat(70));

const subjects = [
    { prefix: 'g1_math_', name: '初一数学' },
    { prefix: 'g2_math_', name: '初二数学' },
    { prefix: 'g2_physics_', name: '初二物理' },
    { prefix: 'g1_english_', name: '初一英语' },
    { prefix: 'g1_chinese_', name: '初一语文' },
    { prefix: 'g1_history_', name: '初一历史' },
    { prefix: 'g1_geography_', name: '初一地理' },
    { prefix: 'g1_biology_', name: '初一生物' },
    { prefix: 'g1_daofa_', name: '初一道德与法治' },
    { prefix: 'g2_biology_', name: '初二生物' },
];

let totalAll = 0, badAll = 0;
subjects.forEach(s => {
    const r = analyzeExamples(s.prefix, s.name);
    totalAll += r.total;
    badAll += r.bad;
});

console.log('\n' + '='.repeat(70));
console.log(`总例题: ${totalAll}, 低质量: ${badAll} (${((badAll/totalAll)*100).toFixed(1)}%)`);
console.log(badAll === 0 ? '🎉 全部通过！' : '⚠️ 还有低质量题目');
