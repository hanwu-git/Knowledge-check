const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

// 低质量例题的特征关键词
const badPatterns = [
    '这是.*的正确描述',
    '与该知识点无关的错误说法',
    '完全相反的错误说法',
    '混淆概念的错误说法',
    '只需要记住结论，不需要理解原理',
    '只需要死记硬背',
    '只做难题就行',
    '只看不用练',
    '不需要掌握，考试不考',
    '完全没有实际用处',
    '只能用于一种题型',
    '只在考试中有用',
    '与其他知识点没有联系',
    '所在的章节是',
    '属于.*的内容',
    '学习.*时，最重要的是',
    '学习.*只需要背公式',
    '与其他.*知识没有联系'
];

function analyzeExamples(subjectPrefix, subjectName) {
    const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith(subjectPrefix) && f.endsWith('.json'));
    let totalExamples = 0;
    let badExamples = 0;
    const badQuestionTypes = {};

    files.forEach(file => {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));
        examples.forEach(ex => {
            totalExamples++;
            let isBad = false;
            badPatterns.forEach(pattern => {
                if (new RegExp(pattern).test(ex.question) || new RegExp(pattern).test(ex.answer)) {
                    isBad = true;
                    if (!badQuestionTypes[pattern]) badQuestionTypes[pattern] = 0;
                    badQuestionTypes[pattern]++;
                }
            });
            if (isBad) {
                badExamples++;
            }
        });
    });

    const percent = totalExamples > 0 ? ((badExamples / totalExamples) * 100).toFixed(1) : 0;
    console.log(`\n📊 ${subjectName}:`);
    console.log(`   总例题数: ${totalExamples}`);
    console.log(`   低质量例题: ${badExamples} (${percent}%)`);
    
    if (badExamples > 0) {
        console.log('   问题类型分布:');
        Object.entries(badQuestionTypes).forEach(([pattern, count]) => {
            console.log(`     - ${pattern}: ${count}道`);
        });
    }
    
    return { total: totalExamples, bad: badExamples, percent, badQuestionTypes, subjectName };
}

console.log('='.repeat(70));
console.log('🔍 例题质量分析报告');
console.log('='.repeat(70));

const results = [];

// 二年级
results.push(analyzeExamples('g2_math_', '初二数学'));
results.push(analyzeExamples('g2_physics_', '初二物理'));
results.push(analyzeExamples('g2_english_', '初二英语'));
results.push(analyzeExamples('g2_chinese_', '初二语文'));
results.push(analyzeExamples('g2_history_', '初二历史'));
results.push(analyzeExamples('g2_geography_', '初二地理'));
results.push(analyzeExamples('g2_biology_', '初二生物'));
results.push(analyzeExamples('g2_daofa_', '初二道德与法治'));

// 一年级
results.push(analyzeExamples('g1_math_', '初一数学'));
results.push(analyzeExamples('g1_english_', '初一英语'));
results.push(analyzeExamples('g1_chinese_', '初一语文'));
results.push(analyzeExamples('g1_history_', '初一历史'));
results.push(analyzeExamples('g1_geography_', '初一地理'));
results.push(analyzeExamples('g1_biology_', '初一生物'));
results.push(analyzeExamples('g1_daofa_', '初一道德与法治'));

// 汇总
console.log('\n' + '='.repeat(70));
console.log('📈 汇总统计');
console.log('='.repeat(70));
let totalAll = 0;
let badAll = 0;
results.forEach(r => {
    totalAll += r.total;
    badAll += r.bad;
});
console.log(`总例题数: ${totalAll}`);
console.log(`低质量例题: ${badAll} (${((badAll/totalAll)*100).toFixed(1)}%)`);

// 找出最差的几个科目
console.log('\n⚠️  低质量比例最高的科目:');
results.sort((a, b) => b.bad - a.bad).slice(0, 5).forEach(r => {
    console.log(`   ${r.subjectName}: ${r.bad}道 (${r.percent}%)`);
});
