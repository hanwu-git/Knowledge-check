const fs = require('fs');

console.log('=== 验证1：首页初二数学链接 ===');
const indexContent = fs.readFileSync('index.html', 'utf8');
const mathLinks = indexContent.match(/href="knowledge_g2_math[^"]*"/g);
if (mathLinks) {
    console.log('✅ 找到正确的链接:');
    mathLinks.forEach(link => console.log('  ' + link));
} else {
    console.log('❌ 未找到 knowledge_g2_math 链接');
    const oldLinks = indexContent.match(/href="knowledge_math[^"]*"/g);
    if (oldLinks) {
        console.log('⚠️  仍然有旧的 knowledge_math 链接:');
        oldLinks.forEach(link => console.log('  ' + link));
    }
}

console.log('');
console.log('=== 验证2：knowledge_g2_math.html 例题数据 ===');
const htmlContent = fs.readFileSync('knowledge_g2_math.html', 'utf8');
const match = htmlContent.match(/const DATA_EXAMPLES = (\[[\s\S]*?\]);/);
if (match) {
    const examples = JSON.parse(match[1]);
    console.log('例题总数:', examples.length);
    
    const knowledgeIds = [...new Set(examples.map(e => e.knowledge_id))].sort();
    console.log('知识点数量:', knowledgeIds.length);
    console.log('ID范围:', knowledgeIds[0], '~', knowledgeIds[knowledgeIds.length-1]);
    
    const counts = {};
    examples.forEach(e => {
        counts[e.knowledge_id] = (counts[e.knowledge_id] || 0) + 1;
    });
    const incomplete = Object.entries(counts).filter(([id, count]) => count < 10);
    if (incomplete.length === 0) {
        console.log('✅ 所有知识点都有10道题');
    } else {
        console.log('❌ 以下知识点例题不足10题:');
        incomplete.forEach(([id, count]) => console.log('  ' + id + ': ' + count + '题'));
    }
    
    const firstEx = examples[0];
    console.log('');
    console.log('=== 验证3：第1题质量抽样 ===');
    console.log('题目:', firstEx.question.substring(0, 80) + '...');
    if (firstEx.question.includes('完全错误') || firstEx.question.includes('关键点：')) {
        console.log('❌ 仍然是低质量模板题');
    } else {
        console.log('✅ 题目质量正常');
    }
}

console.log('');
console.log('=== 验证4：初二所有科目链接 ===');
const subjects = ['math', 'physics', 'english', 'chinese', 'chinese_recite', 'english_vocab', 'history', 'geography', 'biology', 'daofa'];
let allGood = true;
subjects.forEach(subject => {
    const pattern = new RegExp(`href="knowledge_g2_${subject}[^"]*"`, 'g');
    const links = indexContent.match(pattern);
    if (links && links.length >= 2) {
        console.log(`✅ ${subject}: 链接正确`);
    } else {
        console.log(`❌ ${subject}: 链接有问题`);
        allGood = false;
    }
});

console.log('');
if (allGood) {
    console.log('🎉 所有初二科目链接都正确！');
} else {
    console.log('⚠️  部分科目链接有问题');
}
