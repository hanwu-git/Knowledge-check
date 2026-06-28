/**
 * 修复初二地理知识点ID格式
 * 
 * 问题：上下册ID格式不统一，有些有u/l前缀，有些没有，导致ID重叠
 * 修复：统一为标准格式
 *   - 上册：g2_geography_u001 ~ u050
 *   - 下册：g2_geography_l001 ~ l035
 * 
 * 同时更新例题文件中的knowledge_id
 */
const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = 'data/knowledge';
const EXAMPLES_DIR = 'data/examples';

// 读取原始数据
const upperFile = path.join(KNOWLEDGE_DIR, 'g2_geography_upper.json');
const lowerFile = path.join(KNOWLEDGE_DIR, 'g2_geography_lower.json');

const upperData = JSON.parse(fs.readFileSync(upperFile, 'utf8'));
const lowerData = JSON.parse(fs.readFileSync(lowerFile, 'utf8'));

console.log('原始数据:');
console.log(`  上册: ${upperData.length} 个知识点`);
console.log(`  下册: ${lowerData.length} 个知识点`);

// 建立旧ID到新ID的映射
const idMapping = {};

// 修复上册ID
console.log('\n修复上册ID...');
upperData.forEach((item, index) => {
    const newId = `g2_geography_u${String(index + 1).padStart(3, '0')}`;
    const oldId = item.id;
    if (oldId !== newId) {
        idMapping[oldId] = newId;
        console.log(`  ${oldId} -> ${newId}`);
    }
    item.id = newId;
});

// 修复下册ID
console.log('\n修复下册ID...');
lowerData.forEach((item, index) => {
    const newId = `g2_geography_l${String(index + 1).padStart(3, '0')}`;
    const oldId = item.id;
    if (oldId !== newId) {
        idMapping[oldId] = newId;
        console.log(`  ${oldId} -> ${newId}`);
    }
    item.id = newId;
});

console.log(`\n共需要更新 ${Object.keys(idMapping).length} 个ID`);

// 保存修复后的知识点文件
fs.writeFileSync(upperFile, JSON.stringify(upperData, null, 2), 'utf8');
fs.writeFileSync(lowerFile, JSON.stringify(lowerData, null, 2), 'utf8');
console.log('✅ 知识点文件已保存');

// 更新例题文件中的knowledge_id
console.log('\n更新例题文件...');

// 获取所有初二地理例题文件
const exampleFiles = fs.readdirSync(EXAMPLES_DIR).filter(f => 
    f.startsWith('g2_geography_') && f.endsWith('.json')
);

console.log(`找到 ${exampleFiles.length} 个例题文件`);

let updatedExamples = 0;

exampleFiles.forEach(fileName => {
    const filePath = path.join(EXAMPLES_DIR, fileName);
    const examples = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let fileUpdated = false;
    examples.forEach(ex => {
        if (idMapping[ex.knowledge_id]) {
            ex.knowledge_id = idMapping[ex.knowledge_id];
            // 同时更新例题ID
            if (ex.id) {
                const oldExId = ex.id;
                // 替换ID前缀部分
                Object.keys(idMapping).forEach(oldKpId => {
                    if (ex.id.startsWith(oldKpId + '_')) {
                        ex.id = ex.id.replace(oldKpId + '_', idMapping[oldKpId] + '_');
                    }
                });
            }
            fileUpdated = true;
            updatedExamples++;
        }
    });
    
    if (fileUpdated) {
        fs.writeFileSync(filePath, JSON.stringify(examples, null, 2), 'utf8');
        console.log(`  ✅ ${fileName} - 更新了 ${examples.filter(ex => idMapping[ex.knowledge_id]).length} 道题`);
    }
});

console.log(`\n✅ 共更新 ${updatedExamples} 道例题`);

// 验证修复结果
console.log('\n验证修复结果...');

const fixedUpper = JSON.parse(fs.readFileSync(upperFile, 'utf8'));
const fixedLower = JSON.parse(fs.readFileSync(lowerFile, 'utf8'));

const upperIds = new Set(fixedUpper.map(k => k.id));
const lowerIds = new Set(fixedLower.map(k => k.id));
const overlap = [...upperIds].filter(id => lowerIds.has(id));

console.log(`  上册ID数量: ${fixedUpper.length}`);
console.log(`  下册ID数量: ${fixedLower.length}`);
console.log(`  上下册重叠: ${overlap.length}`);

if (overlap.length === 0) {
    console.log('  ✅ 修复成功！没有ID重叠了');
} else {
    console.log('  ❌ 修复失败，仍有重叠');
    console.log('  重叠ID:', overlap);
}

// 检查上册ID格式
const upperFormatOk = fixedUpper.every(k => /^g2_geography_u\d{3}$/.test(k.id));
const lowerFormatOk = fixedLower.every(k => /^g2_geography_l\d{3}$/.test(k.id));

console.log(`  上册格式正确: ${upperFormatOk ? '✅' : '❌'}`);
console.log(`  下册格式正确: ${lowerFormatOk ? '✅' : '❌'}`);

console.log('\n🎉 初二地理ID修复完成！');