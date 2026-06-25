const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, 'data', 'knowledge');
const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

let passed = 0;
let failed = 0;

function check(condition, msg) {
    if (condition) {
        passed++;
        console.log('  ✓ ' + msg);
    } else {
        failed++;
        console.log('  ✗ ' + msg);
    }
}

console.log('========== 任务6验证：一年级生物 ==========');
console.log('');

console.log('【知识点文件检查】');

const upperPath = path.join(KNOWLEDGE_DIR, 'g1_biology_upper.json');
const lowerPath = path.join(KNOWLEDGE_DIR, 'g1_biology_lower.json');

check(fs.existsSync(upperPath), '上册知识点文件存在');
check(fs.existsSync(lowerPath), '下册知识点文件存在');

console.log('');
console.log('【知识点数量检查】');

const upperData = JSON.parse(fs.readFileSync(upperPath, 'utf-8'));
const lowerData = JSON.parse(fs.readFileSync(lowerPath, 'utf-8'));

check(upperData.length === 30, '上册知识点数量：' + upperData.length + '/30');
check(lowerData.length === 30, '下册知识点数量：' + lowerData.length + '/30');

console.log('');
console.log('【ID格式检查】');

function validateIds(data, prefix, semester) {
    const expectedPrefix = prefix + semester;
    let allValid = true;
    let count = 0;
    data.forEach((item, index) => {
        const expectedId = expectedPrefix + String(index + 1).padStart(3, '0');
        if (item.id !== expectedId) {
            allValid = false;
            console.log('    错误：第' + (index + 1) + '个 ID=' + item.id + '，期望=' + expectedId);
        }
        if (item.semester === (semester === 'u' ? 'upper' : 'lower')) {
            count++;
        }
    });
    return allValid && count === data.length;
}

check(validateIds(upperData, 'g1_biology_', 'u'), '上册ID格式正确（g1_biology_u001~u030）');
check(validateIds(lowerData, 'g1_biology_', 'l'), '下册ID格式正确（g1_biology_l001~l030）');

console.log('');
console.log('【知识点内容完整性检查】');

function validateContent(data) {
    let allValid = true;
    data.forEach((item, index) => {
        if (!item.chapter || !item.name || !item.formula || !item.explanation) {
            allValid = false;
            console.log('    错误：第' + (index + 1) + '个知识点字段不完整');
        }
        if (item.explanation && item.explanation.length < 20) {
            allValid = false;
            console.log('    警告：第' + (index + 1) + '个知识点内容过短');
        }
    });
    return allValid;
}

check(validateContent(upperData), '上册知识点内容完整');
check(validateContent(lowerData), '下册知识点内容完整');

console.log('');
console.log('【例题文件检查】');

let totalExamples = 0;
let exampleFilesValid = true;

const allKnowledge = [...upperData, ...lowerData];
allKnowledge.forEach((k, idx) => {
    const kid = k.id;
    const exampleFile = path.join(EXAMPLE_DIR, kid + '_010.json');
    if (!fs.existsSync(exampleFile)) {
        exampleFilesValid = false;
        console.log('    缺失：' + kid + '_010.json');
    } else {
        const examples = JSON.parse(fs.readFileSync(exampleFile, 'utf-8'));
        totalExamples += examples.length;
        if (examples.length !== 10) {
            exampleFilesValid = false;
            console.log('    数量错误：' + kid + ' 有' + examples.length + '道题，期望10道');
        }
        examples.forEach((ex, i) => {
            if (!ex.question || !ex.answer) {
                exampleFilesValid = false;
                console.log('    内容缺失：' + kid + ' 第' + (i + 1) + '题');
            }
        });
    }
});

check(exampleFilesValid, '所有例题文件存在且内容完整');
console.log('  例题总数：' + totalExamples + '道（期望600道）');
check(totalExamples === 600, '例题总数正确（600道）');

console.log('');
console.log('========== 验证结果 ==========');
console.log('通过：' + passed + '项');
console.log('失败：' + failed + '项');

if (failed === 0) {
    console.log('');
    console.log('🎉 任务6验证全部通过！');
} else {
    console.log('');
    console.log('❌ 任务6验证未通过，需要修复！');
    process.exit(1);
}
