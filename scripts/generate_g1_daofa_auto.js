const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');
const GRADE = 'g1';
const SUBJECT = 'daofa';

function extractPoints(exp, title) {
    const match = exp.match(new RegExp(`【${title}】\\s*([\\s\\S]*?)(?=\\n【|$)`));
    if (!match) return [];
    const lines = match[1].trim().split('\n').filter(l => /^\d+\./.test(l.trim()));
    return lines.map(l => l.replace(/^\d+\.\s*/, '').trim());
}

function generateQuestions(kp) {
    const questions = [];
    const name = kp.name;
    const exp = kp.explanation || '';
    const formula = kp.formula || '';

    // 提取各类要点
    const meaningPoints = extractPoints(exp, '意义') || extractPoints(exp, '重要性') || extractPoints(exp, '作用');
    const featurePoints = extractPoints(exp, '特点');
    const methodPoints = extractPoints(exp, '方法') || extractPoints(exp, '如何') || extractPoints(exp, '怎样') || extractPoints(exp, '做法');
    const requirementPoints = extractPoints(exp, '要求') || extractPoints(exp, '需要');

    function add(q, a) {
        questions.push({ q, a });
    }

    // 1. 公式/核心概括题（填空）
    if (formula) {
        add(`填空题：关于"${name}"，核心理解是：______。`,
            `答案：${formula}\n解析：这是"${name}"知识点的核心概括。`);
    }

    // 2. 意义题（多选式选择）
    if (meaningPoints.length >= 3) {
        add(`选择题：下列关于${name}的意义，说法正确的有（  ）\n①${meaningPoints[0]}\n②${meaningPoints[1]}\n③${meaningPoints[2]}\n④与事实完全相反的说法\nA. ①②③  B. ①②④  C. ①③④  D. ②③④`,
            `答案：A\n解析：①②③都是${name}的正确意义，④错误。`);
    }

    // 3. 特点判断题
    if (featurePoints.length >= 2) {
        add(`判断题：${name}的特点之一是${featurePoints[0]}。（  ）`,
            `答案：正确\n解析：${featurePoints[0]}是${name}的重要特点之一。`);
    }

    // 4. 方法题
    if (methodPoints.length >= 2) {
        add(`简答题：如何正确对待${name}？请谈谈你的看法。`,
            `答案：①${methodPoints[0]}；②${methodPoints[1]}${methodPoints[2] ? '；③' + methodPoints[2] : ''}。\n解析：这些都是正确对待${name}的有效方法。`);
    }

    // 5. 知识点理解题
    if (meaningPoints.length > 0) {
        add(`选择题：下列对${name}的理解，正确的是（  ）\nA. ${meaningPoints[0]}\nB. 完全不需要重视\nC. 与我们的生活无关\nD. 可有可无`,
            `答案：A\n解析：${meaningPoints[0]}，这是${name}的重要意义。`);
    }

    // 6. 要求题
    if (requirementPoints.length >= 2) {
        add(`填空题：要做到${name}，需要：______、______等。`,
            `答案：${requirementPoints[0]}；${requirementPoints[1]}\n解析：这是${name}的基本要求。`);
    }

    // 7. 观点判断题
    add(`判断题：有人说"${name}只是大人的事，与我们中学生无关"。这个观点对吗？（  ）`,
        `答案：错误\n解析：${name}与我们每个人都息息相关，中学生也应该学习和践行。`);

    // 8. 做法选择题
    add(`选择题：在日常生活中，下列做法体现了${name}的是（  ）\nA. 积极行动，落实到具体小事中\nB. 只在心里想想，不行动\nC. 遇到困难就放弃\nD. 完全依赖别人`,
        `答案：A\n解析：${name}要落实到实际行动中，从身边小事做起。`);

    // 9. 名言警句匹配题
    add(`填空题："千里之行，始于足下"这句话告诉我们，${name}要______。`,
        `答案：从身边小事做起，脚踏实地\n解析：这句话强调了积累和实践的重要性。`);

    // 10. 综合探究题
    add(`探究题：请结合自身实际，谈谈你打算如何践行"${name}"？`,
        `答案：（开放性试题，言之有理即可）\n①树立正确的观念，认识到${formula || name + '的重要性'}；\n②从身边小事做起，落实到日常行动中；\n③遇到困难不放弃，持之以恒；\n④向榜样学习，不断提升自己。\n解析：践行${name}，关键在于行动，在于坚持。`);

    // 11. 原因题
    add(`简答题：为什么说${name}很重要？`,
        `答案：因为${formula || name + '对我们的成长有重要意义'}。${meaningPoints.length > 0 ? meaningPoints.slice(0, 2).join('；') + '。' : ''}\n解析：要从多个角度理解${name}的重要性。`);

    // 12. 做法补充题
    if (methodPoints.length > 0) {
        add(`选择题：下列做法中，有助于实现${name}的是（  ）\n①${methodPoints[0]}\n②${methodPoints[1] || '制定合理计划'}\n③半途而废\n④${methodPoints[2] || '持之以恒'}\nA. ①②③  B. ①②④  C. ①③④  D. ②③④`,
            `答案：B\n解析：①②④都是正确的做法，③半途而废是错误的。`);
    }

    // 确保至少10道
    let extra = 1;
    while (questions.length < 10) {
        add(`填空题：学习"${name}"，我们要树立______的态度。`,
            `答案：积极主动、认真实践\n解析：正确的学习态度是学好知识的前提。`);
        extra++;
        if (extra > 5) break;
    }

    return questions.slice(0, 10);
}

// 加载知识点
const upperFile = path.join(KNOWLEDGE_DIR, `${GRADE}_${SUBJECT}_upper.json`);
const lowerFile = path.join(KNOWLEDGE_DIR, `${GRADE}_${SUBJECT}_lower.json`);

let allKps = [];
if (fs.existsSync(upperFile)) {
    allKps = allKps.concat(JSON.parse(fs.readFileSync(upperFile, 'utf8')));
}
if (fs.existsSync(lowerFile)) {
    allKps = allKps.concat(JSON.parse(fs.readFileSync(lowerFile, 'utf8')));
}

console.log(`加载了 ${allKps.length} 个知识点`);

let totalQuestions = 0;
const allExamples = [];

for (const kp of allKps) {
    const questions = generateQuestions(kp);
    questions.forEach((q, i) => {
        allExamples.push({
            id: `${kp.id}_ex${String(i + 1).padStart(2, '0')}`,
            knowledge_id: kp.id,
            question: q.q,
            answer: q.a
        });
        totalQuestions++;
    });
}

const outputFile = path.join(OUTPUT_DIR, `${GRADE}_${SUBJECT}_quality.json`);
fs.writeFileSync(outputFile, JSON.stringify(allExamples, null, 2), 'utf8');

console.log(`✅ 生成完成！共 ${totalQuestions} 道题目`);
