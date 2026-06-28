const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

// 1. 修复初二语文古诗文背诵下册的空模板题
const reciteFiles = fs.readdirSync(EXAMPLE_DIR).filter(f => f.match(/^g2_chinese_recite_l\d+_/));
let removed1 = 0;
reciteFiles.forEach(f => {
    const data = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
    const before = data.length;
    const after = data.filter(ex => !ex.answer.includes('翻译题答案和解析'));
    if (after.length < before) {
        fs.writeFileSync(path.join(EXAMPLE_DIR, f), JSON.stringify(after, null, 2));
        removed1 += before - after.length;
    }
});
console.log('修复1: 删除初二语文古诗文背诵下册 ' + removed1 + ' 道空模板题');

// 2. 重新生成生物题目
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');

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

    const featureMatch = exp.match(/主要特征[：:]([^。]+(?:。[^。]*)*)/);
    const featuresText = featureMatch ? featureMatch[1] : exp;
    const featurePoints = featuresText.split(/[；;。\n]/).filter(s => s.trim().length > 5).slice(0, 5);

    function add(q, a) {
        questions.push({ q: String(q), a: String(a) });
    }

    if (featurePoints.length >= 3) {
        const correct = featurePoints[0].trim();
        add('选择题: 下列关于' + name + '的说法, 正确的是(  ) A. ' + correct + ' B. 其他正确说法 C. 完全错误的说法 D. 与事实相反的说法',
            '答案: A\n解析: ' + correct + '。这是' + name + '的重要特征。');
    }

    if (keyTerms.length >= 2) {
        const animals = keyTerms.filter(t => exp.includes(t) && t.length < 6).slice(0, 3);
        if (animals.length >= 2) {
            add('填空题: ' + shortName + '的代表动物有______、______等。',
                '答案: ' + animals[0] + ';' + animals[1] + '\n解析: ' + animals[0] + '、' + animals[1] + '都是' + shortName + '的典型代表。');
        }
    }

    if (sentences.length > 0) {
        add('判断题: ' + sentences[0].trim().substring(0, 50) + '。(  )',
            '答案: 正确\n解析: 这是' + name + '的正确描述。');
    }

    // 判断是否是动物类别知识点
    var animalKeywords = ['动物', '动物类', '类群', '代表动物', '物种', '生物'];
    var isAnimalTopic = animalKeywords.some(function(k) { return name.includes(k); });
    
    // 代表动物选择题 - 只有动物类别知识点才用动物分类
    if (isAnimalTopic && name.length < 15) {
        var animalCategories = {
            '原生动物': ['草履虫', '变形虫', '疟原虫'],
            '腔肠动物': ['水螅', '海葵', '珊瑚虫'],
            '扁形动物': ['涡虫', '血吸虫', '华枝睾吸虫'],
            '线形动物': ['蛔虫', '蛲虫', '线虫'],
            '环节动物': ['蚯蚓', '水蛭', '沙蚕'],
            '软体动物': ['蜗牛', '河蚌', '乌贼'],
            '节肢动物': ['蝗虫', '蜜蜂', '蝴蝶'],
            '鱼类': ['鱼'],
            '两栖动物': ['青蛙', '蟾蜍'],
            '爬行动物': ['蛇', '龟', '蜥蜴'],
            '鸟类': ['鸟'],
            '哺乳动物': ['兔', '猫', '狗']
        };
        var allAnimals = ['草履虫', '变形虫', '疟原虫', '水螅', '海葵', '珊瑚虫', '涡虫', '血吸虫', '华枝睾吸虫', '蛔虫', '蛲虫', '线虫', '蚯蚓', '水蛭', '沙蚕', '蜗牛', '河蚌', '乌贼', '蝗虫', '蜜蜂', '蝴蝶', '鱼', '青蛙', '蟾蜍', '蛇', '龟', '蜥蜴', '鸟', '兔', '猫', '狗'];
        
        var matchedCategory = null;
        for (var cat in animalCategories) {
            if (name.includes(cat) || name.includes(cat.replace('动物', ''))) {
                matchedCategory = cat;
                break;
            }
        }
        
        var correctOptions = matchedCategory ? animalCategories[matchedCategory] : ['蝗虫', '蚯蚓', '草履虫'];
        var cIdx2 = Math.floor(Math.random() * correctOptions.length);
        var correctAnimal2 = correctOptions[cIdx2];
        var tempWrong2 = allAnimals.filter(function(a) { return correctOptions.indexOf(a) === -1; });
        var wrongOptions = [];
        for (var i2 = 0; i2 < 3 && tempWrong2.length > 0; i2++) {
            var wIdx2 = Math.floor(Math.random() * tempWrong2.length);
            wrongOptions.push(tempWrong2.splice(wIdx2, 1)[0]);
        }
        while (wrongOptions.length < 3) wrongOptions.push('生物');
        add('选择题: 下列动物中, 属于' + shortName + '的是(  ) A. ' + wrongOptions[0] + ' B. ' + wrongOptions[1] + ' C. ' + correctAnimal2 + ' D. ' + wrongOptions[2],
            '答案: C\n解析: ' + correctAnimal2 + '属于' + shortName + '。');
    } else {
        // 非动物类知识点，使用通用题
        add('选择题: 下列关于' + shortName + '的说法, 正确的是(  ) A. 与其他知识完全相同 B. ' + (sentences[0] ? sentences[0].trim().substring(0, 20) : '正确的描述') + '... C. 完全错误 D. 无关说法',
            '答案: B\n解析: ' + (sentences[0] ? sentences[0].trim().substring(0, 40) : '这是关于' + shortName + '的正确描述') + '。');
    }

    if (formula) {
        add('填空题: ' + name + '的核心要点可以概括为: ______。',
            '答案: ' + formula + '\n解析: 这是' + name + '的核心内容概括。');
    }

    if (featurePoints.length >= 2) {
        var summary = featurePoints.slice(0, 3).join(';');
        add('简答题: 请简述' + name + '的主要特征。',
            '答案: ' + summary + '。\n解析: 这些是' + shortName + '最主要的特征。');
    }

    add('判断题: ' + name + '的某些特征与人类生活无关。(  )',
        '答案: 错误\n解析: ' + name + '与人类生活密切相关, 对生态平衡有重要作用。');

    if (sentences.length >= 2) {
        var s = sentences[1].trim();
        add('选择题: 关于' + shortName + '的结构特点, 下列说法正确的是(  ) A. 与其他生物完全相同 B. ' + s.substring(0, 40) + '... C. 完全不存在于自然界 D. 对生物没有影响',
            '答案: B\n解析: ' + s + '。');
    }

    if (keyTerms.length >= 4) {
        add('填空题: ' + name + '在自然界中的作用是______。',
            '答案: 维持生态平衡、参与物质循环\n解析: ' + name + '对生态系统的稳定有重要作用。');
    }

    // 分析题 - 根据知识点内容生成具体答案
    if (featurePoints.length >= 2) {
        add('分析题: ' + name + '在生产生活中有哪些应用?',
            '答案: ' + name + '在生产生活中有广泛应用: ' + featurePoints.slice(0, 2).join(';') + '。\n解析: 学习生物学知识要联系实际, 了解其在生活中的应用。');
    } else if (sentences.length >= 2) {
        add('分析题: ' + name + '有什么重要意义?',
            '答案: ' + name + '具有重要意义: ' + sentences.slice(0, 2).map(function(s) { return s.trim().substring(0, 30); }).join(';') + '。\n解析: 理解' + name + '的意义有助于更好地学习相关知识。');
    } else {
        add('分析题: 学习' + name + '对我们有什么启示?',
            '答案: 学习' + name + '让我们认识到: 生物世界丰富多彩, 我们要尊重生命、保护自然。\n解析: 生物学知识来源于自然, 也要服务于自然保护。');
    }

    var n = 0;
    while (questions.length < 10) {
        if (sentences[n % sentences.length]) {
            var s2 = sentences[n % sentences.length].trim();
            add('填空题: ' + s2.substring(0, 20) + '..., 这体现了' + shortName + '的______特点。',
                '答案: 重要特点\n解析: 这是' + shortName + '的重要特征。');
        } else {
            add('判断题: ' + name + '是生物圈的重要组成部分。(  )',
                '答案: 正确\n解析: ' + name + '在生态系统中发挥着重要作用。');
        }
        n++;
        if (n > 20) break;
    }

    return questions.slice(0, 10);
}

var upperFile = path.join(KNOWLEDGE_DIR, 'g2_biology_upper.json');
var lowerFile = path.join(KNOWLEDGE_DIR, 'g2_biology_lower.json');
var allKps = [];
if (fs.existsSync(upperFile)) allKps = allKps.concat(JSON.parse(fs.readFileSync(upperFile, 'utf8')));
if (fs.existsSync(lowerFile)) allKps = allKps.concat(JSON.parse(fs.readFileSync(lowerFile, 'utf8')));

var allExamples = [];
allKps.forEach(function(kp) {
    var qs = generateQuestions(kp);
    qs.forEach(function(q, i) {
        allExamples.push({
            id: kp.id + '_ex' + String(i + 1).padStart(2, '0'),
            knowledge_id: kp.id,
            question: q.q,
            answer: q.a
        });
    });
});

fs.writeFileSync(path.join(EXAMPLE_DIR, 'g2_biology_quality.json'), JSON.stringify(allExamples, null, 2), 'utf8');
console.log('修复2: 重新生成生物 ' + allExamples.length + ' 道题目');
