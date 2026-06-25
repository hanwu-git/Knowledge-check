const fs = require('fs');

let content = fs.readFileSync('generate_standalone.js', 'utf8');

// 找到函数起始位置
const funcStart = content.indexOf('function loadExamplesBySubject');
const funcEnd = content.indexOf('}', content.indexOf('return examples;', funcStart)) + 1;

console.log('函数起始位置:', funcStart);
console.log('函数结束位置:', funcEnd);
console.log('函数内容:');
console.log(content.slice(funcStart, funcEnd));

// 构建新函数
const newFunc = `function loadExamplesBySubject(gradePrefix, subjectKey) {
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

// 替换
content = content.slice(0, funcStart) + newFunc + content.slice(funcEnd);

fs.writeFileSync('generate_standalone.js', content, 'utf8');
console.log('函数已更新');
