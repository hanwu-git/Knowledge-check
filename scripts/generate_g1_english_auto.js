const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');
const GRADE = 'g1';
const SUBJECT = 'english';

function extractExamples(exp) {
    const matches = exp.match(/[-]\s+([^.\n]+)[.\s]+([^-\n]+)/g) || [];
    const examples = [];
    matches.forEach(m => {
        const parts = m.replace(/^[-]\s+/, '').split('.');
        if (parts.length >= 2) {
            const en = parts[0].trim();
            const zh = parts.slice(1).join('.').trim();
            if (en.length > 2 && zh.length > 1) {
                examples.push({ en, zh });
            }
        }
    });
    return examples;
}

function extractWordList(exp) {
    const words = [];
    const lines = exp.split('\n').filter(l => /^\d+\./.test(l.trim()));
    lines.forEach(l => {
        const match = l.match(/^\d+\.\s+([a-zA-Z]+)\s+([^0-9]+)$/);
        if (match) {
            words.push({ en: match[1].trim(), zh: match[2].trim() });
        }
    });
    return words;
}

function generateQuestions(kp) {
    const questions = [];
    const name = kp.name;
    const exp = kp.explanation || '';
    const formula = kp.formula || '';

    const examples = extractExamples(exp);
    const words = extractWordList(exp);

    function add(q, a) {
        questions.push({ q, a });
    }

    // 1. 翻译选择题（英译汉）
    if (examples.length > 0) {
        const ex = examples[0];
        add(`选择题："${ex.en}" 的中文意思是（  ）\nA. ${ex.zh}\nB. 完全不相关的意思\nC. 错误的翻译\nD. 另一个不相关的意思`,
            `答案：A\n解析："${ex.en}" 的意思是"${ex.zh}"。`);
    }

    // 2. 翻译选择题（汉译英）
    if (examples.length > 1) {
        const ex = examples[1];
        add(`选择题："${ex.zh}" 的英文表达是（  ）\nA. 错误的句子\nB. ${ex.en}\nC. 语法错误的句子\nD. 不相关的句子`,
            `答案：B\n解析："${ex.zh}" 的正确英文是 "${ex.en}"。`);
    }

    // 3. 词汇题
    if (words.length >= 3) {
        const w = words[0];
        add(`填空题：英语单词 "${w.en}" 的中文意思是______。`,
            `答案：${w.zh}\n解析：${w.en} 是一个常用单词，意思是"${w.zh}"。`);
    }

    // 4. 词汇选择题
    if (words.length >= 4) {
        const w = words[1];
        const wrong = words.filter(x => x.en !== w.en).slice(0, 3);
        add(`选择题：下列单词中，表示"${w.zh}"的是（  ）\nA. ${wrong[0] ? wrong[0].en : 'apple'}\nB. ${w.en}\nC. ${wrong[1] ? wrong[1].en : 'book'}\nD. ${wrong[2] ? wrong[2].en : 'desk'}`,
            `答案：B\n解析：${w.en} 的意思是"${w.zh}"。`);
    }

    // 5. 语法填空题
    if (formula) {
        add(`填空题：${name}的规则可以概括为：______。`,
            `答案：${formula}\n解析：这是${name}的核心规则。`);
    }

    // 6. 判断题
    if (examples.length > 2) {
        const ex = examples[2];
        add(`判断题："${ex.en}" 这句话的语法是正确的。（  ）`,
            `答案：正确\n解析：这是一个正确的英语句子，意思是"${ex.zh}"。`);
    }

    // 7. 改错题
    if (examples.length > 0) {
        const ex = examples[0];
        add(`改错题："${ex.en.replace(/is/, 'are').replace(/am/, 'is').replace(/are/, 'is')}" 这句话有一处错误，请找出并改正。`,
            `答案：正确的句子是 "${ex.en}"。\n解析：要注意${name}的正确用法。`);
    }

    // 8. 句型转换题
    if (examples.length > 1) {
        const ex = examples[1];
        add(`句型转换：将句子 "${ex.en}" 改为一般疑问句。`,
            `答案：（根据具体句型转换）\n解析：一般疑问句要把be动词/助动词提前。`);
    }

    // 9. 匹配题
    if (words.length >= 5) {
        add(`匹配题：请将下列单词与对应的中文意思连线。\n1. ${words[0].en}    A. ${words[2].zh}\n2. ${words[1].en}    B. ${words[0].zh}\n3. ${words[2].en}    C. ${words[3].zh}\n4. ${words[3].en}    D. ${words[1].zh}`,
            `答案：1-B, 2-D, 3-A, 4-C\n解析：要准确掌握单词的意思。`);
    }

    // 10. 造句题
    if (words.length > 0 && examples.length > 0) {
        add(`写作题：用 "${words[0].en}" 这个单词写一个英语句子。`,
            `答案（示例）：${examples[0].en}\n解析：造句要注意语法正确，意思通顺。`);
    }

    // 补充到10道
    let n = 1;
    while (questions.length < 10) {
        if (examples.length > 0 && n < examples.length) {
            const ex = examples[n % examples.length];
            add(`填空题："${ex.zh}" 的英文是：______。`,
                `答案：${ex.en}\n解析：要熟记常用句型。`);
        } else if (words.length > 0) {
            const w = words[n % words.length];
            add(`选择题：单词 "${w.en}" 的正确拼写是？\nA. ${w.en}\nB. ${w.en.replace(/a/, 'e')}\nC. ${w.en + 'e'}\nD. ${w.en.slice(0, -1)}`,
                `答案：A\n解析：注意单词的正确拼写。`);
        } else {
            add(`判断题：学习英语要多听、多说、多读、多写。（  ）`,
                `答案：正确\n解析：这是学好英语的基本方法。`);
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
