const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

// 其他质量问题模式
const issuePatterns = [
    { name: '选项重复', pattern: /(A\..*)\s*(B\..*)\s*(C\..*)\s*(D\..*)/, check: (m) => {
        const opts = [m[1], m[2], m[3], m[4]].map(o => o.replace(/^[A-D]\.\s*/, '').trim());
        return new Set(opts).size !== opts.length;
    }},
    { name: '答案过长', pattern: /./, check: () => false, answerCheck: true, checkFn: (ex) => ex.answer && ex.answer.length > 300 },
    { name: '题目过短', pattern: /./, check: () => false, questionCheck: true, checkFn: (ex) => ex.question && ex.question.length < 10 },
    { name: '题目包含省略号开头的错误', pattern: /判断题：\.\.\./, check: (m) => true },
    { name: '选择题选项格式错误', pattern: /选择题.*[^A-D]\.[^.]/, check: (m) => m[0].length > 0 },
    { name: '答案包含省略号开头', pattern: /答案：\.\.\./, check: (m) => true },
    { name: '空答案', pattern: /./, check: () => false, answerCheck: true, checkFn: (ex) => !ex.answer || ex.answer.trim() === '' },
    { name: '空题目', pattern: /./, check: () => false, questionCheck: true, checkFn: (ex) => !ex.question || ex.question.trim() === '' },
];

function deepCheck(grade, subject, semester) {
    const prefix = `${grade}_${subject}_${semester === 'upper' ? 'u' : 'l'}`;
    const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.startsWith(prefix) && f.endsWith('.json'));
    
    let totalExamples = 0;
    let issues = {
        duplicateOptions: [],
        answerTooLong: [],
        questionTooShort: [],
        emptyAnswer: [],
        emptyQuestion: [],
        other: []
    };
    
    files.forEach(file => {
        const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf8'));
        examples.forEach(ex => {
            totalExamples++;
            
            // 检查答案过长
            if (ex.answer && ex.answer.length > 300) {
                issues.answerTooLong.push({ id: ex.id, content: ex.answer.substring(0, 100) });
            }
            
            // 检查题目过短
            if (ex.question && ex.question.length < 15) {
                issues.questionTooShort.push({ id: ex.id, content: ex.question });
            }
            
            // 检查空答案
            if (!ex.answer || ex.answer.trim() === '' || ex.answer === 'undefined') {
                issues.emptyAnswer.push({ id: ex.id, content: ex.question ? ex.question.substring(0, 50) : '空' });
            }
            
            // 检查空题目
            if (!ex.question || ex.question.trim() === '' || ex.question === 'undefined') {
                issues.emptyQuestion.push({ id: ex.id, content: '题目为空' });
            }
            
            // 检查选择题选项重复
            const choiceMatch = ex.question.match(/(A\.[^A-D]+)\s*(B\.[^A-D]+)\s*(C\.[^A-D]+)\s*(D\.[^A-D]+)/);
            if (choiceMatch) {
                const opts = [choiceMatch[1], choiceMatch[2], choiceMatch[3], choiceMatch[4]]
                    .map(o => o.replace(/^[A-D]\.\s*/, '').trim());
                const uniqueOpts = [...new Set(opts)];
                if (uniqueOpts.length !== opts.length) {
                    issues.duplicateOptions.push({ id: ex.id, content: ex.question.substring(0, 80) });
                }
            }
            
            // 检查判断题格式
            if (ex.question.includes('判断题：...')) {
                issues.other.push({ id: ex.id, type: '判断题省略号', content: ex.question.substring(0, 50) });
            }
        });
    });
    
    const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
    
    return {
        total: totalExamples,
        issues: totalIssues,
        details: issues
    };
}

function checkAllDeep() {
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
    
    console.log('='.repeat(70));
    console.log('🔍 深度内容质量检查');
    console.log('='.repeat(70));
    
    const results = [];
    let totalIssues = 0;
    
    tasks.forEach(task => {
        const result = deepCheck(task.grade, task.subject, task.semester);
        results.push({...task, ...result});
        totalIssues += result.issues;
        
        if (result.issues > 0) {
            console.log(`\n⚠️  ${task.name}:`);
            console.log(`   总题数: ${result.total}, 发现问题: ${result.issues}`);
            
            if (result.details.duplicateOptions.length > 0) {
                console.log(`   - 选项重复: ${result.details.duplicateOptions.length}个`);
                result.details.duplicateOptions.slice(0, 2).forEach(e => console.log(`     [${e.id}] ${e.content}...`));
            }
            if (result.details.emptyAnswer.length > 0) {
                console.log(`   - 空答案: ${result.details.emptyAnswer.length}个`);
                result.details.emptyAnswer.slice(0, 2).forEach(e => console.log(`     [${e.id}] ${e.content}...`));
            }
            if (result.details.emptyQuestion.length > 0) {
                console.log(`   - 空题目: ${result.details.emptyQuestion.length}个`);
            }
            if (result.details.questionTooShort.length > 0) {
                console.log(`   - 题目过短: ${result.details.questionTooShort.length}个`);
            }
            if (result.details.other.length > 0) {
                console.log(`   - 其他问题: ${result.details.other.length}个`);
                result.details.other.slice(0, 2).forEach(e => console.log(`     [${e.id}] ${e.content}...`));
            }
        } else {
            console.log(`✅ ${task.name}: ${result.total}题 - 通过`);
        }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 深度检查汇总');
    console.log('='.repeat(70));
    
    const failedTasks = results.filter(r => r.issues > 0);
    console.log(`检查科目: ${results.length}个`);
    console.log(`发现问题的科目: ${failedTasks.length}个`);
    console.log(`总问题数: ${totalIssues}`);
    
    if (failedTasks.length > 0) {
        console.log('\n需要修复的科目:');
        failedTasks.forEach(t => {
            console.log(`  - ${t.name}: ${t.issues}个问题`);
        });
    } else {
        console.log('\n🎉 全部通过！');
    }
    
    fs.writeFileSync('deep_check_results.json', JSON.stringify(results, null, 2));
}

checkAllDeep();
