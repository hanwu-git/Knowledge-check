// 生成所有新科目例题文件
const fs = require('fs');
const path = require('path');

const examplesDir = 'data/examples';

// 新科目知识点数量
const subjects = {
    chinese: { upper: 30, lower: 30 },
    history: { upper: 46, lower: 46 },
    daofa: { upper: 30, lower: 30 },
    biology: { upper: 33, lower: 33 }
};

// 生成例题
function generateExamples(subject, semester, num) {
    const prefix = semester === 'upper' ? 'u' : 'l';
    const examples = [];
    const topics = {
        chinese: ['新闻要素', '传记特点', '古诗词鉴赏', '说明方法', '小说三要素', '文言文实词', '散文抒情', '议论文论点', '宋词知识', '名著阅读'],
        history: ['朝代更替', '重要事件', '历史人物', '战争', '改革', '思想', '经济', '文化', '外交', '科技'],
        daofa: ['公民权利', '义务', '责任', '法治', '道德', '国家利益', '社会规则', '人生规划', '成长', '心理健康'],
        biology: ['动物分类', '运动结构', '细菌真菌', '遗传变异', '进化', '生态环境', '生物技术', '细胞', '新陈代谢', '繁殖']
    };
    
    const topicList = topics[subject] || topics.chinese;
    
    for (let i = 1; i <= 10; i++) {
        const topicIdx = (i - 1) % topicList.length;
        examples.push({
            id: `g2_${subject}_${prefix}${String(num).padStart(3, '0')}_ex${String(i).padStart(2, '0')}`,
            knowledge_id: `g2_${subject}_${prefix}${String(num).padStart(3, '0')}`,
            question: `练习${i}：关于"${topicList[topicIdx]}"的题目${num}`,
            answer: `这是第${i}题的答案和解析...`
        });
    }
    return examples;
}

// 生成所有文件
let totalCount = 0;
for (const [subject, semesters] of Object.entries(subjects)) {
    for (const [semester, count] of Object.entries(semesters)) {
        const prefix = semester === 'upper' ? 'u' : 'l';
        for (let i = 1; i <= count; i++) {
            const knowledgeId = `g2_${subject}_${prefix}${String(i).padStart(3, '0')}`;
            const filePath = path.join(examplesDir, `${knowledgeId}_010.json`);
            const examples = generateExamples(subject, semester, i);
            fs.writeFileSync(filePath, JSON.stringify(examples, null, 2), 'utf8');
            totalCount++;
        }
    }
}

console.log(`已生成 ${totalCount} 个新科目例题文件`);
