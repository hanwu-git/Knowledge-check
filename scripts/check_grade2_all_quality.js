const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');

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
    '是物理学的重要概念',
    '是.*的重要概念',
    '是物理学习中的重要知识点',
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
    '所在的章节是',
    '属于.*的内容',
    '学习.*时，最重要的是',
    '学习.*只需要背公式',
    '与其他.*知识没有联系',
    '关于.*的某个说法',
    '错误说法[A-D]',
    '正确说法[A-D]',
    '请简要说明.*的主要内容和应用',
    '本题考察对.*的理解和应用能力',
    '这是.*的基本公式，需要牢记',
    '解析：根据知识点的定义和性质判断',
    '根据知识点填写',
];

const subjects = [
    { key: 'math', name: '数学', prefix: 'g2_math_' },
    { key: 'physics', name: '物理', prefix: 'g2_physics_' },
    { key: 'english', name: '英语', prefix: 'g2_english_' },
    { key: 'chinese', name: '语文', prefix: 'g2_chinese_' },
    { key: 'history', name: '历史', prefix: 'g2_history_' },
    { key: 'geography', name: '地理', prefix: 'g2_geography_' },
    { key: 'biology', name: '生物', prefix: 'g2_biology_' },
    { key: 'daofa', name: '道德与法治', prefix: 'g2_daofa_' },
];

function getKnowledgeIds(subjectKey, semester) {
    const fileName = `g2_${subjectKey}_${semester}.json`;
    const filePath = path.join(KNOWLEDGE_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
        return [];
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data.map(item => item.id);
    } catch (e) {
        return [];
    }
}

function analyzeFiles(files) {
    let total = 0;
    let bad = 0;
    let duplicate = 0;
    const questionSet = new Set();
    const badList = [];
    const kpStats = {};
    
    files.forEach(f => {
        const filePath = path.join(EXAMPLE_DIR, f);
        if (!fs.existsSync(filePath)) return;
        
        const examples = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        examples.forEach(ex => {
            total++;
            
            const qKey = ex.question.substring(0, 50);
            if (questionSet.has(qKey)) {
                duplicate++;
            } else {
                questionSet.add(qKey);
            }
            
            let isBad = false;
            badPatterns.forEach(p => {
                if (new RegExp(p).test(ex.question) || new RegExp(p).test(ex.answer)) {
                    isBad = true;
                }
            });
            
            if (isBad) {
                bad++;
                badList.push({
                    file: f,
                    id: ex.id,
                    q: ex.question.substring(0, 60).replace(/\n/g, ' ')
                });
            }
            
            const kp = ex.knowledge_id || 'unknown';
            if (!kpStats[kp]) kpStats[kp] = { total: 0, bad: 0 };
            kpStats[kp].total++;
            if (isBad) kpStats[kp].bad++;
        });
    });
    
    return { total, bad, duplicate, badList, kpStats };
}

function analyzeSubject(subject) {
    const upperKIds = getKnowledgeIds(subject.key, 'upper');
    const lowerKIds = getKnowledgeIds(subject.key, 'lower');
    
    const upperFiles = upperKIds.map(kid => `${kid}_010.json`)
        .filter(f => fs.existsSync(path.join(EXAMPLE_DIR, f)));
    const lowerFiles = lowerKIds.map(kid => `${kid}_010.json`)
        .filter(f => fs.existsSync(path.join(EXAMPLE_DIR, f)));
    
    const allFiles = [...upperFiles, ...lowerFiles];
    
    const upperAnalysis = analyzeFiles(upperFiles);
    const lowerAnalysis = analyzeFiles(lowerFiles);
    
    return {
        subject,
        allFiles,
        upperFiles,
        lowerFiles,
        upperKnowledgeCount: upperKIds.length,
        lowerKnowledgeCount: lowerKIds.length,
        upperAnalysis,
        lowerAnalysis,
        summary: {
            totalFiles: allFiles.length,
            upperFileCount: upperFiles.length,
            lowerFileCount: lowerFiles.length,
            upperBadPercent: upperAnalysis.total > 0 ? (upperAnalysis.bad / upperAnalysis.total * 100).toFixed(1) : 0,
            lowerBadPercent: lowerAnalysis.total > 0 ? (lowerAnalysis.bad / lowerAnalysis.total * 100).toFixed(1) : 0,
        }
    };
}

