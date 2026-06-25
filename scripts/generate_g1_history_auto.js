const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');
const GRADE = 'g1';
const SUBJECT = 'history';

function generateQuestions(kp) {
    const questions = [];
    const name = kp.name;
    const exp = kp.explanation || '';
    const formula = kp.formula || '';

    // 提取时间
    const timeMatch = exp.match(/【时间】\s*([^\n]+)/);
    const time = timeMatch ? timeMatch[1].trim() : '';

    // 提取地点/国家
    const placeMatch = exp.match(/【地点】\s*([^\n]+)/) || exp.match(/【发动国】\s*([^\n]+)/) || exp.match(/【国家】\s*([^\n]+)/);
    const place = placeMatch ? placeMatch[1].trim() : '';

    // 提取人物/领导人
    const personMatch = exp.match(/【领导人】\s*([^\n]+)/) || exp.match(/【人物】\s*([^\n]+)/) || exp.match(/【代表】\s*([^\n]+)/);
    const person = personMatch ? personMatch[1].trim() : '';

    // 提取原因
    const reasonMatch = exp.match(/【原因】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    const reason = reasonMatch ? reasonMatch[1].trim().split('\n')[0] : '';

    // 提取结果
    const resultMatch = exp.match(/【结果】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    const result = resultMatch ? resultMatch[1].trim().split('\n')[0] : '';

    // 提取影响
    const influenceMatch = exp.match(/【影响】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/) || exp.match(/【意义】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    let influence = '';
    let influencePoints = [];
    if (influenceMatch) {
        influence = influenceMatch[1].trim();
        influencePoints = influence.split('\n').filter(l => /^\d+\./.test(l.trim())).map(l => l.replace(/^\d+\.\s*/, '').trim());
        if (influencePoints.length === 0) {
            influencePoints = influence.split(/[。；;]/).filter(s => s.trim().length > 5).slice(0, 4);
        }
    }

    // 提取主要内容
    const contentMatch = exp.match(/【主要内容】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/) || exp.match(/【经过】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/) || exp.match(/【主要事件】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    let contentPoints = [];
    if (contentMatch) {
        const content = contentMatch[1].trim();
        contentPoints = content.split('\n').filter(l => /^\d+\./.test(l.trim())).map(l => l.replace(/^\d+\.\s*/, '').trim());
        if (contentPoints.length === 0) {
            contentPoints = content.split(/[。；;]/).filter(s => s.trim().length > 5).slice(0, 4);
        }
    }

    // 提取性质
    const natureMatch = exp.match(/【性质】\s*([^\n]+)/);
    const nature = natureMatch ? natureMatch[1].trim() : '';

    function add(q, a) {
        questions.push({ q, a });
    }

    // 1. 时间题
    if (time) {
        add(`填空题：${name}的时间是______。`,
            `答案：${time}\n解析：这是${name}的基本史实，需要准确记忆。`);
    }

    // 2. 人物题
    if (person) {
        const wrongPersons = ['林则徐', '洪秀全', '李鸿章', '曾国藩', '康有为', '梁启超', '孙中山', '袁世凯', '毛泽东', '蒋介石'];
        const wrong = wrongPersons.filter(p => !person.includes(p) && p !== person).slice(0, 3);
        add(`选择题：${name}的主要领导人是（  ）\nA. ${wrong[0] || '李鸿章'}\nB. ${person}\nC. ${wrong[1] || '康有为'}\nD. ${wrong[2] || '孙中山'}`,
            `答案：B\n解析：${name}的主要领导人是${person}。`);
    }

    // 3. 地点/国家题
    if (place) {
        add(`选择题：${name}涉及的主要国家是（  ）\nA. 日本\nB. ${place}\nC. 美国\nD. 德国`,
            `答案：B\n解析：${name}主要与${place}有关。`);
    }

    // 4. 原因题
    if (reason) {
        add(`简答题：${name}爆发的原因是什么？`,
            `答案：${reason}\n解析：这是${name}爆发的主要原因。`);
    }

    // 5. 结果题
    if (result) {
        add(`判断题：${name}的结果是${result}。（  ）`,
            `答案：正确\n解析：这是${name}的结果。`);
    }

    // 6. 影响题（多选/填空）
    if (influencePoints.length >= 2) {
        const blanks = influencePoints.slice(0, 3).map((_, i) => '______').join('、');
        const answers = influencePoints.slice(0, 3).join('；');
        add(`填空题：${name}的主要影响有：${blanks}等。`,
            `答案：${answers}\n解析：这些都是${name}的重要影响。`);
    }

    // 7. 内容匹配题
    if (contentPoints.length >= 3) {
        add(`选择题：下列哪一项不属于${name}的内容？（  ）\nA. ${contentPoints[0] || ''}\nB. ${contentPoints[1] || ''}\nC. 与史实完全无关的事件\nD. ${contentPoints[2] || ''}`,
            `答案：C\n解析：A、B、D都是${name}的内容，C不是。`);
    }

    // 8. 性质题
    if (nature) {
        add(`填空题：${name}的性质是______。`,
            `答案：${nature}\n解析：这是${name}的性质定位。`);
    }

    // 9. 意义题
    if (formula) {
        add(`判断题："${formula}"是对${name}的正确概括。（  ）`,
            `答案：正确\n解析：这是对${name}的高度概括。`);
    }

    // 10. 综合题
    add(`简答题：请简述${name}的历史意义。`,
        `答案：${influence || formula || name}是中国近代史上的重要事件，${reason ? '它的发生有深刻的历史背景，' : ''}${result ? '结果是' + result + '，' : ''}对中国历史发展产生了深远影响。\n解析：学习历史事件要从时间、地点、人物、原因、经过、结果、影响等多个方面全面掌握。`);

    // 补充到10道
    let supplement = 1;
    while (questions.length < 10) {
        if (formula && supplement === 1) {
            add(`简答题：请用一句话概括${name}。`,
                `答案：${formula}\n解析：这是对${name}的高度概括。`);
        } else {
            add(`填空题：学习历史要掌握事件的六要素：______、______、______、原因、经过、结果。`,
                `答案：时间；地点；人物\n解析：这是学习历史事件的基本方法。`);
        }
        supplement++;
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
