const fs = require('fs');
const path = require('path');

// 读取知识点文件
const upperData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_upper.json', 'utf8'));
const lowerData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_lower.json', 'utf8'));

// 调试：检查ID格式
console.log('上册ID示例:', upperData[0].id);
console.log('下册ID示例:', lowerData[0].id);

// 测试分割逻辑
const testId = lowerData[0].id;
console.log(`\n测试 ${testId}:`);
console.log('  split(_u):', testId.split('_u'));
console.log('  split(_u).pop():', testId.split('_u').pop());
console.log('  split(_l):', testId.split('_l'));
console.log('  split(_l).pop():', testId.split('_l').pop());

// 重新生成下册文件
lowerData.forEach(knowledge => {
    const name = knowledge.name;
    const formula = knowledge.formula;
    const explanation = knowledge.explanation;
    
    const questions = [
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
    
    // 生成文件名
    const parts = knowledge.id.split('_');
    const suffix = knowledge.id.includes('_u') ? 'u' : 'l';
    const num = suffix === 'u' ? parts[2] : parts[2];
    
    console.log(`\n处理 ${knowledge.id}: suffix=${suffix}, num=${num}`);
    
    const filename = `g2_history_${suffix}${num}_010.json`;
    console.log(`  文件名: ${filename}`);
    
    const filepath = path.join('d:/obj/学生复习/data/examples', filename);
    const content = JSON.stringify(questions, null, 2);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`  已写入: ${filepath}`);
});

console.log('\n下册文件重新生成完成');