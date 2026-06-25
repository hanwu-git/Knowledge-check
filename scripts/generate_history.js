const fs = require('fs');
const path = require('path');

// 读取知识点文件
const upperData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_upper.json', 'utf8'));
const lowerData = JSON.parse(fs.readFileSync('d:/obj/学生复习/data/knowledge/g2_history_lower.json', 'utf8'));

const allGenerators = {};

// 为每个知识点创建生成函数
[...upperData, ...lowerData].forEach(k => {
    allGenerators[k.id] = createGenerator(k);
});

function createGenerator(knowledge) {
    const name = knowledge.name;
    const formula = knowledge.formula;
    const explanation = knowledge.explanation;

    return {
        q1: { q: `选择题：${name}发生在什么时间？\nA. 距今约170万年\nB. ${formula}\nC. 公元前221年\nD. 公元960年`, a: `答案：B\n解析：${name}的时间是${formula}。${explanation}` },
        q2: { q: `填空题：${name}——${explanation.split('。')[0]}。\n${name}的公式/时间是：_________`, a: `答案：${formula}\n解析：${name}${explanation}` },
        q3: { q: `连线题：请将历史人物与其成就连线\n① ${name}\nA. 商鞅变法\nB. ${formula}\nC. 统一六国\nD. 贞观之治\n连线：①——____`, a: `答案：①——B\n解析：${name}${explanation}` },
        q4: { q: `简答题：请简述${name}的历史意义或主要内容。\n要求：不少于80字`, a: `答案：${name}${explanation}\n\n知识扩展：这一历史事件对后世产生了深远影响。` },
        q5: { q: `材料分析题：阅读下列材料，回答问题。\n材料：${explanation}\n问题：${name}体现的历史特征是什么？`, a: `答案：${name}主要体现了以下历史特征：\n1. ${explanation.split('。')[0]}。\n2. 这一时期的历史发展规律。\n3. 对后世的影响和启示。\n\n解析：${explanation}` },
        q6: { q: `选择题：关于${name}，下列说法正确的是？\nA. ${explanation.split('。')[0]}\nB. 这不是重要历史事件\nC. 与中国历史无关\nD. 仅存在于传说中`, a: `答案：A\n解析：${name}${explanation}` },
        q7: { q: `填空题：${name}发生在_________时期。`, a: `答案：${formula}\n解析：${name}${explanation}` },
        q8: { q: `判断题：\"${name}${explanation.split('。')[0]}。\"这一说法是否正确？`, a: `答案：正确\n解析：${name}${explanation}` },
        q9: { q: `简答题：${name}对后世有什么影响？`, a: `答案：${explanation}\n解析：${name}是历史上的重要事件。` },
        q10: { q: `材料分析题：\"${explanation}\"请分析这句话反映了什么历史现象？`, a: `答案：这反映了${name}的历史背景和重要意义。\n解析：${explanation}` }
    };
}

// 生成所有文件
function generateAllFiles() {
    const allData = [...upperData, ...lowerData];
    let count = 0;
    const results = { success: [], failed: [] };

    for (const knowledge of allData) {
        try {
            const generator = allGenerators[knowledge.id];
            if (!generator) {
                console.log(`未找到生成器: ${knowledge.id}`);
                continue;
            }

            const questions = [];
            for (let i = 1; i <= 10; i++) {
                const q = generator[`q${i}`];
                questions.push({
                    id: `${knowledge.id}_ex${i.toString().padStart(2, '0')}`,
                    knowledge_id: knowledge.id,
                    question: q.q,
                    answer: q.a
                });
            }

            const suffix = knowledge.id.includes('_u') ? 'u' : 'l';
            const num = knowledge.id.split('_u').pop() || knowledge.id.split('_l').pop();
            const filename = `g2_history_${suffix}${num}_010.json`;
            const filepath = path.join('d:/obj/学生复习/data/examples', filename);

            const content = JSON.stringify(questions, null, 2);
            fs.writeFileSync(filepath, content, 'utf8');

            results.success.push(filename);
            count++;

            if (count % 20 === 0) {
                console.log(`已生成 ${count}/92 个文件`);
            }
        } catch (err) {
            results.failed.push({ id: knowledge.id, error: err.message });
            console.log(`生成失败: ${knowledge.id}, 错误: ${err.message}`);
        }
    }

    console.log(`\n完成！共生成 ${results.success.length} 个文件`);
    if (results.failed.length > 0) {
        console.log(`失败 ${results.failed.length} 个`);
        results.failed.forEach(f => console.log(`  - ${f.id}: ${f.error}`));
    }
}

generateAllFiles();