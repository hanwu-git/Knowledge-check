const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

// 低质量题目的特征模式
const badPatterns = [
    // 模板化问题
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
    // 重复判断题
    '是物理学的重要概念',
    '是.*的重要概念',
    '是物理学习中的重要知识点',
    '是.*学习中的重要知识点',
    '掌握公式是解决.*问题的基础',
    '掌握.*是学习该知识点的关键',
    // 模板化选择题
    '的公式是？',
    '的公式是______',
    '的核心公式是',
    '错误选项',
    '其他公式',
    '没有公式',
    '错误的公式',
    '不存在',
    '任意值',
    // 其他低质量特征
    '所在的章节是',
    '属于.*的内容',
    '学习.*时，最重要的是',
    '学习.*只需要背公式',
    '与其他.*知识没有联系',
];

// 初二科目配置
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

function analyzeSubject(subject) {
    const allFiles = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith(subject.prefix) && f.endsWith('.json'));
    
    // 分类文件
    const upperFiles = [];  // 上册
    const lowerFiles = [];  // 下册
    const qualityFiles = []; // 高质量版本
    const otherFiles = [];   // 其他
    
    allFiles.forEach(f => {
        // 提取知识点编号
        const match = f.match(new RegExp(`${subject.prefix.replace('_', '_')}(\d+)`));
        const uMatch = f.match(new RegExp(`${subject.prefix.replace('_', '_')}u(\d+)`));
        const lMatch = f.match(new RegExp(`${subject.prefix.replace('_', '_')}l(\d+)`));
        const qualityMatch = f.includes('quality') || f.includes('_quality');
        
        if (qualityMatch) {
            qualityFiles.push(f);
        } else if (uMatch) {
            const num = parseInt(uMatch[1]);
            if (num <= 30) upperFiles.push({ file: f, num, type: 'u' });
        } else if (lMatch) {
            const num = parseInt(lMatch[1]);
            if (num <= 30) lowerFiles.push({ file: f, num, type: 'l' });
        } else if (match) {
            const num = parseInt(match[1]);
            if (num <= 30) upperFiles.push({ file: f, num, type: 'normal' });
            else if (num >= 31 && num <= 60) lowerFiles.push({ file: f, num, type: 'normal' });
            else otherFiles.push(f);
        } else {
            otherFiles.push(f);
        }
    });
    
    // 分析题目质量
    function analyzeFiles(files, semester) {
        let total = 0;
        let bad = 0;
        let duplicate = 0;
        const questionSet = new Set();
        const badList = [];
        const kpStats = {};
        
        files.forEach(f => {
            const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
            examples.forEach(ex => {
                total++;
                
                // 检查重复
                const qKey = ex.question.substring(0, 50);
                if (questionSet.has(qKey)) {
                    duplicate++;
                } else {
                    questionSet.add(qKey);
                }
                
                // 检查低质量
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
    
    // 分析上册
    const upperAnalysis = analyzeFiles(upperFiles.map(f => f.file), '上册');
    
    // 分析下册
    const lowerAnalysis = analyzeFiles(lowerFiles.map(f => f.file), '下册');
    
    // 分析高质量版本
    const qualityAnalysis = analyzeFiles(qualityFiles, '高质量版');
    
    // 判断是否有重复文件
    const upperDup = upperFiles.some(f => f.type === 'u') && upperFiles.some(f => f.type === 'normal');
    const lowerDup = lowerFiles.some(f => f.type === 'l') && lowerFiles.some(f => f.type === 'normal');
    
    return {
        subject,
        allFiles,
        upperFiles: upperFiles.sort((a,b) => a.num - b.num),
        lowerFiles: lowerFiles.sort((a,b) => a.num - b.num),
        qualityFiles,
        upperDup,
        lowerDup,
        upperAnalysis,
        lowerAnalysis,
        qualityAnalysis,
        summary: {
            totalFiles: allFiles.length,
            upperFileCount: upperFiles.length,
            lowerFileCount: lowerFiles.length,
            qualityFileCount: qualityFiles.length,
            upperBadPercent: upperAnalysis.total > 0 ? (upperAnalysis.bad / upperAnalysis.total * 100).toFixed(1) : 0,
            lowerBadPercent: lowerAnalysis.total > 0 ? (lowerAnalysis.bad / lowerAnalysis.total * 100).toFixed(1) : 0,
            qualityBadPercent: qualityAnalysis.total > 0 ? (qualityAnalysis.bad / qualityAnalysis.total * 100).toFixed(1) : 0,
        }
    };
}

// 生成报告
console.log('=' .repeat(80));
console.log('📊 初二各科目题目质量检查报告');
console.log('=' .repeat(80));
console.log('检查时间:', new Date().toLocaleString('zh-CN'));
console.log('');

const allResults = [];

subjects.forEach(s => {
    const result = analyzeSubject(s);
    allResults.push(result);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📚 ${s.name} (${s.prefix})`);
    console.log('=' .repeat(80));
    
    console.log('\n📁 文件情况:');
    console.log(`   总文件数: ${result.summary.totalFiles}`);
    console.log(`   上册文件: ${result.summary.upperFileCount} 个`);
    console.log(`   下册文件: ${result.summary.lowerFileCount} 个`);
    console.log(`   高质量版: ${result.summary.qualityFileCount} 个`);
    
    if (result.upperDup) {
        console.log(`   ⚠️  上册有重复文件: ${result.upperFiles.filter(f => f.type === 'normal').length} 个 normal + ${result.upperFiles.filter(f => f.type === 'u').length} 个 u`);
    }
    if (result.lowerDup) {
        console.log(`   ⚠️  下册有重复文件: ${result.lowerFiles.filter(f => f.type === 'normal').length} 个 normal + ${result.lowerFiles.filter(f => f.type === 'l').length} 个 l`);
    }
    
    if (result.qualityFiles.length > 0) {
        console.log(`   ✅ 高质量版本文件: ${result.qualityFiles.join(', ')}`);
    }
    
    console.log('\n📊 上册题目质量:');
    console.log(`   总题目数: ${result.upperAnalysis.total}`);
    console.log(`   低质量数: ${result.upperAnalysis.bad} (${result.summary.upperBadPercent}%)`);
    console.log(`   重复题目: ${result.upperAnalysis.duplicate}`);
    
    if (result.upperAnalysis.bad > 0 && result.upperAnalysis.badList.length <= 5) {
        console.log('   低质量题目示例:');
        result.upperAnalysis.badList.slice(0, 5).forEach(b => {
            console.log(`     [${b.file}] ${b.q}...`);
        });
    }
    
    console.log('\n📊 下册题目质量:');
    console.log(`   总题目数: ${result.lowerAnalysis.total}`);
    console.log(`   低质量数: ${result.lowerAnalysis.bad} (${result.summary.lowerBadPercent}%)`);
    console.log(`   重复题目: ${result.lowerAnalysis.duplicate}`);
    
    if (result.lowerAnalysis.bad > 0 && result.lowerAnalysis.badList.length <= 5) {
        console.log('   低质量题目示例:');
        result.lowerAnalysis.badList.slice(0, 5).forEach(b => {
            console.log(`     [${b.file}] ${b.q}...`);
        });
    }
    
    if (result.qualityAnalysis.total > 0) {
        console.log('\n📊 高质量版本题目:');
        console.log(`   总题目数: ${result.qualityAnalysis.total}`);
        console.log(`   低质量数: ${result.qualityAnalysis.bad} (${result.summary.qualityBadPercent}%)`);
    }
});

// 汇总报告
console.log('\n\n' + '='.repeat(80));
console.log('📋 汇总报告');
console.log('=' .repeat(80));

console.log('\n| 科目 | 上册文件 | 上册质量 | 下册文件 | 下册质量 | 高质量版 | 需处理 |');
console.log('|------|----------|----------|----------|----------|----------|--------|');

allResults.forEach(r => {
    const upperStatus = r.upperAnalysis.bad > 0 || r.upperDup ? '❌' : '✅';
    const lowerStatus = r.lowerAnalysis.bad > 0 || r.lowerDup ? '❌' : '✅';
    const needFix = (r.upperAnalysis.bad > 0 || r.upperDup || r.lowerAnalysis.bad > 0 || r.lowerDup) ? '是' : '否';
    
    console.log(`| ${r.subject.name} | ${r.summary.upperFileCount} | ${upperStatus} ${r.summary.upperBadPercent}% | ${r.summary.lowerFileCount} | ${lowerStatus} ${r.summary.lowerBadPercent}% | ${r.summary.qualityFileCount} | ${needFix} |`);
});

console.log('\n📌 待处理科目清单:');
const needFixSubjects = allResults.filter(r => 
    r.upperAnalysis.bad > 0 || r.upperDup || 
    r.lowerAnalysis.bad > 0 || r.lowerDup
);

if (needFixSubjects.length === 0) {
    console.log('   ✅ 所有科目题目质量合格，无需处理！');
} else {
    needFixSubjects.forEach(r => {
        console.log(`\n   📚 ${r.subject.name}:`);
        
        if (r.upperDup) {
            console.log(`      - 上册有重复文件，需删除旧版`);
            console.log(`        旧版: ${r.upperFiles.filter(f => f.type === 'normal').map(f => f.file).slice(0, 3).join(', ')}...`);
            console.log(`        新版: ${r.upperFiles.filter(f => f.type === 'u').map(f => f.file).slice(0, 3).join(', ')}...`);
        }
        
        if (r.lowerDup) {
            console.log(`      - 下册有重复文件，需删除旧版`);
            console.log(`        旧版: ${r.lowerFiles.filter(f => f.type === 'normal').map(f => f.file).slice(0, 3).join(', ')}...`);
            console.log(`        新版: ${r.lowerFiles.filter(f => f.type === 'l').map(f => f.file).slice(0, 3).join(', ')}...`);
        }
        
        if (r.upperAnalysis.bad > 0) {
            console.log(`      - 上册有 ${r.upperAnalysis.bad} 道低质量题目 (${r.summary.upperBadPercent}%)`);
        }
        
        if (r.lowerAnalysis.bad > 0) {
            console.log(`      - 下册有 ${r.lowerAnalysis.bad} 道低质量题目 (${r.summary.lowerBadPercent}%)`);
        }
        
        if (r.qualityFiles.length > 0) {
            console.log(`      ✅ 已有高质量版本: ${r.qualityFiles.join(', ')}`);
        }
    });
}

console.log('\n\n' + '='.repeat(80));
console.log('💡 处理建议');
console.log('=' .repeat(80));

needFixSubjects.forEach(r => {
    console.log(`\n${r.subject.name}:`);
    
    if (r.qualityFiles.length > 0) {
        console.log(`  优先方案: 删除旧版文件，保留高质量版本 ${r.qualityFiles.join(', ')}`);
    } else {
        console.log(`  需要方案: 重新生成高质量题目`);
    }
    
    if (r.upperDup) {
        const toDelete = r.upperFiles.filter(f => f.type === 'normal').map(f => f.file);
        console.log(`  上册需删除: ${toDelete.length} 个文件`);
    }
    if (r.lowerDup) {
        const toDelete = r.lowerFiles.filter(f => f.type === 'normal').map(f => f.file);
        console.log(`  下册需删除: ${toDelete.length} 个文件`);
    }
});