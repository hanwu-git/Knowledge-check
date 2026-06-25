// 简化版：生成所有例题文件（使用占位符内容）
const fs = require('fs');
const path = require('path');

const examplesDir = 'data/examples';

// 所有科目知识点数量配置
const subjects = {
    math: { upper: 27, lower: 26 },
    physics: { upper: 28, lower: 30 },
    english: { upper: 45, lower: 42 },
    geography: { upper: 50, lower: 35 },
    chinese: { upper: 30, lower: 30 },
    history: { upper: 46, lower: 46 },
    daofa: { upper: 30, lower: 30 },
    biology: { upper: 33, lower: 33 }
};

// 知识点主题（用于生成有意义的题目）
const topics = {
    math: ['三角形内角和', '全等三角形判定', '轴对称性质', '一次函数', '因式分解', '分式运算', '二次根式', '勾股定理', '平行四边形', '菱形性质'],
    physics: ['速度公式', '力的合成', '压强计算', '浮力原理', '机械功', '功率计算', '比热容', '欧姆定律', '电功率', '电磁感应'],
    english: ['一般现在时', '现在进行时', '一般过去时', '过去进行时', '一般将来时', '现在完成时', '情态动词', '被动语态', '宾语从句', '定语从句'],
    geography: ['经纬网', '地形地势', '气候类型', '河流湖泊', '自然资源', '人口分布', '经济发展', '交通运输', '区域地理', '环境问题'],
    chinese: ['新闻阅读', '传记写作', '古诗词鉴赏', '说明方法', '小说人物', '文言文实词', '散文抒情', '议论文写作', '名著阅读', '写作技巧'],
    history: ['朝代更替', '重要事件', '历史人物', '战争与和平', '文化遗产', '政治制度', '经济发展', '科技创新', '文化交流', '历史意义'],
    daofa: ['公民权利', '公民义务', '社会规则', '责任担当', '道德修养', '法治观念', '人生规划', '心理健康', '人际关系', '社会参与'],
    biology: ['细胞结构', '新陈代谢', '遗传变异', '进化理论', '生态系统', '植物光合', '动物行为', '微生物', '人体系统', '生物技术']
};

function generateExamples(subject, semester, num) {
    const prefix = semester === 'upper' ? 'u' : 'l';
    const knowledgeId = `g2_${subject}_${prefix}${String(num).padStart(3, '0')}`;
    const topicIdx = (num - 1) % 10;
    const topic = topics[subject][topicIdx];
    const examples = [];
    
    for (let i = 1; i <= 10; i++) {
        examples.push({
            id: `${knowledgeId}_ex${String(i).padStart(2, '0')}`,
            knowledge_id: knowledgeId,
            question: `${topic}练习${i}：请根据所学知识回答以下问题(${i}/10)`,
            answer: `本题答案为：xxx。解析：本题考察了${topic}的相关知识点...`
        });
    }
    return examples;
}

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

console.log(`已生成 ${totalCount} 个例题文件`);
