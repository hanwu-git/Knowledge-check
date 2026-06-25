const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');
const GRADE = 'g2';
const SUBJECT = 'biology';

function extractExamples(exp) {
    const examples = [];
    const sentences = exp.split(/[。；;]/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 10);
}

function extractKeyTerms(name, exp, formula) {
    const terms = new Set();
    if (name) terms.add(name.replace(/的主要特征|的特征|的概念|的结构|的功能/g, ''));
    if (formula) {
        formula.split(/[|、，,]/).forEach(t => {
            t = t.trim();
            if (t.length > 1 && t.length < 15) terms.add(t);
        });
    }
    const match = exp.match(/代表动物[^。]*[。]/);
    if (match) {
        match[0].match(/[\u4e00-\u9fa5]{2,6}(?=、|，|。|,)/g)?.forEach(t => terms.add(t));
    }
    return [...terms].filter(t => t.length > 1 && t.length < 20).slice(0, 8);
}

function generateQuestions(kp) {
    const questions = [];
    const name = kp.name;
    const exp = kp.explanation || '';
    const formula = kp.formula || '';
    const shortName = name.replace(/的主要特征|的特征|的概念|的结构|的功能/g, '');

    const keyTerms = extractKeyTerms(name, exp, formula);
    const sentences = extractExamples(exp);

    // 从explanation中提取主要特征句子
    const featureMatch = exp.match(/主要特征[：:]([^。]+(?:。[^。]*)*)/);
    const featuresText = featureMatch ? featureMatch[1] : exp;
    const featurePoints = featuresText.split(/[；;。\n]/).filter(s => s.trim().length > 5).slice(0, 5);

    function add(q, a) {
        questions.push({ q, a });
    }

    // 1. 选择题 - 主要特征
    if (featurePoints.length >= 3) {
        const correct = featurePoints[0].trim();
        const wrongs = [
            '身体呈辐射对称，有口无肛门',
            '完全变态发育，经过卵、幼虫、蛹、成虫四个时期',
            '用鳃呼吸，用鳍游泳',
            '胎生哺乳，体表被毛'
        ].filter(w => !correct.includes(w.substring(0, 5))).slice(0, 3);
        add(`选择题：下列关于${name}的说法，正确的是（  ）\nA. ${wrongs[0] || '错误说法A'}\nB. ${correct}\nC. ${wrongs[1] || '错误说法C'}\nD. ${wrongs[2] || '错误说法D'}`,
            `答案：B\n解析：${correct}。这是${name}的重要特征。`);
    }

    // 2. 填空题 - 代表动物
    if (keyTerms.length >= 3) {
        const animals = keyTerms.filter(t => exp.includes(t) && t.length < 6).slice(0, 3);
        if (animals.length >= 2) {
            add(`填空题：${shortName}的代表动物有______、______等。`,
                `答案：${animals[0]}；${animals[1]}\n解析：${animals[0]}、${animals[1]}都是${shortName}的典型代表。`);
        }
    }

    // 3. 判断题 - 正确描述
    if (sentences.length > 0) {
        add(`判断题：${sentences[0].trim()}。（  ）`,
            `答案：正确\n解析：这是${name}的正确描述。`);
    }

    // 4. 选择题 - 代表动物识别
    if (keyTerms.length >= 4) {
        const correct = keyTerms[0];
        const wrongs = keyTerms.slice(1, 4);
        add(`选择题：下列动物中，属于${shortName}的是（  ）\nA. ${wrongs[0] || '蝗虫'}\nB. ${wrongs[1] || '蚯蚓'}\nC. ${correct}\nD. ${wrongs[2] || '蜗牛'}`,
            `答案：C\n解析：${correct}属于${shortName}，其他选项不属于。`);
    }

    // 5. 填空题 - 核心公式
    if (formula) {
        add(`填空题：${name}的核心要点可以概括为：______。`,
            `答案：${formula}\n解析：这是${name}的核心内容概括。`);
    }

    // 6. 简答题 - 主要特征
    if (featurePoints.length >= 2) {
        const summary = featurePoints.slice(0, 3).join('；');
        add(`简答题：请简述${name}的主要特征。`,
            `答案：${summary}。\n解析：这些是${shortName}最主要的特征，需要重点掌握。`);
    }

    // 7. 判断题 - 错误描述
    add(`判断题：${shortName}都生活在海洋中，淡水环境中没有它们的分布。（  ）`,
        `答案：错误\n解析：${shortName}的生活环境多样，有的生活在海洋，有的生活在淡水，还有的生活在陆地或寄生生活。`);

    // 8. 选择题 - 结构/功能
    if (sentences.length >= 3) {
        const s = sentences[2].trim();
        add(`选择题：关于${shortName}的结构特点，下列说法正确的是（  ）\nA. 体内有脊柱，属于脊椎动物\nB. ${s.substring(0, 30)}...\nC. 都是单细胞生物\nD. 都用肺呼吸`,
            `答案：B\n解析：${s}。`);
    }

    // 9. 匹配题
    if (keyTerms.length >= 4) {
        add(`连线题：请将下列动物与所属类群连线。\n1. ${keyTerms[0] || '水螅'}    A. ${shortName}\n2. ${keyTerms[1] || '蝗虫'}    B. 其他类群\n3. ${keyTerms[2] || '蜗牛'}    C. 其他类群\n4. ${keyTerms[3] || '蚯蚓'}    D. 其他类群`,
            `答案：1-A，2-B，3-C，4-D\n解析：只有${keyTerms[0] || '水螅'}属于${shortName}。`);
    }

    // 10. 综合应用题
    add(`分析题：在观察${shortName}的实验中，需要注意哪些问题？`,
        `答案：①要爱护实验动物，实验后将其放归自然；②观察时要仔细，按照从整体到局部的顺序；③注意保护实验动物的生活环境；④认真记录观察到的现象。\n解析：观察实验要遵循科学方法，同时要爱护生命。`);

    // 补充到10道
    let n = 0;
    while (questions.length < 10) {
        if (sentences[n % sentences.length]) {
            const s = sentences[n % sentences.length].trim();
            add(`填空题：${s.substring(0, 20)}...，这体现了${shortName}的______特点。`,
                `答案：${s.substring(0, 15)}\n解析：这是${shortName}的重要特点。`);
        } else {
            add(`判断题：学习生物要理论联系实际，多观察多思考。（  ）`,
                `答案：正确\n解析：生物学是一门实验科学，观察和实验是学习生物的重要方法。`);
        }
        n++;
        if (n > 20) break;
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
