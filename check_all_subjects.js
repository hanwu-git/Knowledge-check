const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

// 低质量关键词
const badPatterns = [
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
    '学习.*只需要背公式',
    '与其他.*知识没有联系',
    '这只是.*的理论知识'
];

function checkSubject(grade, subject, semester) {
    const prefix = `${grade}_${subject}_${semester === 'upper' ? 'u' : 'l'}`;
    const semName = semester === 'upper' ? '上册' : '下册';
    const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith(prefix) && f.endsWith('.json'));
    
    let totalExamples = 0;
    let badExamples = [];
    
    files.forEach(file => {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));
        examples.forEach(ex => {
            totalExamples++;
            for (const pattern of badPatterns) {
                if (new RegExp(pattern).test(ex.question) || new RegExp(pattern).test(ex.answer)) {
                    badExamples.push({
                        id: ex.id,
                        question: ex.question.substring(0, 80),
                        pattern: pattern
                    });
                    break;
                }
            }
        });
    });
    
    const percent = totalExamples > 0 ? ((badExamples.length / totalExamples) * 100).toFixed(1) : 0;
    
    return {
        subject: `${grade}_${subject}_${semester}`,
        total: totalExamples,
        bad: badExamples.length,
        percent,
        badExamples: badExamples.slice(0, 5) // 只返回前5个作为样本
    };
}

function checkAllSubjects() {
    const tasks = [
        { grade: 'g1', subject: 'math', semester: 'upper', name: '初一数学上册' },
        { grade: 'g1', subject: 'math', semester: 'lower', name: '初一数学下册' },
        { grade: 'g2', subject: 'math', semester: 'upper', name: '初二数学上册' },
        { grade: 'g2', subject: 'math', semester: 'lower', name: '初二数学下册' },
        { grade: 'g2', subject: 'physics', semester: 'upper', name: '初二物理上册' },
        { grade: 'g2', subject: 'physics', semester: 'lower', name: '初二物理下册' },
        { grade: 'g1', subject: 'english', semester: 'upper', name: '初一英语上册' },
        { grade: 'g1', subject: 'english', semester: 'lower', name: '初一英语下册' },
        { grade: 'g2', subject: 'english', semester: 'upper', name: '初二英语上册' },
        { grade: 'g2', subject: 'english', semester: 'lower', name: '初二英语下册' },
        { grade: 'g1', subject: 'chinese', semester: 'upper', name: '初一语文上册' },
        { grade: 'g1', subject: 'chinese', semester: 'lower', name: '初一语文下册' },
        { grade: 'g2', subject: 'chinese', semester: 'upper', name: '初二语文上册' },
        { grade: 'g2', subject: 'chinese', semester: 'lower', name: '初二语文下册' },
        { grade: 'g1', subject: 'history', semester: 'upper', name: '初一历史上册' },
        { grade: 'g1', subject: 'history', semester: 'lower', name: '初一历史下册' },
        { grade: 'g2', subject: 'history', semester: 'upper', name: '初二历史上册' },
        { grade: 'g2', subject: 'history', semester: 'lower', name: '初二历史下册' },
        { grade: 'g1', subject: 'geography', semester: 'upper', name: '初一地理上册' },
        { grade: 'g1', subject: 'geography', semester: 'lower', name: '初一地理下册' },
        { grade: 'g2', subject: 'geography', semester: 'upper', name: '初二地理上册' },
        { grade: 'g2', subject: 'geography', semester: 'lower', name: '初二地理下册' },
        { grade: 'g1', subject: 'biology', semester: 'upper', name: '初一生物上册' },
        { grade: 'g1', subject: 'biology', semester: 'lower', name: '初一生物下册' },
        { grade: 'g2', subject: 'biology', semester: 'upper', name: '初二生物上册' },
        { grade: 'g2', subject: 'biology', semester: 'lower', name: '初二生物下册' },
        { grade: 'g1', subject: 'daofa', semester: 'upper', name: '初一道德与法治上册' },
        { grade: 'g1', subject: 'daofa', semester: 'lower', name: '初一道德与法治下册' },
        { grade: 'g2', subject: 'daofa', semester: 'upper', name: '初二道德与法治上册' },
        { grade: 'g2', subject: 'daofa', semester: 'lower', name: '初二道德与法治下册' },
    ];
    
    const results = [];
    
    console.log('='.repeat(70));
    console.log('📋 逐学科低质量题目检查');
    console.log('='.repeat(70));
    
    tasks.forEach(task => {
        const result = checkSubject(task.grade, task.subject, task.semester);
        results.push({...task, ...result});
        
        if (result.bad > 0) {
            console.log(`\n⚠️  ${task.name}:`);
            console.log(`   总题数: ${result.total}, 低质量: ${result.bad} (${result.percent}%)`);
            console.log(`   问题示例:`);
            result.badExamples.forEach((ex, i) => {
                console.log(`   ${i+1}. [${ex.id}] ${ex.question}...`);
            });
        } else {
            console.log(`✅ ${task.name}: ${result.total}题 - 通过`);
        }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 检查结果汇总');
    console.log('='.repeat(70));
    
    const totalBad = results.reduce((sum, r) => sum + r.bad, 0);
    const totalAll = results.reduce((sum, r) => sum + r.total, 0);
    const failedTasks = results.filter(r => r.bad > 0);
    
    console.log(`总题数: ${totalAll}`);
    console.log(`低质量题: ${totalBad} (${((totalBad/totalAll)*100).toFixed(2)}%)`);
    console.log(`检查科目: ${results.length}个`);
    console.log(`通过: ${results.length - failedTasks.length}个`);
    console.log(`未通过: ${failedTasks.length}个`);
    
    if (failedTasks.length > 0) {
        console.log('\n未通过的科目:');
        failedTasks.forEach(t => {
            console.log(`  - ${t.name}: ${t.bad}题低质量`);
        });
    } else {
        console.log('\n🎉 全部通过！');
    }
    
    // 输出JSON结果供后续处理
    fs.writeFileSync('check_results.json', JSON.stringify(results, null, 2));
    console.log('\n详细结果已保存到 check_results.json');
}

checkAllSubjects();
