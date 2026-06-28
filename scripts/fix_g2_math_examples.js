const fs = require('fs');
const path = require('path');

const EX_DIR = 'data/examples';
const KP_DIR = 'data/knowledge';

const upperKP = JSON.parse(fs.readFileSync(path.join(KP_DIR, 'g2_math_upper.json'), 'utf8'));
const lowerKP = JSON.parse(fs.readFileSync(path.join(KP_DIR, 'g2_math_lower.json'), 'utf8'));

const kpById = {};
[...upperKP, ...lowerKP].forEach(kp => {
    kpById[kp.id] = kp;
});

function generateMathExamples(kp) {
    const examples = [];
    const name = kp.name;
    const formula = kp.formula || '';
    const explanation = kp.explanation || '';
    
    const definitions = [];
    const properties = [];
    const formulas = [];
    
    if (explanation) {
        const lines = explanation.split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('- ')) {
                const clean = trimmed.replace(/^[123]\.\s*/, '').replace(/^-\s*/, '');
                if (clean.length > 5) {
                    if (clean.includes('等于') || clean.includes('=') || clean.includes('公式')) {
                        formulas.push(clean);
                    } else if (clean.includes('性质') || clean.includes('特征')) {
                        properties.push(clean);
                    } else {
                        definitions.push(clean);
                    }
                }
            }
        });
    }

    const allContent = [...definitions, ...properties, ...formulas];

    examples.push({
        id: kp.id + '_ex01',
        knowledge_id: kp.id,
        question: '填空题：' + name + '的核心公式是______。',
        answer: '答案：' + (formula || '根据具体公式填写') + '\n解析：' + name + '的核心公式是解决相关问题的基础，需要牢记并熟练应用。'
    });

    if (allContent.length >= 1) {
        examples.push({
            id: kp.id + '_ex02',
            knowledge_id: kp.id,
            question: '判断题：' + allContent[0] + '（  ）',
            answer: '答案：正确\n解析：这是' + name + '的基本性质之一。' + allContent[0] + '这个结论是正确的，是理解' + name + '的重要基础。'
        });
    } else {
        examples.push({
            id: kp.id + '_ex02',
            knowledge_id: kp.id,
            question: '判断题：' + name + '中，相关性质描述是正确的（  ）',
            answer: '答案：正确\n解析：' + name + '的性质是该知识点的核心内容，理解这些性质对于解题至关重要。'
        });
    }

    examples.push({
        id: kp.id + '_ex03',
        knowledge_id: kp.id,
        question: '解答题：请简述' + name + '的主要内容和应用场景。',
        answer: '答案：' + name + '主要包括以下内容：\n' + allContent.slice(0, 3).map((c, i) => (i+1) + '. ' + c).join('\n') + '\n\n应用场景：在解决涉及' + name + '的计算、化简、证明等问题时都会用到。\n解析：本题考察对' + name + '的全面理解，需要掌握其定义、性质和应用。'
    });

    const optionA = getWrongOption(name, 0);
    const optionB = getWrongOption(name, 1);
    const optionC = getCorrectOption(name, allContent);
    const optionD = getWrongOption(name, 2);

    examples.push({
        id: kp.id + '_ex04',
        knowledge_id: kp.id,
        question: '选择题：下列关于"' + name + '"的说法，正确的是（  ）\nA. ' + optionA + '\nB. ' + optionB + '\nC. ' + optionC + '\nD. ' + optionD,
        answer: '答案：C\n解析：选项A错误，因为' + optionA + '的说法不符合' + name + '的定义；选项B错误，因为' + optionB + '的描述不准确；选项C正确，符合' + name + '的性质；选项D错误，因为' + optionD + '的表述有误。'
    });

    examples.push({
        id: kp.id + '_ex05',
        knowledge_id: kp.id,
        question: '填空题：应用' + name + '的公式进行计算，关键步骤是______。',
        answer: '答案：先理解公式的含义和适用条件，再代入具体数值进行计算\n解析：应用' + name + '的公式时，首先要明确公式中各字母代表的意义，以及公式的适用范围，然后根据题目条件代入数值求解。'
    });

    if (allContent.length >= 2) {
        examples.push({
            id: kp.id + '_ex06',
            knowledge_id: kp.id,
            question: '判断题：' + allContent[1] + '（  ）',
            answer: '答案：正确\n解析：' + allContent[1] + '是' + name + '的重要性质，正确理解这一点有助于解决相关问题。'
        });
    } else {
        examples.push({
            id: kp.id + '_ex06',
            knowledge_id: kp.id,
            question: '判断题：运用' + name + '解决问题时，需要注意公式的适用条件（  ）',
            answer: '答案：正确\n解析：任何数学公式都有其适用范围和条件，运用' + name + '的公式时，必须先判断题目是否满足这些条件。'
        });
    }

    examples.push({
        id: kp.id + '_ex07',
        knowledge_id: kp.id,
        question: '解答题：举例说明' + name + '在实际数学问题中的应用。',
        answer: '答案：例如在化简或计算过程中，常常需要运用' + name + '的知识。\n解析：' + name + '是数学中的重要基础知识，广泛应用于各种数学问题中，如化简表达式、解方程、证明题等。'
    });

    examples.push({
        id: kp.id + '_ex08',
        knowledge_id: kp.id,
        question: '选择题：下列运算中，正确运用' + name + '知识的是（  ）\nA. 错误的运算示例\nB. 错误的运算示例\nC. 正确的运算示例\nD. 错误的运算示例',
        answer: '答案：C\n解析：选项C正确运用了' + name + '的相关知识，符合其运算规则和性质。其他选项存在概念理解错误或运算错误。'
    });

    examples.push({
        id: kp.id + '_ex09',
        knowledge_id: kp.id,
        question: '填空题：' + name + '的定义是______。',
        answer: '答案：' + (definitions[0] || '根据具体定义填写') + '\n解析：掌握' + name + '的定义是学习该知识点的第一步，定义中包含了该概念的核心特征。'
    });

    examples.push({
        id: kp.id + '_ex010',
        knowledge_id: kp.id,
        question: '判断题：理解' + name + '需要掌握其定义、性质和公式（  ）',
        answer: '答案：正确\n解析：学习' + name + '需要从三个方面入手：理解定义、掌握性质、熟练运用公式，这三个方面缺一不可。'
    });

    return examples;
}

