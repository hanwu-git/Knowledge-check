const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');
const GRADE = 'g1';
const SUBJECT = 'history';

function generateQuestions(kp) {
    const questions = [];
    const name = kp.name.replace(/《/g, '').replace(/》/g, '');
    const exp = kp.explanation || '';
    const formula = kp.formula || '';

    // 从explanation中提取关键信息
    const lines = exp.split('\n').filter(l => l.trim());
    const keyPoints = lines.filter(l => l.includes('【') || /^\d+\./.test(l.trim()) || l.includes('：'));

    // 提取作者信息
    const authorMatch = exp.match(/【作者】([^，,。\n]+)/);
    const author = authorMatch ? authorMatch[1] : '';

    // 提取朝代/国籍
    const dynastyMatch = exp.match(/(唐代|宋代|元代|明代|清代|现代|当代|春秋|战国|西汉|东汉|三国|美国|法国|英国)/);
    const dynasty = dynastyMatch ? dynastyMatch[1] : '';

    // 提取主要内容
    const contentMatch = exp.match(/【主要内容】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    const mainContent = contentMatch ? contentMatch[1].trim().split('\n')[0] : '';

    // 提取写作手法
    const techniqueMatch = exp.match(/【写作手法】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    const techniques = techniqueMatch ? techniqueMatch[1].trim() : '';
    const techniqueList = techniques.split(/[，,、。；;\n]+/).filter(t => t.trim().length > 1 && t.length < 10).slice(0, 4);

    // 提取作品简介
    const workMatch = exp.match(/【作品简介】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    const workIntro = workMatch ? workMatch[1].trim().split('\n')[0] : '';

    function add(q, a) {
        questions.push({ q, a });
    }

    // 1. 作者题（选择题）
    if (author) {
        const wrongAuthors = ['鲁迅', '朱自清', '老舍', '冰心', '李白', '杜甫', '王维', '白居易', '蒲松龄', '诸葛亮', '曹操', '刘义庆'];
        const wrong = wrongAuthors.filter(a => a !== author).slice(0, 3);
        add(`选择题：《${name}》的作者是（  ）\nA. ${wrong[0] || '朱自清'}\nB. ${author}\nC. ${wrong[1] || '老舍'}\nD. ${wrong[2] || '鲁迅'}`,
            `答案：B\n解析：《${name}》的作者是${author}${dynasty ? '，' + dynasty + '人' : ''}。`);
    }

    // 2. 朝代/国籍题
    if (author && dynasty) {
        add(`填空题：${author}是______（朝代/国籍）人。`,
            `答案：${dynasty}\n解析：${author}是${dynasty}著名的文学家。`);
    }

    // 3. 作品出处题
    const sourceMatch = exp.match(/选自[《]([^》]+)[》]/);
    if (sourceMatch) {
        add(`判断题：《${name}》选自《${sourceMatch[1]}》。（  ）`,
            `答案：正确\n解析：《${name}》选自《${sourceMatch[1]}》。`);
    }

    // 4. 主要内容题
    if (mainContent) {
        add(`简答题：请简要概括《${name}》的主要内容。`,
            `答案：${mainContent}\n解析：这是文章的核心内容，需要重点掌握。`);
    }

    // 5. 写作手法题
    if (techniqueList.length >= 2) {
        const t = techniqueList[0];
        add(`选择题：下列不属于《${name}》写作特色的是（  ）\nA. ${techniqueList[0]}\nB. ${techniqueList[1] || '情景交融'}\nC. 平铺直叙，毫无修辞\nD. ${techniqueList[2] || '语言生动'}`,
            `答案：C\n解析：《${name}》运用了${techniqueList.slice(0, 3).join('、')}等多种写作手法，而不是平铺直叙。`);
    }

    // 6. 主旨题
    const themeMatch = exp.match(/(表达了|抒发了|赞美了|批判了|揭示了)[^。\n]+/);
    if (themeMatch) {
        const theme = themeMatch[0];
        add(`填空题：《${name}》${theme}的思想感情。`,
            `答案：${theme}\n解析：这是文章的中心思想。`);
    }

    // 7. 修辞题
    const rhetoricMatch = exp.match(/(比喻|拟人|排比|夸张|反问|设问|对偶|反复)/g);
    if (rhetoricMatch && rhetoricMatch.length > 0) {
        const unique = [...new Set(rhetoricMatch)];
        add(`判断题：《${name}》运用了${unique.slice(0, 3).join('、')}等修辞手法。（  ）`,
            `答案：正确\n解析：文章运用了多种修辞手法，使语言更加生动形象。`);
    }

    // 8. 结构题
    const structureMatch = exp.match(/【文章结构】\s*([^\n]+(?:\n(?!【)[^\n]+)*)/);
    if (structureMatch) {
        const parts = structureMatch[1].trim().split('\n').filter(l => /^\d+\./.test(l.trim())).slice(0, 4);
        if (parts.length >= 3) {
            const partNames = parts.map(p => p.replace(/^\d+\.\s*([^（(]+)[（(].*/, '$1').replace(/：.*$/, '').trim());
            add(`填空题：《${name}》的结构可分为${partNames.length}部分：______、______、______${partNames.length > 3 ? '、______' : ''}。`,
                `答案：${partNames.join('；')}\n解析：这是文章的结构层次。`);
        }
    }

    // 9. 名句默写/理解题
    const famousLineMatch = exp.match(/[""]([^""]{5,30})[""]/g);
    if (famousLineMatch && famousLineMatch.length > 0) {
        const line = famousLineMatch[0].replace(/["""]/g, '');
        add(`理解题："${line}"这句话是什么意思？有什么含义？`,
            `答案：这句话出自${author ? author + '的' : ''}《${name}》，意思是：……（结合上下文理解）\n解析：这句话是文章中的名句，需要重点理解和掌握。`);
    }

    // 10. 综合鉴赏题
    add(`简答题：读了《${name}》，你有什么感悟或收获？`,
        `答案：本文通过${mainContent || '生动的描写'}，让我们感受到了${formula || '作者的思想感情'}。在学习中，我们可以学习作者的${techniqueList[0] || '写作手法'}，提高自己的语文素养。\n解析：这是一道开放性题目，可以从内容、写法、情感等多个角度回答。`);

    // 如果不足10道，补充一些通用题目
    while (questions.length < 10) {
        const n = questions.length + 1;
        if (formula) {
            add(`填空题：《${name}》的核心要点可以概括为：______。`,
                `答案：${formula}\n解析：这是本知识点的核心公式/要点。`);
        } else {
            add(`判断题：学习《${name}》对于提高我们的语文素养有重要意义。（  ）`,
                `答案：正确\n解析：每篇课文都有其学习价值，我们要认真学习。`);
        }
    }

    // 只取前10道
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

// 生成所有题目
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

// 保存
const outputFile = path.join(OUTPUT_DIR, `${GRADE}_${SUBJECT}_quality.json`);
fs.writeFileSync(outputFile, JSON.stringify(allExamples, null, 2), 'utf8');

console.log(`✅ 生成完成！共 ${totalQuestions} 道题目`);
console.log(`输出文件: ${outputFile}`);
