const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, 'data', 'knowledge');
const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function pickRandom(arr, count = 1) {
    const shuffled = shuffleArray(arr);
    return shuffled.slice(0, count);
}

function cleanText(text) {
    return text.replace(/【.*?】/g, '').replace(/\s+/g, ' ').trim();
}

function extractKeyPoints(explanation) {
    const points = [];
    if (!explanation) return points;
    
    const lines = explanation.split('\n').filter(l => l.trim());
    
    lines.forEach(line => {
        const trimmed = line.trim();
        
        if (trimmed.match(/^\d+\.\s*/)) {
            const content = trimmed.replace(/^\d+\.\s*/, '');
            points.push({ type: 'point', content: content });
        }
        
        if (trimmed.match(/【.*】/)) {
            const match = trimmed.match(/【(.*?)】\s*(.*)/);
            if (match) {
                points.push({ type: 'section', title: match[1], content: match[2] });
            }
        }
        
        if (trimmed.match(/^[A-Z]\.\s*/)) {
            const content = trimmed.replace(/^[A-Z]\.\s*/, '');
            points.push({ type: 'option', content: content });
        }
        
        if (trimmed.length > 10 && !trimmed.match(/^【/)) {
            points.push({ type: 'text', content: trimmed });
        }
    });
    
    return points;
}

function extractFacts(explanation, formula) {
    const facts = [];
    
    if (formula) {
        facts.push({ type: 'formula', content: formula });
    }
    
    if (!explanation) return facts;
    
    const patterns = [
        { regex: /([^\s]+)\s*=\s*([^\s]+)/g, type: 'equation' },
        { regex: /([^\s]+)\s*>=\s*([^\s]+)/g, type: 'inequality' },
        { regex: /([^\s]+)\s*<=\s*([^\s]+)/g, type: 'inequality' },
        { regex: /([^\s]+)\s*>\s*([^\s]+)/g, type: 'inequality' },
        { regex: /([^\s]+)\s*<\s*([^\s]+)/g, type: 'inequality' },
        { regex: /(\d+°)/g, type: 'degree' },
        { regex: /(\d+%)/g, type: 'percentage' },
        { regex: /(\d+\s*[A-Za-z]+)/g, type: 'measurement' },
        { regex: /(定义|性质|特点|特征|规律|法则|定理|公式)/g, type: 'concept' },
    ];
    
    patterns.forEach(p => {
        let match;
        while ((match = p.regex.exec(explanation)) !== null) {
            facts.push({ type: p.type, content: match[0] });
        }
    });
    
    return facts;
}

