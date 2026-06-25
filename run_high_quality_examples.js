const { regenerateExamples } = require('./generate_high_quality_examples');

const tasks = [
    { grade: 'g1', subject: 'math', semester: 'upper', name: '初一数学上册' },
    { grade: 'g1', subject: 'math', semester: 'lower', name: '初一数学下册' },
    { grade: 'g2', subject: 'math', semester: 'upper', name: '初二数学上册' },
    { grade: 'g2', subject: 'math', semester: 'lower', name: '初二数学下册' },
    { grade: 'g2', subject: 'physics', semester: 'upper', name: '初二物理上册' },
    { grade: 'g2', subject: 'physics', semester: 'lower', name: '初二物理下册' },
    { grade: 'g1', subject: 'english', semester: 'upper', name: '初一英语上册' },
    { grade: 'g1', subject: 'english', semester: 'lower', name: '初一英语下册' },
    { grade: 'g1', subject: 'chinese', semester: 'upper', name: '初一语文上册' },
    { grade: 'g1', subject: 'chinese', semester: 'lower', name: '初一语文下册' },
    { grade: 'g1', subject: 'history', semester: 'upper', name: '初一历史上册' },
    { grade: 'g1', subject: 'history', semester: 'lower', name: '初一历史下册' },
    { grade: 'g1', subject: 'geography', semester: 'upper', name: '初一地理上册' },
    { grade: 'g1', subject: 'geography', semester: 'lower', name: '初一地理下册' },
    { grade: 'g1', subject: 'biology', semester: 'upper', name: '初一生物上册' },
    { grade: 'g1', subject: 'biology', semester: 'lower', name: '初一生物下册' },
    { grade: 'g1', subject: 'daofa', semester: 'upper', name: '初一道德与法治上册' },
    { grade: 'g1', subject: 'daofa', semester: 'lower', name: '初一道德与法治下册' },
    { grade: 'g2', subject: 'biology', semester: 'upper', name: '初二生物上册' },
    { grade: 'g2', subject: 'biology', semester: 'lower', name: '初二生物下册' },
];

console.log('='.repeat(60));
console.log('🚀 高质量例题重构 - 全科目执行');
console.log('='.repeat(60));

let totalGenerated = 0;
let successCount = 0;

tasks.forEach(task => {
    console.log(`\n--- 执行: ${task.name} ---`);
    const count = regenerateExamples(task.grade, task.subject, task.semester);
    if (count > 0) {
        successCount++;
        totalGenerated += count;
    }
});

console.log('\n' + '='.repeat(60));
console.log('🎉 重构完成！');
console.log(`成功执行: ${successCount}/${tasks.length} 个任务`);
console.log(`生成例题: ${totalGenerated} 道`);
console.log('='.repeat(60));
