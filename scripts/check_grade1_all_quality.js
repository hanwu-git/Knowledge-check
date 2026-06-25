const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const badPatterns = [
    '这是.*的正确描述',
    '与该知识点无关的错误说法',
    '完全相反的错误说法',
    '混淆概念的错误说法',
    '只需要记住结论，不需要理解原理',
    '只需要死记硬背',
    '是.*的重要概念',
    '是.*学习中的重要知识点',
    '掌握公式是解决.*问题的基础',
    '掌握.*是学习该知识点的关键',
    '的公式是？',
    '的公式是______',
    '的核心公式是',
    '错误选项',
    '其他公式',
    '没有公式',
    '错误的公式',
    '不存在',
    '任意值',
];

// 初一年级科目
const subjects = [
    { prefix: 'g1_math', name: '数学' },
    { prefix: 'g1_chinese', name: '语文' },
    { prefix: 'g1_english', name: '英语' },
    { prefix: 'g1_geography', name: '地理' },
    { prefix: 'g1_biology', name: '生物' },
    { prefix: 'g1_history', name: '历史' },
    { prefix: 'g1_daofa', name: '道德与法治' },
];

console.log('=== 初一年级题目质量全面检查 ===\n');

const results = [];

subjects.forEach(subj => {
    const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith(subj.prefix) && f.endsWith('.json'));
    
    let total = 0;
    let bad = 0;
    const badList = [];
    
    files.forEach(f => {
        try {
            const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
            examples.forEach(ex => {
                total++;
                let isBad = false;
                badPatterns.forEach(p => {
                    if (new RegExp(p).test(ex.question) || new RegExp(p).test(ex.answer)) {
                        isBad = true;
                    }
                });
                if (isBad) {
                    bad++;
                    if (badList.length < 3) {
                        badList.push({ file: f, q: ex.question.substring(0, 100).replace(/\n/g, ' ') });
                    }
                }
            });
        } catch (e) {
            console.log(`  [${f}] 解析错误: ${e.message}`);
        }
    });
    
    const rate = total > 0 ? ((1 - bad/total) * 100).toFixed(1) : '0.0';
    results.push({ name: subj.name, files: files.length, total, bad, rate, badList });
    
    console.log(`${subj.name}:`);
    console.log(`  文件数: ${files.length}, 总题数: ${total}, 低质量: ${bad}, 合格率: ${rate}%`);
    if (bad > 0 && badList.length > 0) {
        console.log('  示例:');
        badList.forEach(b => console.log(`    [${b.file}] ${b.q}...`));
    }
    console.log('');
});

console.log('\n=== 汇总 ===');
results.forEach(r => {
    const status = r.bad > 0 ? '❌' : '✅';
    console.log(`${status} ${r.name}: ${r.rate}%`);
});
