// 重新生成所有例题文件
const fs = require('fs');
const path = require('path');

const examplesDir = 'data/examples';

// 确保目录存在
if (!fs.existsSync(examplesDir)) {
    fs.mkdirSync(examplesDir, { recursive: true });
}

// 数学上册（26个知识点）
const mathLowerIds = Array.from({length: 26}, (_, i) => `g2_math_${String(i+1).padStart(3, '0')}`);
// 数学下册（27个知识点）
const mathUpperIds = Array.from({length: 27}, (_, i) => `g2_math_${String(i+27).padStart(3, '0')}`);
// 物理上册（28个知识点）
const physicsUpperIds = Array.from({length: 28}, (_, i) => `g2_physics_${String(i+1).padStart(3, '0')}`);
// 物理下册（30个知识点）
const physicsLowerIds = Array.from({length: 30}, (_, i) => `g2_physics_${String(i+28).padStart(3, '0')}`);
// 英语上册（45个知识点）
const englishUpperIds = Array.from({length: 45}, (_, i) => `g2_english_u${String(i+1).padStart(3, '0')}`);
// 英语下册（42个知识点）
const englishLowerIds = Array.from({length: 42}, (_, i) => `g2_english_l${String(i+1).padStart(3, '0')}`);
// 地理上册（50个知识点）
const geographyUpperIds = Array.from({length: 50}, (_, i) => `g2_geography_u${String(i+1).padStart(3, '0')}`);
// 地理下册（35个知识点）
const geographyLowerIds = Array.from({length: 35}, (_, i) => `g2_geography_l${String(i+1).padStart(3, '0')}`);

const allIds = [
    ...mathLowerIds, ...mathUpperIds,
    ...physicsUpperIds, ...physicsLowerIds,
    ...englishUpperIds, ...englishLowerIds,
    ...geographyUpperIds, ...geographyLowerIds
];

console.log(`将生成 ${allIds.length} 个例题文件`);

// 生成例题的函数
function generateExamples(knowledgeId) {
    const examples = [];
    for (let i = 1; i <= 10; i++) {
        examples.push({
            id: `${knowledgeId}_ex${String(i).padStart(2, '0')}`,
            knowledge_id: knowledgeId,
            question: `${knowledgeId} 相关练习题目${i}`,
            answer: `这是${knowledgeId}的答案和详细解析${i}`
        });
    }
    return examples;
}

// 删除旧的损坏文件并生成新的
allIds.forEach(id => {
    const filePath = path.join(examplesDir, `${id}_010.json`);
    const examples = generateExamples(id);
    fs.writeFileSync(filePath, JSON.stringify(examples, null, 2), 'utf8');
});

console.log(`已生成 ${allIds.length} 个例题文件`);
