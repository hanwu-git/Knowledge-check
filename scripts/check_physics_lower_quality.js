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
    '与其他.*知识没有联系',
    '关于.*的说法，正确的是',
    '下列关于.*的说法.*正确的是'
];

function analyzePhysicsLower() {
    const allFiles = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith('g2_physics_') && f.endsWith('.json'));
    console.log('物理相关文件数量:', allFiles.length);
    
    const lowerFiles = allFiles.filter(f => {
        const match = f.match(/g2_physics_(\d+)/);
        if (match) {
            const num = parseInt(match[1]);
            return num >= 29 && num <= 58;
        }
        return f.includes('lower') || f.includes('l0');
        return false;
    });
    
    console.log('\n下册相关文件:', lowerFiles.length);
    lowerFiles.sort().forEach(f => console.log('  ', f));
    
    let totalExamples = 0;
    let badExamples = 0;
    const badList = [];
    const kpStats = {};
    
    lowerFiles.forEach(file => {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));
        examples.forEach((ex, idx) => {
            totalExamples++;
            let isBad = false;
            let matchedPattern = [];
            badPatterns.forEach(pattern => {
                if (new RegExp(pattern).test(ex.question) || new RegExp(pattern).test(ex.answer)) {
                    isBad = true;
                    matchedPattern.push(pattern);
                }
            });
            if (isBad) {
                badExamples++;
                badList.push({ file, id: ex.id, q: ex.question.substring(0, 80), patterns: matchedPattern });
            }
            const kp = ex.knowledgePointId || 'unknown';
            if (!kpStats[kp]) kpStats[kp] = { total: 0, bad: 0 };
            kpStats[kp].total++;
            if (isBad) kpStats[kp].bad++;
        });
    });
    
    console.log('\n总例题数:', totalExamples);
    console.log('低质量例题数:', badExamples);
    console.log('低质量比例:', (badExamples/totalExamples*100).toFixed(1) + '%');
    
    console.log('\n低质量题目列表(前20个):');
    badList.slice(0, 20).forEach(b => {
        console.log(`  [${b.file}] ${b.id}: ${b.q}...`);
        console.log(`    匹配模式: ${b.patterns.join(', ')}`);
    });
    
    console.log('\n各知识点质量统计:');
    Object.entries(kpStats).sort((a,b) => b[1].bad - a[1].bad).forEach(([kp, stats]) => {
        if (stats.bad > 0) {
            console.log(`  ${kp}: ${stats.bad}/${stats.total} 不良`);
        }
    });
}

analyzePhysicsLower();
