const fs = require('fs');
const path = require('path');

const examplesDir = 'd:/obj/学生复习/data/examples';
const upperData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_upper.json', 'utf8'));
const lowerData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_lower.json', 'utf8'));

// 统计文件
const upperFiles = upperData.map(k => `g2_history_u${k.id.split('_u').pop()}_010.json`);
const lowerFiles = lowerData.map(k => `g2_history_l${k.id.split('_l').pop()}_010.json`);
const allFiles = [...upperFiles, ...lowerFiles];

console.log(`应生成文件数: ${allFiles.length}`);
console.log(`上册文件: ${upperFiles.length}`);
console.log(`下册文件: ${lowerFiles.length}`);

// 验证
let results = { total: 0, valid: 0, invalid: 0, missing: 0, wrongCount: 0, hasPlaceholder: [] };

for (const filename of allFiles) {
    const filepath = path.join(examplesDir, filename);
    results.total++;

    if (!fs.existsSync(filepath)) {
        results.missing++;
        console.log(`缺失: ${filename}`);
        continue;
    }

    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(content);

        if (!Array.isArray(data)) {
            results.invalid++;
            console.log(`非数组: ${filename}`);
            continue;
        }

        if (data.length !== 10) {
            results.wrongCount++;
            console.log(`题目数量错误(${data.length}): ${filename}`);
            continue;
        }

        // 检查占位符
        for (const item of data) {
            if (item.question.includes('xxx') || 
                item.question.includes('朝代更替练习') ||
                item.answer.includes('xxx') ||
                item.answer.includes('本题答案为：xxx')) {
                results.hasPlaceholder.push(filename);
                break;
            }
        }

        // 验证题目结构
        let structureValid = true;
        for (const item of data) {
            if (!item.id || !item.knowledge_id || !item.question || !item.answer) {
                structureValid = false;
                break;
            }
        }

        if (structureValid) {
            results.valid++;
        } else {
            results.invalid++;
            console.log(`结构错误: ${filename}`);
        }
    } catch (err) {
        results.invalid++;
        console.log(`解析错误: ${filename}, ${err.message}`);
    }
}

console.log('\n=== 验证结果 ===');
console.log(`总计: ${results.total}`);
console.log(`有效: ${results.valid}`);
console.log(`无效: ${results.invalid}`);
console.log(`缺失: ${results.missing}`);
console.log(`题目数量错误: ${results.wrongCount}`);
console.log(`包含占位符: ${results.hasPlaceholder.length}`);
if (results.hasPlaceholder.length > 0) {
    console.log('占位符文件:', results.hasPlaceholder.join(', '));
}