function generateQualityExamples(knowledge, subject) {
    const examples = [];
    const k = knowledge;
    const kid = k.id;
    const name = k.name;
    const formula = k.formula || '';
    const explanation = k.explanation || '';
    const chapter = k.chapter || '';
    
    const keyPoints = extractKeyPoints(explanation);
    const facts = extractFacts(explanation, formula);
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${kid}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: kid,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    function addChoice(question, correctOption, wrongOptions, explanation) {
        const options = shuffleArray([correctOption, ...wrongOptions]);
        const labels = ['A', 'B', 'C', 'D'];
        let correctLabel = '';
        const optionStr = options.map((opt, i) => {
            if (opt === correctOption) correctLabel = labels[i];
            return `${labels[i]}. ${opt}`;
        }).join('  ');
        return {
            question: `选择题：${question} ${optionStr}`,
            answer: `答案：${correctLabel}. ${correctOption}。解析：${explanation}`
        };
    }
    
    function createWrongOptions(correct, num = 3) {
        const wrong = [];
        if (correct.includes('180')) {
            wrong.push('90°', '270°', '360°', '120°');
        }
        if (correct.includes('90')) {
            wrong.push('45°', '60°', '120°', '180°');
        }
        if (correct.includes('0')) {
            wrong.push('-1', '1', '不存在', '任意值');
        }
        if (correct.includes('正数')) {
            wrong.push('负数', '零', '任意数', '非负数');
        }
        if (correct.includes('负数')) {
            wrong.push('正数', '零', '任意数', '非正数');
        }
        if (correct.includes('等于')) {
            wrong.push('大于', '小于', '不等于', '约等于');
        }
        if (correct.includes('大于')) {
            wrong.push('小于', '等于', '大于等于', '小于等于');
        }
        if (correct.includes('三角形')) {
            wrong.push('四边形', '五边形', '六边形', '圆形');
        }
        if (correct.includes('直线')) {
            wrong.push('射线', '线段', '曲线', '折线');
        }
        if (correct.includes('平行')) {
            wrong.push('垂直', '相交', '重合', '异面');
        }
        if (correct.includes('垂直')) {
            wrong.push('平行', '相交', '重合', '异面');
        }
        if (correct.includes('有理数')) {
            wrong.push('无理数', '整数', '分数', '自然数');
        }
        if (correct.includes('实数')) {
            wrong.push('虚数', '有理数', '无理数', '复数');
        }
        if (correct.includes('整式')) {
            wrong.push('分式', '根式', '代数式', '方程');
        }
        if (correct.includes('方程')) {
            wrong.push('不等式', '代数式', '函数', '表达式');
        }
        if (correct.includes('函数')) {
            wrong.push('方程', '不等式', '代数式', '数列');
        }
        if (correct.includes('速度')) {
            wrong.push('加速度', '时间', '距离', '质量');
        }
        if (correct.includes('质量')) {
            wrong.push('重量', '体积', '密度', '面积');
        }
        if (correct.includes('密度')) {
            wrong.push('质量', '体积', '重量', '浓度');
        }
        if (correct.includes('力')) {
            wrong.push('功', '能', '功率', '压强');
        }
        if (correct.includes('功')) {
            wrong.push('能', '力', '功率', '热量');
        }
        if (correct.includes('电压')) {
            wrong.push('电流', '电阻', '功率', '电量');
        }
        if (correct.includes('电流')) {
            wrong.push('电压', '电阻', '功率', '电量');
        }
        if (correct.includes('电阻')) {
            wrong.push('电压', '电流', '功率', '电量');
        }
        if (correct.includes('光合作用')) {
            wrong.push('呼吸作用', '蒸腾作用', '吸收作用', '运输作用');
        }
        if (correct.includes('细胞')) {
            wrong.push('组织', '器官', '系统', '个体');
        }
        if (correct.includes('DNA')) {
            wrong.push('RNA', '蛋白质', '糖类', '脂肪');
        }
        if (correct.includes('光合作用')) {
            wrong.push('呼吸作用', '蒸腾作用', '消化作用', '排泄作用');
        }
        if (correct.includes('地球')) {
            wrong.push('太阳', '月球', '火星', '金星');
        }
        if (correct.includes('大陆')) {
            wrong.push('海洋', '岛屿', '半岛', '海峡');
        }
        if (correct.includes('气候')) {
            wrong.push('天气', '气温', '降水', '气压');
        }
        if (correct.includes('黄河')) {
            wrong.push('长江', '珠江', '淮河', '海河');
        }
        if (correct.includes('秦朝')) {
            wrong.push('汉朝', '唐朝', '宋朝', '明朝');
        }
        if (correct.includes('秦始皇')) {
            wrong.push('汉武帝', '唐太宗', '宋太祖', '明太祖');
        }
        if (correct.includes('宪法')) {
            wrong.push('法律', '法规', '条例', '规章');
        }
        if (correct.includes('公民')) {
            wrong.push('人民', '居民', '国民', '群众');
        }
        
        const uniqueWrong = [...new Set(wrong)].filter(w => w !== correct && w.trim());
        return pickRandom(uniqueWrong, num);
    }
    
    const mainPoint = keyPoints.find(p => p.type === 'section' && p.title === '定义') ||
                      keyPoints.find(p => p.type === 'section') ||
                      keyPoints[0];
    
    if (mainPoint) {
        const mainContent = cleanText(mainPoint.content || mainPoint.title || '');
        if (mainContent.length > 5) {
            const q1 = addChoice(
                `下列关于${name}的定义，正确的是？`,
                mainContent.substring(0, 50),
                createWrongOptions(mainContent.substring(0, 30)),
                `${name}的核心定义是：${mainContent.substring(0, 80)}...`
            );
            addQuestion(q1.question, q1.answer);
        }
    }
    
    if (formula) {
        const formulaText = formula.split('\n')[0].trim();
        const q2 = addChoice(
            `${name}的核心公式是？`,
            formulaText,
            createWrongOptions(formulaText),
            `${name}的公式是：${formulaText}。这个公式是解决相关问题的基础，需要牢记并会运用。`
        );
        addQuestion(q2.question, q2.answer);
        
        addQuestion(
            `填空题：${name}的公式是______。`,
            `答案：${formulaText}。解析：这是${name}的核心公式，掌握它是学习该知识点的关键。`
        );
    } else {
        addQuestion(
            `填空题：${name}的主要内容包括______。`,
            `答案：${name}的核心内容包括：${(explanation || '').substring(0, 80)}...解析：这是${name}的重要知识点。`
        );
    }
    
    const properties = keyPoints.filter(p => p.type === 'section' && (p.title === '性质' || p.title === '特点'));
    if (properties.length > 0) {
        const prop = properties[0];
        const propContent = cleanText(prop.content);
        if (propContent.length > 10) {
            const q4 = addChoice(
                `下列关于${name}的性质，说法正确的是？`,
                propContent.substring(0, 40),
                createWrongOptions(propContent.substring(0, 30)),
                `${name}的重要性质包括：${propContent.substring(0, 80)}...`
            );
            addQuestion(q4.question, q4.answer);
        }
    }
    
    const factsList = facts.filter(f => f.type !== 'concept');
    if (factsList.length > 0) {
        const fact = factsList[0];
        const q5 = addChoice(
            `关于${name}，下列说法正确的是？`,
            fact.content,
            createWrongOptions(fact.content),
            `${name}的关键知识点包括：${fact.content}。`
        );
        addQuestion(q5.question, q5.answer);
    }
    
    if (keyPoints.length >= 2) {
        const point1 = keyPoints[0].content || keyPoints[0].title || '';
        const point2 = keyPoints[1].content || keyPoints[1].title || '';
        
        addQuestion(
            `判断题：${point1.substring(0, 30)}...（  ）`,
            `答案：正确。解析：${name}的主要内容包括：${point1.substring(0, 50)}...`
        );
    }
    
    if (explanation && explanation.length > 30) {
        const firstLine = explanation.split('\n').find(l => l.trim() && !l.match(/^【/));
        if (firstLine) {
            const cleanFirst = cleanText(firstLine).substring(0, 50);
            const q7 = addChoice(
                `关于${name}，以下描述正确的是？`,
                cleanFirst,
                createWrongOptions(cleanFirst),
                `${name}是${chapter || '本章节'}的重要知识点，${cleanFirst}...`
            );
            addQuestion(q7.question, q7.answer);
        }
    }
    
    const applicationPoints = keyPoints.filter(p => p.type === 'section' && p.title === '应用' || p.title === '注意');
    if (applicationPoints.length > 0) {
        const app = applicationPoints[0];
        const appContent = cleanText(app.content).substring(0, 40);
        addQuestion(
            `填空题：${name}的应用场景包括______。`,
            `答案：${appContent}。解析：${name}在实际中有广泛应用，${appContent}...`
        );
    } else if (explanation && explanation.length > 50) {
        addQuestion(
            `简答题：请简述${name}的主要内容。`,
            `答案：${name}的主要内容包括：${(formula || explanation.substring(0, 100))}。${explanation.substring(0, 150)}...`
        );
    }
    
    if (factsList.length >= 2) {
        const fact2 = factsList[1];
        const q9 = addChoice(
            `${name}中，下列数值或关系正确的是？`,
            fact2.content,
            createWrongOptions(fact2.content),
            `${name}的重要结论：${fact2.content}。`
        );
        addQuestion(q9.question, q9.answer);
    } else {
        addQuestion(
            `判断题：${name}是${chapter || '本章'}的重要知识点。（  ）`,
            `答案：正确。解析：${name}是${chapter || '本章节'}的核心知识点之一，对后续学习有重要作用。`
        );
    }
    
    if (keyPoints.length >= 3) {
        const point3 = keyPoints[2];
        const pointContent = cleanText(point3.content || point3.title || '');
        const q10 = addChoice(
            `关于${name}，下列说法错误的是？`,
            pointContent.substring(0, 40),
            createWrongOptions(pointContent.substring(0, 30)),
            `${name}的相关知识点：${pointContent.substring(0, 80)}...`
        );
        addQuestion(q10.question, q10.answer);
    } else if (mainPoint) {
        const content = cleanText(mainPoint.content || mainPoint.title || '');
        const q10 = addChoice(
            `下列关于${name}的说法，不正确的是？`,
            '该知识点不需要掌握',
            [content.substring(0, 30), '与实际生活相关', '是基础知识点'],
            `${name}是重要的基础知识点，${content.substring(0, 50)}...`
        );
        addQuestion(q10.question, q10.answer);
    }
    
    while (examples.length < 10) {
        const randomIdx = Math.floor(Math.random() * keyPoints.length);
        const point = keyPoints[randomIdx];
        if (point) {
            const content = cleanText(point.content || point.title || '');
            if (content.length > 10) {
                addQuestion(
                    `判断题：${content.substring(0, 40)}...（  ）`,
                    `答案：正确。解析：${name}的知识点包括：${content.substring(0, 60)}...`
                );
            }
        }
    }
    
    return examples.slice(0, 10);
}

function regenerateExamples(grade, subject, semester) {
    const knowledgeFile = `${grade}_${subject}_${semester}.json`;
    const knowledgePath = path.join(KNOWLEDGE_DIR, knowledgeFile);
    
    if (!fs.existsSync(knowledgePath)) {
        console.log(`❌ 知识点文件不存在: ${knowledgeFile}`);
        return 0;
    }
    
    const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    const semCode = semester === 'upper' ? 'u' : 'l';
    let totalGenerated = 0;
    
    knowledge.forEach((k, idx) => {
        const kid = k.id || `${grade}_${subject}_${semCode}${String(idx + 1).padStart(3, '0')}`;
        const examples = generateQualityExamples(k, subject);
        
        const exampleFile = `${kid}_010.json`;
        const examplePath = path.join(EXAMPLE_DIR, exampleFile);
        fs.writeFileSync(examplePath, JSON.stringify(examples, null, 2));
        
        totalGenerated += examples.length;
    });
    
    console.log(`✅ ${grade}${subject}${semester === 'upper' ? '上册' : '下册'}: ${knowledge.length}个知识点，${totalGenerated}道例题`);
    return totalGenerated;
}

module.exports = { regenerateExamples };
