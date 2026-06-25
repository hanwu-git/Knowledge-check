const fs = require('fs');
const path = require('path');

// 读取知识点文件
const upperData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_upper.json', 'utf8'));
const lowerData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_lower.json', 'utf8'));

function createQuestions(knowledge) {
    const name = knowledge.name;
    const formula = knowledge.formula;
    const explanation = knowledge.explanation;

    return [
        { id: `${knowledge.id}_ex01`, knowledge_id: knowledge.id, question: `选择题：${name}发生在什么时间？\nA. 距今约170万年\nB. ${formula}\nC. 公元前221年\nD. 公元960年`, answer: `答案：B\n解析：${name}的时间是${formula}。${explanation}` },
        { id: `${knowledge.id}_ex02`, knowledge_id: knowledge.id, question: `填空题：${name}——${explanation.split('。')[0]}。\n${name}的公式/时间是：_________`, answer: `答案：${formula}\n解析：${name}${explanation}` },
        { id: `${knowledge.id}_ex03`, knowledge_id: knowledge.id, question: `连线题：请将历史人物与其成就连线\n① ${name}\nA. 商鞅变法\nB. ${formula}\nC. 统一六国\nD. 贞观之治\n连线：①——____`, answer: `答案：①——B\n解析：${name}${explanation}` },
        { id: `${knowledge.id}_ex04`, knowledge_id: knowledge.id, question: `简答题：请简述${name}的历史意义或主要内容。\n要求：不少于80字`, answer: `答案：${name}${explanation}\n\n知识扩展：这一历史事件对后世产生了深远影响。` },
        { id: `${knowledge.id}_ex05`, knowledge_id: knowledge.id, question: `材料分析题：阅读下列材料，回答问题。\n材料：${explanation}\n问题：${name}体现的历史特征是什么？`, answer: `答案：${name}主要体现了以下历史特征：\n1. ${explanation.split('。')[0]}。\n2. 这一时期的历史发展规律。\n3. 对后世的影响和启示。\n\n解析：${explanation}` },
        { id: `${knowledge.id}_ex06`, knowledge_id: knowledge.id, question: `选择题：关于${name}，下列说法正确的是？\nA. ${explanation.split('。')[0]}\nB. 这不是重要历史事件\nC. 与中国历史无关\nD. 仅存在于传说中`, answer: `答案：A\n解析：${name}${explanation}` },
        { id: `${knowledge.id}_ex07`, knowledge_id: knowledge.id, question: `填空题：${name}发生在_________时期。`, answer: `答案：${formula}\n解析：${name}${explanation}` },
        { id: `${knowledge.id}_ex08`, knowledge_id: knowledge.id, question: `判断题："${name}${explanation.split('。')[0]}。"这一说法是否正确？`, answer: `答案：正确\n解析：${name}${explanation}` },
        { id: `${knowledge.id}_ex09`, knowledge_id: knowledge.id, question: `简答题：${name}对后世有什么影响？`, answer: `答案：${explanation}\n解析：${name}是历史上的重要事件。` },
        { id: `${knowledge.id}_ex10`, knowledge_id: knowledge.id, question: `材料分析题："${explanation}"请分析这句话反映了什么历史现象？`, answer: `答案：这反映了${name}的历史背景和重要意义。\n解析：${explanation}` }
    ];
}

function getFilename(knowledgeId) {
    // 修复：正确提取数字部分
    if (knowledgeId.includes('_u')) {
        const num = knowledgeId.split('_u')[1]; // 例如 u001
        return `g2_history_${num}_010.json`;
    } else if (knowledgeId.includes('_l')) {
        const num = knowledgeId.split('_l')[1]; // 例如 l001
        return `g2_history_${num}_010.json`;
    }
    return null;
}

const examplesDir = 'd:/obj/学生复习/data/examples';

// 处理上册
console.log('处理上册...');
upperData.forEach(knowledge => {
    const questions = createQuestions(knowledge);
    const filename = getFilename(knowledge.id);
    const filepath = path.join(examplesDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(questions, null, 2), 'utf8');
});
console.log(`上册完成: ${upperData.length} 个文件`);

// 处理下册
console.log('处理下册...');
lowerData.forEach(knowledge => {
    const questions = createQuestions(knowledge);
    const filename = getFilename(knowledge.id);
    const filepath = path.join(examplesDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(questions, null, 2), 'utf8');
});
console.log(`下册完成: ${lowerData.length} 个文件`);

console.log('\n全部完成！共生成 92 个文件');