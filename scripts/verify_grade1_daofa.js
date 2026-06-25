const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, 'data', 'knowledge');
const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

const GRADE = 1;
const SUBJECT = 'daofa';
const SUBJECT_NAME = '道德与法治';

console.log(`========== 任务7验证：一年级${SUBJECT_NAME} ==========`);

function validateIds(data, prefix, semester) {
    const expectedPrefix = prefix + semester;
    let allValid = true;
    data.forEach((item, index) => {
        const expectedId = expectedPrefix + String(index + 1).padStart(3, '0');
        if (item.id !== expectedId) {
            allValid = false;
            console.log(`  错误：第${index+1}个 ID=${item.id}，期望=${expectedId}`);
        }
    });
    return allValid;
}

function validateKnowledge() {
    console.log(`\n检查一年级${SUBJECT_NAME}知识点...`);
    
    const upperPath = path.join(KNOWLEDGE_DIR, `g${GRADE}_${SUBJECT}_upper.json`);
    const lowerPath = path.join(KNOWLEDGE_DIR, `g${GRADE}_${SUBJECT}_lower.json`);
    
    if (!fs.existsSync(upperPath)) {
        console.log(`  ❌ 上册知识点文件不存在: g${GRADE}_${SUBJECT}_upper.json`);
        return false;
    }
    if (!fs.existsSync(lowerPath)) {
        console.log(`  ❌ 下册知识点文件不存在: g${GRADE}_${SUBJECT}_lower.json`);
        return false;
    }
    
    const upperData = JSON.parse(fs.readFileSync(upperPath, 'utf8'));
    const lowerData = JSON.parse(fs.readFileSync(lowerPath, 'utf8'));
    
    console.log(`  上册知识点数量: ${upperData.length}`);
    console.log(`  下册知识点数量: ${lowerData.length}`);
    
    if (upperData.length !== 30) {
        console.log(`  ❌ 上册知识点数量应为30，实际${upperData.length}`);
        return false;
    }
    if (lowerData.length !== 30) {
        console.log(`  ❌ 下册知识点数量应为30，实际${lowerData.length}`);
        return false;
    }
    console.log('  ✅ 知识点数量正确（每册30个）');
    
    const prefix = `g${GRADE}_${SUBJECT}_`;
    const upperValid = validateIds(upperData, prefix, 'u');
    const lowerValid = validateIds(lowerData, prefix, 'l');
    
    if (!upperValid || !lowerValid) {
        console.log('  ❌ ID格式错误');
        return false;
    }
    console.log('  ✅ ID格式正确');
    
    let contentValid = true;
    upperData.forEach((item, i) => {
        if (!item.name || !item.chapter || !item.explanation) {
            contentValid = false;
            console.log(`  ❌ 上册第${i+1}个知识点内容不完整`);
        }
    });
    lowerData.forEach((item, i) => {
        if (!item.name || !item.chapter || !item.explanation) {
            contentValid = false;
            console.log(`  ❌ 下册第${i+1}个知识点内容不完整`);
        }
    });
    
    if (!contentValid) return false;
    console.log('  ✅ 知识点内容完整');
    
    return true;
}

function validateExamples() {
    console.log(`\n检查一年级${SUBJECT_NAME}例题...`);
    
    const upperPath = path.join(KNOWLEDGE_DIR, `g${GRADE}_${SUBJECT}_upper.json`);
    const lowerPath = path.join(KNOWLEDGE_DIR, `g${GRADE}_${SUBJECT}_lower.json`);
    const upperData = JSON.parse(fs.readFileSync(upperPath, 'utf8'));
    const lowerData = JSON.parse(fs.readFileSync(lowerPath, 'utf8'));
    
    const allKnowledge = upperData.concat(lowerData);
    let totalExamples = 0;
    let allValid = true;
    
    allKnowledge.forEach((k, idx) => {
        const kid = k.id;
        const exampleFile = path.join(EXAMPLE_DIR, `${kid}_010.json`);
        
        if (!fs.existsSync(exampleFile)) {
            console.log(`  ❌ 例题文件不存在: ${kid}_010.json`);
            allValid = false;
            return;
        }
        
        const examples = JSON.parse(fs.readFileSync(exampleFile, 'utf8'));
        totalExamples += examples.length;
        
        if (examples.length !== 10) {
            console.log(`  ❌ ${kid} 例题数量应为10，实际${examples.length}`);
            allValid = false;
        }
        
        examples.forEach((ex, i) => {
            if (!ex.id || !ex.question || !ex.answer) {
                console.log(`  ❌ ${kid} 第${i+1}题内容不完整`);
                allValid = false;
            }
            if (!ex.id.startsWith(kid)) {
                console.log(`  ❌ ${kid} 第${i+1}题ID格式错误: ${ex.id}`);
                allValid = false;
            }
        });
    });
    
    console.log(`  例题总数: ${totalExamples}`);
    
    if (totalExamples !== 600) {
        console.log(`  ❌ 例题总数应为600，实际${totalExamples}`);
        return false;
    }
    console.log('  ✅ 例题数量正确（600道）');
    
    if (!allValid) return false;
    console.log('  ✅ 例题内容完整');
    
    return true;
}

const knowledgeOk = validateKnowledge();
const examplesOk = validateExamples();

console.log(`\n========== 验证结果 ==========`);
if (knowledgeOk && examplesOk) {
    console.log(`✅ 一年级${SUBJECT_NAME}验证通过！`);
    console.log(`   - 知识点：60个（上下册各30个）`);
    console.log(`   - 例题：600道（每知识点10道）`);
    process.exit(0);
} else {
    console.log(`❌ 一年级${SUBJECT_NAME}验证失败，请检查上述错误`);
    process.exit(1);
}
