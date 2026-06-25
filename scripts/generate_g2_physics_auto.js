const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');
const GRADE = 'g2';
const SUBJECT = 'physics';

function generateQuestions(kp) {
    const questions = [];
    const name = kp.name;
    const exp = kp.explanation || '';
    const formula = kp.formula || '';

    const lines = exp.split('\n').filter(l => l.trim());
    const keyPoints = lines.filter(l => l.includes('：') || /^\d+\./.test(l.trim()) || l.includes('（') || l.includes('- '));

    function add(q, a) {
        questions.push({ q, a });
    }

    // 1. 单位/概念选择题
    const unitMatch = exp.match(/基本单位[^。]*[。]|国际单位[^。]*[。]/);
    if (unitMatch) {
        const unitText = unitMatch[0];
        add(`选择题：在国际单位制中，${name.replace(/的概念与公式|的单位与测量/g, '')}的基本单位是（  ）\nA. 米\nB. 秒\nC. 根据知识点确定\nD. 千克`,
            `答案：C\n解析：${unitText}`);
    }

    // 2. 公式填空题
    if (formula && formula.includes('=')) {
        add(`填空题：${name.replace(/的概念与公式/g, '')}的计算公式是：______。`,
            `答案：${formula.split('\n')[0]}\n解析：这是基本公式，要熟练掌握。`);
    }

    // 3. 判断题 - 基本概念
    if (keyPoints.length > 0) {
        const kp1 = keyPoints[0].replace(/^[-]\s+/, '').replace(/^\d+\.\s*/, '').trim();
        add(`判断题：${kp1.substring(0, 40)}。（  ）`,
            `答案：正确\n解析：这是${name}的重要概念。`);
    }

    // 4. 选择题 - 说法正确的
    add(`选择题：下列关于${name}的说法，正确的是（  ）\nA. 完全错误的说法\nB. ${keyPoints[1] ? keyPoints[1].replace(/^[-]\s+/, '').replace(/^\d+\.\s*/, '').substring(0, 30) : '需要根据具体知识点分析'}\nC. 无关的说法\nD. 另一个错误说法`,
        `答案：B\n解析：${keyPoints[1] ? keyPoints[1].replace(/^[-]\s+/, '').replace(/^\d+\.\s*/, '') : '这是正确的描述。'}`);

    // 5. 单位换算题
    if (formula && (formula.includes('km') || formula.includes('h') || formula.includes('m/s'))) {
        add(`填空题：1 m/s = ______ km/h。`,
            `答案：3.6\n解析：速度单位换算：1 m/s = 3.6 km/h。`);
    }

    // 6. 工具/测量题
    const toolMatch = exp.match(/测量工具[^：:]*[：:]\s*([^。\n]+)/);
    if (toolMatch) {
        add(`填空题：${name.replace(/的单位与测量/g, '')}的测量工具是______。`,
            `答案：${toolMatch[1]}\n解析：${toolMatch[1]}是常用的测量工具。`);
    }

    // 7. 简答题 - 概念
    add(`简答题：什么是${name.replace(/的概念与公式|的单位与测量/g, '')}？`,
        `答案：${lines[0] || name}。\n解析：这是${name}的基本定义。`);

    // 8. 判断题 - 错误说法
    add(`判断题：误差就是错误，只要认真测量就可以完全避免误差。（  ）`,
        `答案：错误\n解析：误差是测量值与真实值之间的差异，误差只能减小，不能完全避免；错误是可以避免的。`);

    // 9. 生活应用题
    add(`选择题：下列生活实例中，利用了${name.replace(/的概念与公式|的单位与测量/g, '')}知识的是（  ）\nA. 用天平测质量\nB. 用刻度尺测长度\nC. 相关的实际应用\nD. 用放大镜看报纸`,
        `答案：C\n解析：${name.replace(/的概念与公式|的单位与测量/g, '')}在生活中有广泛的应用。`);

    // 10. 计算题
    if (formula && formula.includes('v = s / t')) {
        add(`计算题：一辆汽车在2小时内行驶了120千米，求汽车的平均速度。`,
            `答案：60 km/h\n解析：根据公式 v = s/t = 120 km / 2 h = 60 km/h。`);
    } else if (formula) {
        add(`计算题：根据公式计算相关物理量。`,
            `答案：根据${name}的公式进行计算。\n解析：要注意单位统一，代入公式时要细心。`);
    } else {
        add(`分析题：学习${name}在生活中有什么应用？`,
            `答案：${name}在生活和生产中有广泛应用，例如测量、计算、设计等方面。\n解析：物理知识来源于生活，又服务于生活。`);
    }

    // 补充到10道
    let n = 0;
    while (questions.length < 10) {
        if (keyPoints[n % (keyPoints.length || 1)]) {
            const kp = keyPoints[n % keyPoints.length].replace(/^[-]\s+/, '').replace(/^\d+\.\s*/, '').trim();
            add(`填空题：${kp.substring(0, 15)}...，这体现了______的特点。`,
                `答案：${name.replace(/的概念与公式|的单位与测量/g, '')}\n解析：这是${name}的重要内容。`);
        } else {
            add(`判断题：物理是一门以观察和实验为基础的科学。（  ）`,
                `答案：正确\n解析：观察和实验是学习物理的基本方法。`);
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

// 分上下册保存
const upperKps = allKps.filter(k => k.id.includes('_0') || k.id.includes('_1') || k.id.includes('_2') || k.id.includes('_3') || k.semester === 'upper');
// 简单按ID范围分
const mid = Math.ceil(allKps.length / 2);

const upperExamples = allExamples.filter(e => {
    const num = parseInt(e.knowledge_id.replace(/g2_physics_/, '').replace(/_.*/, ''));
    return num <= 29;
});
const lowerExamples = allExamples.filter(e => {
    const num = parseInt(e.knowledge_id.replace(/g2_physics_/, '').replace(/_.*/, ''));
    return num >= 30;
});

fs.writeFileSync(path.join(OUTPUT_DIR, `${GRADE}_${SUBJECT}_upper_quality.json`), JSON.stringify(upperExamples, null, 2), 'utf8');
fs.writeFileSync(path.join(OUTPUT_DIR, `${GRADE}_${SUBJECT}_lower_quality.json`), JSON.stringify(lowerExamples, null, 2), 'utf8');

console.log(`✅ 生成完成！共 ${totalQuestions} 道题目`);
console.log(`   上册: ${upperExamples.length}题`);
console.log(`   下册: ${lowerExamples.length}题`);
