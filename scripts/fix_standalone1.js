const fs = require('fs');

let content = fs.readFileSync('generate_standalone.js', 'utf8');

// 替换loadExamplesBySubject函数
const oldFunc = `// 加载指定科目的例题
function loadExamplesBySubject(subject) {
    const examples = [];
    const files = fs.readdirSync(examplesDir).filter(f => f.startsWith(\`g2_\${subject}_\`) && f.endsWith('.json'));
    files.forEach(f => {
        const filePath = path.join(examplesDir, f);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
            examples.push(...data);
        }
    });
    return examples;
}`;

const newFunc = `// 加载指定科目的例题
function loadExamplesBySubject(gradePrefix, subjectKey) {
    const examples = [];
    const files = fs.readdirSync(examplesDir).filter(f => f.startsWith(\`\${gradePrefix}\${subjectKey}_\`) && f.endsWith('.json'));
    files.forEach(f => {
        const filePath = path.join(examplesDir, f);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
            examples.push(...data);
        }
    });
    return examples;
}`;

if (content.includes(oldFunc)) {
    content = content.replace(oldFunc, newFunc);
    console.log('已替换loadExamplesBySubject函数');
} else {
    console.log('未找到旧函数，尝试查找...');
    const idx = content.indexOf('function loadExamplesBySubject');
    if (idx !== -1) {
        console.log('函数位置:', idx);
        console.log('函数内容:');
        console.log(content.slice(idx, idx + 300));
    }
}

// 替换统计部分
const oldStats = `// 统计所有知识点数量
let totalKnowledge = 0;
let totalExamples = 0;
Object.entries(subjects).forEach(([key, subject]) => {
    const knowledge = loadKnowledgeByFiles(subject.files);
    const examples = subject.noExamples ? [] : loadExamplesBySubject(key);
    totalKnowledge += knowledge.length;
    totalExamples += examples.length;
    subject.knowledge = knowledge;
    subject.examples = examples;
    subject.count = knowledge.length;
});`;

const newStats = `// 统计所有知识点数量
let totalKnowledge = 0;
let totalExamples = 0;
Object.entries(allSubjects).forEach(([key, subject]) => {
    const knowledge = loadKnowledgeByFiles(subject.files);
    const examples = subject.noExamples ? [] : loadExamplesBySubject(subject.gradePrefix, subject.subjectKey);
    totalKnowledge += knowledge.length;
    totalExamples += examples.length;
    subject.knowledge = knowledge;
    subject.examples = examples;
    subject.count = knowledge.length;
});`;

if (content.includes(oldStats)) {
    content = content.replace(oldStats, newStats);
    console.log('已替换统计部分');
} else {
    console.log('未找到旧统计代码');
}

fs.writeFileSync('generate_standalone.js', content, 'utf8');
console.log('文件已保存');
