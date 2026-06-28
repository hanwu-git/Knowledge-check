const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

// 一年级科目配置
const grade1Subjects = [
    { key: 'math', name: '数学', hasExamples: true },
    { key: 'english', name: '英语', hasExamples: true },
    { key: 'chinese', name: '语文', hasExamples: true },
    { key: 'chinese_recite', name: '语文重点背诵', hasExamples: false },
    { key: 'english_vocab', name: '英语词汇背诵', hasExamples: false },
    { key: 'history', name: '历史', hasExamples: true },
    { key: 'geography', name: '地理', hasExamples: true },
    { key: 'biology', name: '生物', hasExamples: true },
    { key: 'daofa', name: '道德与法治', hasExamples: true }
];

let totalPassed = 0;
let totalFailed = 0;

function log(msg, type = 'info') {
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} ${msg}`);
}

function checkFileExists(filePath, desc) {
    if (fs.existsSync(filePath)) {
        log(`${desc} 存在`, 'success');
        return true;
    } else {
        log(`${desc} 不存在: ${filePath}`, 'error');
        return false;
    }
}

function validateKnowledge(subjectKey, subjectName, semester, expectedCount = 30) {
    const fileName = `g1_${subjectKey}_${semester}.json`;
    const filePath = path.join(KNOWLEDGE_DIR, fileName);
    
    if (!checkFileExists(filePath, `${subjectName}${semester === 'upper' ? '上册' : '下册'}知识点`)) {
        return false;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (data.length !== expectedCount) {
            log(`${subjectName}${semester === 'upper' ? '上册' : '下册'}知识点数量: ${data.length} (期望: ${expectedCount})`, 'error');
            return false;
        }
        
        // 检查ID格式
        const prefix = `g1_${subjectKey}_${semester === 'upper' ? 'u' : 'l'}`;
        let idValid = true;
        let contentValid = true;
        
        data.forEach((item, index) => {
            const expectedId = prefix + String(index + 1).padStart(3, '0');
            if (item.id !== expectedId) {
                log(`ID错误: ${item.id}, 期望: ${expectedId}`, 'error');
                idValid = false;
            }
            if (!item.name || item.name.trim() === '') {
                log(`第${index+1}个知识点name为空`, 'error');
                contentValid = false;
            }
            if (!item.explanation || item.explanation.trim() === '') {
                log(`第${index+1}个知识点explanation为空`, 'error');
                contentValid = false;
            }
        });
        
        if (idValid && contentValid) {
            log(`${subjectName}${semester === 'upper' ? '上册' : '下册'}: ${data.length}个知识点, ID和内容正确`, 'success');
            return true;
        }
        return false;
    } catch (e) {
        log(`${subjectName}${semester === 'upper' ? '上册' : '下册'}知识点解析失败: ${e.message}`, 'error');
        return false;
    }
}

function validateExamples(subjectKey, subjectName, semester) {
    const semesterPrefix = semester === 'upper' ? 'u' : 'l';
    const prefix = `g1_${subjectKey}_${semesterPrefix}`;
    let totalExamples = 0;
    let allValid = true;
    
    const files = fs.readdirSync(EXAMPLE_DIR)
        .filter(f => f.startsWith(prefix) && f.endsWith('_010.json'))
        .sort();
    
    if (files.length === 0) {
        log(`${subjectName}${semester === 'upper' ? '上册' : '下册'}: 未找到例题文件`, 'warn');
        return true;
    }
    
    files.forEach(fileName => {
        const filePath = path.join(EXAMPLE_DIR, fileName);
        const kid = fileName.replace('_010.json', '');
        
        try {
            const examples = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            totalExamples += examples.length;
            
            if (examples.length !== 10) {
                log(`${kid} 例题数量: ${examples.length} (期望: 10)`, 'error');
                allValid = false;
            }
            
            examples.forEach((ex, idx) => {
                if (!ex.question || ex.question.trim() === '') {
                    log(`${kid}_ex${String(idx+1).padStart(2,'0')} 题目为空`, 'error');
                    allValid = false;
                }
                if (!ex.answer || ex.answer.trim() === '') {
                    log(`${kid}_ex${String(idx+1).padStart(2,'0')} 答案为空`, 'error');
                    allValid = false;
                }
            });
        } catch (e) {
            log(`${fileName} 解析失败: ${e.message}`, 'error');
            allValid = false;
        }
    });
    
    if (allValid) {
        log(`${subjectName}${semester === 'upper' ? '上册' : '下册'}: ${files.length}个文件, ${totalExamples}道例题, 全部正确`, 'success');
    }
    return allValid;
}

function validateHtmlPage(filePath, pageName) {
    if (!checkFileExists(filePath, `${pageName}页面`)) {
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查基本HTML结构
    if (!content.includes('<!DOCTYPE html>')) {
        log(`${pageName} 缺少DOCTYPE声明`, 'error');
        return false;
    }
    if (!content.includes('<html')) {
        log(`${pageName} 缺少html标签`, 'error');
        return false;
    }
    if (!content.includes('localStorage')) {
        log(`${pageName} 缺少localStorage功能`, 'warn');
    }
    
    log(`${pageName}: 结构完整`, 'success');
    return true;
}

console.log('='.repeat(60));
console.log('📋 一年级全量验证');
console.log('='.repeat(60));

// 1. 验证知识点
console.log('\n📚 【1/4】验证知识点文件');
console.log('-'.repeat(60));
let knowledgePassed = 0;
grade1Subjects.forEach(subj => {
    const expectedCount = (subj.key === 'chinese_recite' || subj.key === 'english_vocab') ? 15 : 30;
    const upperPass = validateKnowledge(subj.key, subj.name, 'upper', expectedCount);
    const lowerPass = validateKnowledge(subj.key, subj.name, 'lower', expectedCount);
    if (upperPass && lowerPass) knowledgePassed++;
});

// 2. 验证例题
console.log('\n✏️ 【2/4】验证例题文件');
console.log('-'.repeat(60));
let examplePassed = 0;
grade1Subjects.filter(s => s.hasExamples).forEach(subj => {
    const upperPass = validateExamples(subj.key, subj.name, 'upper');
    const lowerPass = validateExamples(subj.key, subj.name, 'lower');
    if (upperPass && lowerPass) examplePassed++;
});
// 无例题的科目也算通过
examplePassed += grade1Subjects.filter(s => !s.hasExamples).length;

// 3. 验证HTML页面
console.log('\n🌐 【3/4】验证HTML页面');
console.log('-'.repeat(60));
let htmlPassed = 0;

const ROOT_DIR = path.join(__dirname, '..');

// 一年级首页
if (validateHtmlPage(path.join(ROOT_DIR, 'grade1_index.html'), '一年级首页')) htmlPassed++;

// 各科目页面
grade1Subjects.forEach(subj => {
    const fileName = `g1_${subj.key}.html`;
    if (validateHtmlPage(path.join(ROOT_DIR, fileName), `一年级${subj.name}`)) htmlPassed++;
});

// 4. 验证首页导航
console.log('\n🏠 【4/4】验证首页导航');
console.log('-'.repeat(60));
const indexPath = path.join(ROOT_DIR, 'index.html');
if (checkFileExists(indexPath, '主首页')) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    let navPassed = true;
    
    // 检查是否有一年级入口
    if (!indexContent.includes('grade1_index.html') && !indexContent.includes('g1_math.html')) {
        log('首页缺少一年级科目链接', 'error');
        navPassed = false;
    }
    
    // 检查是否有二年级入口
    if (!indexContent.includes('knowledge_math.html') && !indexContent.includes('g2_')) {
        log('首页缺少二年级科目链接', 'warn');
    }
    
    if (navPassed) {
        log('首页导航正常', 'success');
        htmlPassed++;
    }
}

// 统计
console.log('\n' + '='.repeat(60));
console.log('📊 验证结果汇总');
console.log('='.repeat(60));
console.log(`知识点验证: ${knowledgePassed}/${grade1Subjects.length} 科目通过`);
console.log(`例题验证: ${examplePassed}/${grade1Subjects.length} 科目通过`);
console.log(`页面验证: ${htmlPassed}/${grade1Subjects.length + 2} 页面通过`);

const allPassed = knowledgePassed === grade1Subjects.length && 
                  examplePassed === grade1Subjects.length &&
                  htmlPassed === grade1Subjects.length + 2;

console.log('\n' + (allPassed ? '🎉 全部验证通过！' : '❌ 存在验证失败项，请检查'));