console.log('='.repeat(80));
console.log('📊 初二各科目题目质量检查报告');
console.log('='.repeat(80));
console.log('检查时间:', new Date().toLocaleString('zh-CN'));
console.log('');

const allResults = [];

subjects.forEach(s => {
    const result = analyzeSubject(s);
    allResults.push(result);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📚 ${s.name} (${s.prefix})`);
    console.log('='.repeat(80));
    
    console.log('\n📁 文件情况:');
    console.log(`   上册知识点: ${result.upperKnowledgeCount} 个, 例题文件: ${result.summary.upperFileCount} 个`);
    console.log(`   下册知识点: ${result.lowerKnowledgeCount} 个, 例题文件: ${result.summary.lowerFileCount} 个`);
    console.log(`   总计: ${result.summary.totalFiles} 个例题文件`);
    
    console.log('\n📊 上册题目质量:');
    console.log(`   总题目数: ${result.upperAnalysis.total}`);
    console.log(`   低质量数: ${result.upperAnalysis.bad} (${result.summary.upperBadPercent}%)`);
    console.log(`   重复题目: ${result.upperAnalysis.duplicate}`);
    
    if (result.upperAnalysis.bad > 0 && result.upperAnalysis.badList.length > 0) {
        console.log('   低质量题目示例:');
        result.upperAnalysis.badList.slice(0, 5).forEach(b => {
            console.log(`     [${b.file}] ${b.q}...`);
        });
    }
    
    console.log('\n📊 下册题目质量:');
    console.log(`   总题目数: ${result.lowerAnalysis.total}`);
    console.log(`   低质量数: ${result.lowerAnalysis.bad} (${result.summary.lowerBadPercent}%)`);
    console.log(`   重复题目: ${result.lowerAnalysis.duplicate}`);
    
    if (result.lowerAnalysis.bad > 0 && result.lowerAnalysis.badList.length > 0) {
        console.log('   低质量题目示例:');
        result.lowerAnalysis.badList.slice(0, 5).forEach(b => {
            console.log(`     [${b.file}] ${b.q}...`);
        });
    }
});

console.log('\n\n' + '='.repeat(80));
console.log('📋 汇总报告');
console.log('='.repeat(80));

console.log('\n| 科目 | 上册知识点 | 上册质量 | 下册知识点 | 下册质量 | 需处理 |');
console.log('|------|------------|----------|------------|----------|--------|');

allResults.forEach(r => {
    const upperStatus = r.upperAnalysis.bad > 0 ? '❌' : '✅';
    const lowerStatus = r.lowerAnalysis.bad > 0 ? '❌' : '✅';
    const needFix = (r.upperAnalysis.bad > 0 || r.lowerAnalysis.bad > 0) ? '是' : '否';
    
    console.log(`| ${r.subject.name} | ${r.upperKnowledgeCount} | ${upperStatus} ${r.summary.upperBadPercent}% | ${r.lowerKnowledgeCount} | ${lowerStatus} ${r.summary.lowerBadPercent}% | ${needFix} |`);
});

console.log('\n📌 待处理科目清单:');
const needFixSubjects = allResults.filter(r => 
    r.upperAnalysis.bad > 0 || r.lowerAnalysis.bad > 0
);

if (needFixSubjects.length === 0) {
    console.log('   ✅ 所有科目题目质量合格，无需处理！');
} else {
    needFixSubjects.forEach(r => {
        console.log(`\n   📚 ${r.subject.name}:`);
        
        if (r.upperAnalysis.bad > 0) {
            console.log(`      - 上册有 ${r.upperAnalysis.bad} 道低质量题目 (${r.summary.upperBadPercent}%)`);
        }
        
        if (r.lowerAnalysis.bad > 0) {
            console.log(`      - 下册有 ${r.lowerAnalysis.bad} 道低质量题目 (${r.summary.lowerBadPercent}%)`);
        }
    });
}
