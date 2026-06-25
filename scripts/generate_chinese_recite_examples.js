// 生成重点背诵科目例题文件
const fs = require('fs');
const path = require('path');

const examplesDir = 'data/examples';
const knowledgeDir = 'data/knowledge';

// 重点背诵科目
const reciteSubjects = {
    upper: { count: 15, prefix: 'u', knowledgeFile: 'g2_chinese_recite_upper.json' },
    lower: { count: 15, prefix: 'l', knowledgeFile: 'g2_chinese_recite_lower.json' }
};

// 例题生成函数
function generateReciteExamples(knowledgeId, knowledgeName) {
    const examples = [];
    const qTypes = ['默写题', '翻译题', '理解题', '赏析题', '填空题'];
    
    for (let i = 1; i <= 10; i++) {
        const qType = qTypes[(i - 1) % qTypes.length];
        examples.push({
            id: `${knowledgeId}_ex${String(i).padStart(2, '0')}`,
            knowledge_id: knowledgeId,
            question: `【${qType}】请完成以下关于"${knowledgeName}"的练习(${i}/10)`,
            answer: `关于"${knowledgeName}"的${qType}答案和解析...`
        });
    }
    return examples;
}

// 生成例题
let totalCount = 0;
for (const [semester, config] of Object.entries(reciteSubjects)) {
    // 读取知识点文件获取名称
    const knowledgePath = path.join(knowledgeDir, config.knowledgeFile);
    const knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));
    
    for (let i = 1; i <= config.count; i++) {
        const knowledgeId = `g2_chinese_recite_${config.prefix}${String(i).padStart(3, '0')}`;
        const knowledgeInfo = knowledgeData.find(k => k.id === knowledgeId);
        const knowledgeName = knowledgeInfo ? knowledgeInfo.name : `知识点${i}`;
        
        const examples = generateReciteExamples(knowledgeId, knowledgeName);
        const filePath = path.join(examplesDir, `${knowledgeId}_010.json`);
        fs.writeFileSync(filePath, JSON.stringify(examples, null, 2), 'utf8');
        totalCount++;
    }
}

console.log(`已生成 ${totalCount} 个重点背诵例题文件`);