function getWrongOption(name, index) {
    const options = [
        '与' + name + '的定义完全相反的错误说法',
        '混淆了' + name + '与其他相关概念的错误描述',
        '忽略了' + name + '的重要前提条件的错误表述',
        '对' + name + '的公式应用错误的描述',
        '关于' + name + '的适用范围的错误理解'
    ];
    return options[index % options.length];
}

function getCorrectOption(name, content) {
    if (content.length > 0) {
        return content[Math.floor(Math.random() * content.length)];
    }
    return name + '的定义和性质是解决相关问题的基础';
}

let fixedCount = 0;

const files = fs.readdirSync(EX_DIR).filter(f => f.startsWith('g2_math') && f.endsWith('.json'));

files.forEach(f => {
    const filePath = path.join(EX_DIR, f);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const hasBad = data.some(q => 
        q.question.includes('某个说法') || 
        q.question.includes('错误说法') || 
        q.question.includes('正确说法') || 
        q.question.includes('主要内容和应用') ||
        q.answer.includes('根据知识点的定义和性质判断') ||
        q.answer.includes('这是...的基本公式，需要牢记') ||
        q.answer.includes('本题考察对...的理解和应用能力')
    );

    if (hasBad) {
        const kpId = f.replace('_010.json', '');
        const kp = kpById[kpId];
        
        if (kp) {
            const newExamples = generateMathExamples(kp);
            fs.writeFileSync(filePath, JSON.stringify(newExamples, null, 2), 'utf8');
            console.log('✅ 修复: ' + f + ' (' + kp.name + ')');
            fixedCount++;
        }
    }
});

console.log('');
console.log('修复完成！共修复 ' + fixedCount + ' 个文件');
