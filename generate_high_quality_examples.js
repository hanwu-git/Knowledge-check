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

function parseExplanation(explanation) {
    if (!explanation) return {};
    
    const sections = {};
    const lines = explanation.split('\n').filter(l => l.trim());
    
    let currentSection = 'default';
    
    lines.forEach(line => {
        const trimmed = line.trim();
        
        if (trimmed.match(/【(.+?)】/)) {
            const match = trimmed.match(/【(.+?)】/);
            currentSection = match[1];
            sections[currentSection] = [];
        } else if (trimmed.length > 0) {
            if (!sections[currentSection]) sections[currentSection] = [];
            sections[currentSection].push(trimmed);
        }
    });
    
    return sections;
}

function generateMathExamples(k) {
    const examples = [];
    const name = k.name;
    const formula = k.formula || '';
    const sections = parseExplanation(k.explanation);
    const definitions = sections['定义'] || [];
    const notes = sections['注意'] || [];
    const applications = sections['应用场景'] || [];
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    if (definitions.length > 0) {
        const def = cleanText(definitions[0]);
        
        const wrongOptions = {
            '正数': ['小于0的数叫做正数', '0是正数', '负数也可以是正数'],
            '负数': ['大于0的数叫做负数', '0是负数', '正数也可以是负数'],
            '有理数': ['只有整数是有理数', '只有分数是有理数', '无理数也是有理数'],
            '数轴': ['只有原点和正方向', '没有单位长度', '是一条射线'],
            '相反数': ['绝对值相同的数', '符号相同的数', '倒数'],
            '绝对值': ['一个数本身', '一个数的相反数', '两个数的差'],
            '绝对值': ['一个数本身', '一个数的相反数', '两个数的差'],
            '单项式': ['只有字母组成', '含有加减运算', '只有数字'],
            '多项式': ['只有一个单项式', '不含字母', '只有数字'],
            '整式': ['含有除法运算', '含有根号', '只有分式'],
            '方程': ['不含未知数的等式', '含有未知数的不等式', '不含等号'],
            '一元一次方程': ['含有两个未知数', '未知数次数是2', '不是等式'],
            '平方根': ['一个数的立方根', '只有正数有平方根', '负数有平方根'],
            '立方根': ['一个数的平方根', '只有正数有立方根', '负数没有立方根'],
            '实数': ['只有有理数', '只有无理数', '不包括0'],
            '平移': ['旋转运动', '放大或缩小', '改变形状'],
            '垂线': ['相交但不成直角', '平行', '只有一条'],
            '同位角': ['内错角', '同旁内角', '对顶角'],
            '内错角': ['同位角', '同旁内角', '邻补角'],
            '同旁内角': ['同位角', '内错角', '对顶角'],
            '代入消元法': ['加减消元法', '代入系数', '消去常数项'],
            '加减消元法': ['代入消元法', '加减未知数', '消去系数'],
            '不等式组': ['只有一个不等式', '方程的组合', '不含未知数'],
            '三元一次方程组': ['二元一次方程组', '未知数次数是2', '只有两个方程'],
            '线段的中点': ['线段的端点', '任意一点', '延长线上的点'],
            '角': ['只有一条射线', '两条直线', '没有端点']
        };
        
        let wrongOpts = ['错误的描述', '不准确的说法', '片面的理解'];
        for (const [key, opts] of Object.entries(wrongOptions)) {
            if (name.includes(key)) {
                wrongOpts = opts;
                break;
            }
        }
        
        addQuestion(
            `选择题：下列关于${name}的说法，正确的是？ A. ${def}  B. ${wrongOpts[0]}  C. ${wrongOpts[1]}  D. ${wrongOpts[2]}`,
            `答案：A。解析：${def}。这是${name}的核心定义，需要牢记。`
        );
    }
    
    if (formula) {
        const formulaText = formula.split('\n')[0].trim();
        
        let wrongB = formulaText;
        let wrongC = formulaText;
        if (formulaText.includes('>')) {
            wrongB = formulaText.replace('>', '<');
            wrongC = formulaText.replace('>', '>=');
        } else if (formulaText.includes('<')) {
            wrongB = formulaText.replace('<', '>');
            wrongC = formulaText.replace('<', '<=');
        } else if (formulaText.includes('=')) {
            wrongB = formulaText.replace('=', '≠');
            wrongC = formulaText.replace('=', '≈');
        } else {
            wrongB = formulaText + ' (错误)';
            wrongC = '与' + formulaText + '相反';
        }
        
        addQuestion(
            `选择题：${name}的核心公式或关系是？ A. ${formulaText}  B. ${wrongB}  C. ${wrongC}  D. 无固定公式`,
            `答案：A。解析：${name}的公式是${formulaText}，这是理解和应用该知识点的基础。`
        );
        
        addQuestion(
            `填空题：${name}的公式是______。`,
            `答案：${formulaText}。解析：${name}的核心关系是${formulaText}。`
        );
    }
    
    if (notes.length > 0) {
        notes.forEach((note, idx) => {
            const cleanNote = cleanText(note.replace(/^\d+\.\s*/, ''));
            
            addQuestion(
                `判断题：${cleanNote}（  ）`,
                `答案：正确。解析：这是${name}的重要注意事项，${cleanNote}。`
            );
        });
    }
    
    if (applications.length > 0) {
        applications.forEach((app, idx) => {
            const cleanApp = cleanText(app.replace(/^-\s*/, ''));
            const parts = cleanApp.split('：');
            if (parts.length === 2) {
                const category = parts[0];
                const desc = parts[1];
                
                addQuestion(
                    `选择题：在${category}中，${desc.split('，')[0]}应用了${name}的知识。下列说法正确的是？ A. ${category}中用正负数表示相反意义的量  B. ${category}只需要用正数表示  C. ${category}中正数和负数表示相同意义  D. ${category}不需要区分正负`,
                    `答案：A。解析：${cleanApp}，这是${name}在实际生活中的应用。`
                );
            }
        });
    }
    
    if (name.includes('正数') || name.includes('负数') || name.includes('有理数')) {
        addQuestion(
            `选择题：下列各数中，属于正数的是？ A. +5  B. -3  C. 0  D. -10`,
            `答案：A。解析：大于0的数叫做正数，+5大于0，是正数；-3和-10是负数；0既不是正数也不是负数。`
        );
        
        addQuestion(
            `判断题：0是正数。（  ）`,
            `答案：错误。解析：0既不是正数，也不是负数。`
        );
        
        addQuestion(
            `填空题：如果收入200元记作+200元，那么支出150元记作______元。`,
            `答案：-150。解析：正数和负数表示相反意义的量，收入为正，则支出为负。`
        );
    }
    
    if (name.includes('绝对值')) {
        addQuestion(
            `选择题：|-5|的值是？ A. 5  B. -5  C. 0  D. 10`,
            `答案：A。解析：绝对值是指一个数在数轴上所对应点到原点的距离，|-5|表示-5到原点的距离，等于5。`
        );
        
        addQuestion(
            `填空题：|a|______0（填">""<""≥"或"≤"）。`,
            `答案：≥。解析：任何数的绝对值都是非负数，即|a|≥0。`
        );
    }
    
    if (name.includes('相反数')) {
        addQuestion(
            `选择题：-3的相反数是？ A. 3  B. -3  C. 0  D. 1/3`,
            `答案：A。解析：只有符号不同的两个数互为相反数，-3的相反数是3。`
        );
        
        addQuestion(
            `判断题：互为相反数的两个数之和为0。（  ）`,
            `答案：正确。解析：互为相反数的两个数相加等于0，如a + (-a) = 0。`
        );
    }
    
    if (name.includes('数轴')) {
        addQuestion(
            `选择题：数轴上表示-2的点在原点的？ A. 左边  B. 右边  C. 原点上  D. 无法确定`,
            `答案：A。解析：数轴上，正数在原点右边，负数在原点左边，-2是负数，所以在原点左边。`
        );
    }
    
    if (name.includes('加减法') || name.includes('运算')) {
        addQuestion(
            `计算题：(-3) + 5 = ______`,
            `答案：2。解析：异号两数相加，取绝对值较大的符号，并用较大的绝对值减去较小的绝对值，|5| > |-3|，所以结果为正，5 - 3 = 2。`
        );
        
        addQuestion(
            `计算题：(-2) - (-4) = ______`,
            `答案：2。解析：减去一个数等于加上这个数的相反数，(-2) - (-4) = (-2) + 4 = 2。`
        );
    }
    
    if (name.includes('乘除法') || name.includes('运算')) {
        addQuestion(
            `计算题：(-3) × (-4) = ______`,
            `答案：12。解析：两数相乘，同号得正，异号得负，并把绝对值相乘，(-3) × (-4) = 3 × 4 = 12。`
        );
        
        addQuestion(
            `计算题：12 ÷ (-3) = ______`,
            `答案：-4。解析：两数相除，同号得正，异号得负，并把绝对值相除，12 ÷ (-3) = -(12 ÷ 3) = -4。`
        );
    }
    
    if (name.includes('乘方') || name.includes('幂')) {
        addQuestion(
            `计算题：(-2)³ = ______`,
            `答案：-8。解析：(-2)³ = (-2) × (-2) × (-2) = 4 × (-2) = -8。负数的奇次幂是负数。`
        );
        
        addQuestion(
            `判断题：任何数的0次幂都等于1。（  ）`,
            `答案：错误。解析：除0以外的任何数的0次幂都等于1，0的0次幂没有意义。`
        );
    }
    
    if (name.includes('混合运算') || name.includes('运算顺序')) {
        addQuestion(
            `计算题：2 + 3 × 4 = ______`,
            `答案：14。解析：根据运算顺序，先乘除后加减，3 × 4 = 12，然后2 + 12 = 14。`
        );
    }
    
    if (name.includes('近似数') || name.includes('有效数字')) {
        addQuestion(
            `选择题：0.0230有几个有效数字？ A. 3个  B. 4个  C. 2个  D. 5个`,
            `答案：A。解析：从第一个非零数字开始算起，0.0230的有效数字是2、3、0，共3个。`
        );
    }
    
    while (examples.length < 10) {
        const allPoints = [...(definitions || []), ...(notes || []), ...(applications || [])];
        if (allPoints.length > 0) {
            const randomPoint = allPoints[Math.floor(Math.random() * allPoints.length)];
            const cleanPoint = cleanText(randomPoint.replace(/^\d+\.\s*/, '').replace(/^-\s*/, ''));
            
            addQuestion(
                `判断题：${cleanPoint.substring(0, 50)}...（  ）`,
                `答案：正确。解析：${name}的知识点包括：${cleanPoint.substring(0, 80)}...`
            );
        } else {
            addQuestion(
                `简答题：请简述${name}的主要内容。`,
                `答案：${name}是重要的数学知识点，${formula ? '其公式是' + formula + '。' : ''}${(k.explanation || '').substring(0, 100)}...`
            );
        }
    }
    
    return examples.slice(0, 10);
}

function generateEnglishExamples(k) {
    const examples = [];
    const name = k.name;
    const sections = parseExplanation(k.explanation);
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    if (name.includes('词汇') || name.includes('单词')) {
        const wordMatch = name.match(/(.+?)的用法/);
        const word = wordMatch ? wordMatch[1] : name;
        
        addQuestion(
            `选择题：${word}的正确含义是？ A. ${word}的基本含义  B. 错误的翻译  C. 无关的词义  D. 相反的意思`,
            `答案：A。解析：${word}是本单元的重点词汇，需要掌握其含义和用法。`
        );
        
        addQuestion(
            `填空题：${word}的词性是______（名词/动词/形容词等）。`,
            `答案：根据上下文判断。解析：学习词汇时要注意词性，这有助于正确使用。`
        );
        
        addQuestion(
            `翻译题：请将"${word}"翻译成中文。`,
            `答案：根据上下文给出正确翻译。解析：掌握词汇的中英文对应关系是英语学习的基础。`
        );
        
        addQuestion(
            `选择题：下列哪个选项是${word}的同义词？ A. 合适的同义词  B. 反义词  C. 无关词  D. 拼写错误的词`,
            `答案：A。解析：学习同义词有助于扩大词汇量和丰富表达。`
        );
    }
    
    if (name.includes('语法') || name.includes('时态') || name.includes('句型')) {
        addQuestion(
            `选择题：下列句子中，${name}使用正确的是？ A. 正确的例句  B. 错误的用法  C. 无关的句子  D. 结构错误的句子`,
            `答案：A。解析：${name}是英语语法的重要内容，需要掌握其正确用法。`
        );
        
        addQuestion(
            `填空题：根据${name}，"He ______ (go) to school yesterday."应填______。`,
            `答案：went。解析：根据一般过去时的规则，yesterday表示过去时间，动词go要用过去式went。`
        );
        
        addQuestion(
            `改错题：找出句子中的错误并改正："He don't like apples."`,
            `答案：He doesn't like apples。解析：主语是第三人称单数，否定句要用doesn't。`
        );
    }
    
    if (name.includes('短语') || name.includes('词组')) {
        addQuestion(
            `选择题："${name}"的正确含义是？ A. 正确的释义  B. 错误的理解  C. 字面翻译  D. 无关的意思`,
            `答案：A。解析：${name}是常用短语，需要掌握其固定搭配和含义。`
        );
        
        addQuestion(
            `填空题：用"${name}"造句：______。`,
            `答案：根据短语含义造一个正确的句子。解析：通过造句可以加深对短语用法的理解。`
        );
    }
    
    while (examples.length < 10) {
        const types = ['选择题', '填空题', '翻译题', '改错题'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        addQuestion(
            `${type}：关于${name}，请根据所学知识回答。`,
            `答案：根据${name}的知识点回答。解析：${name}是本单元的重点内容。`
        );
    }
    
    return examples.slice(0, 10);
}

function generateChineseExamples(k) {
    const examples = [];
    const name = k.name;
    const sections = parseExplanation(k.explanation);
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    if (name.includes('词语') || name.includes('字词')) {
        addQuestion(
            `选择题："${name.replace('词语', '').replace('字词', '')}"的正确解释是？ A. 正确的词义  B. 错误的解释  C. 同音不同义的词  D. 无关的词`,
            `答案：A。解析：掌握词语的含义是语文学习的基础。`
        );
        
        addQuestion(
            `填空题："${name.replace('词语', '').replace('字词', '')}"的拼音是______。`,
            `答案：根据正确拼音填写。解析：正确掌握拼音有助于准确朗读和理解。`
        );
        
        addQuestion(
            `造句题：用"${name.replace('词语', '').replace('字词', '')}"造一个句子：______。`,
            `答案：根据词语含义造一个通顺的句子。解析：通过造句可以加深对词语用法的理解。`
        );
    }
    
    if (name.includes('文言文') || name.includes('古诗')) {
        addQuestion(
            `选择题：下列对${name}的理解，正确的是？ A. 正确的理解  B. 错误的解读  C. 断章取义  D. 无关的理解`,
            `答案：A。解析：学习文言文和古诗需要结合上下文理解其含义。`
        );
        
        addQuestion(
            `翻译题：请翻译"${name}"中的重点句子。`,
            `答案：根据原文给出准确的现代汉语翻译。解析：翻译文言文要注意古今异义和词类活用。`
        );
        
        addQuestion(
            `填空题：${name}的作者是______。`,
            `答案：根据课文内容填写。解析：了解作者背景有助于更好地理解作品。`
        );
    }
    
    if (name.includes('修辞手法') || name.includes('写作手法')) {
        addQuestion(
            `选择题："春风像母亲的手抚摸着你"这句话运用了什么修辞手法？ A. 比喻  B. 拟人  C. 夸张  D. 排比`,
            `答案：A。解析：这句话把春风比作母亲的手，是比喻的修辞手法。`
        );
        
        addQuestion(
            `简答题：请举例说明${name}的作用。`,
            `答案：${name}可以使语言更加生动形象，增强表达效果。例如：...`
        );
    }
    
    while (examples.length < 10) {
        addQuestion(
            `简答题：请简述${name}的主要内容。`,
            `答案：${name}是语文学习的重要内容，需要理解和掌握其核心要点。`
        );
    }
    
    return examples.slice(0, 10);
}

function generateHistoryExamples(k) {
    const examples = [];
    const name = k.name;
    const sections = parseExplanation(k.explanation);
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    addQuestion(
        `选择题：${name}发生在哪个时期？ A. 正确的历史时期  B. 错误的时期  C. 更早的时期  D. 更晚的时期`,
        `答案：A。解析：${name}是历史上的重要事件/人物，了解其所处时代背景很重要。`
    );
    
    addQuestion(
        `选择题：${name}的主要人物是？ A. 正确的人物  B. 错误的人物  C. 同时期其他人物  D. 不同时期的人物`,
        `答案：A。解析：掌握历史事件的主要人物是学习历史的基础。`
    );
    
    addQuestion(
        `填空题：${name}发生于公元______年。`,
        `答案：根据历史事实填写。解析：记住重要历史事件的时间有助于建立时间线。`
    );
    
    addQuestion(
        `简答题：请简述${name}的历史意义。`,
        `答案：${name}对当时和后世都产生了重要影响，其历史意义包括：...`
    );
    
    if (name.includes('战争') || name.includes('战役')) {
        addQuestion(
            `选择题：${name}的结果是？ A. 正确的结果  B. 错误的结果  C. 相持不下  D. 未分胜负`,
            `答案：A。解析：了解战争的结果有助于理解其历史影响。`
        );
    }
    
    if (name.includes('条约') || name.includes('协定')) {
        addQuestion(
            `选择题：${name}的签订对中国产生了什么影响？ A. 正确的影响  B. 积极影响  C. 没有影响  D. 无关的影响`,
            `答案：A。解析：不平等条约通常使中国丧失主权，加深了半殖民地化程度。`
        );
    }
    
    while (examples.length < 10) {
        addQuestion(
            `判断题：${name}是中国历史上的重要事件。（  ）`,
            `答案：正确。解析：${name}在历史发展中具有重要地位。`
        );
    }
    
    return examples.slice(0, 10);
}

function generateGeographyExamples(k) {
    const examples = [];
    const name = k.name;
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    addQuestion(
        `选择题：${name}位于哪个大洲/国家？ A. 正确的位置  B. 错误的位置  C. 相邻的地区  D. 遥远的地区`,
        `答案：A。解析：了解地理事物的位置是学习地理的基础。`
    );
    
    addQuestion(
        `填空题：${name}的气候类型是______。`,
        `答案：根据地理知识填写。解析：气候是地理环境的重要组成部分。`
    );
    
    if (name.includes('山脉') || name.includes('河流') || name.includes('高原') || name.includes('平原')) {
        addQuestion(
            `选择题：${name}的主要特征是？ A. 正确的特征  B. 错误的特征  C. 其他地形的特征  D. 无关的特征`,
            `答案：A。解析：掌握地形地貌的特征有助于理解地理环境。`
        );
        
        addQuestion(
            `简答题：请简述${name}的地理意义。`,
            `答案：${name}对当地气候、交通、农业等方面都有重要影响。`
        );
    }
    
    if (name.includes('气候')) {
        addQuestion(
            `选择题：${name}的特点是？ A. 正确的特点  B. 错误的特点  C. 相反气候的特点  D. 无关的特点`,
            `答案：A。解析：不同气候类型有不同的气温和降水特点。`
        );
        
        addQuestion(
            `填空题：${name}分布在______地区。`,
            `答案：根据气候分布规律填写。解析：气候分布有一定的规律性。`
        );
    }
    
    while (examples.length < 10) {
        addQuestion(
            `判断题：${name}是重要的地理概念。（  ）`,
            `答案：正确。解析：${name}是地理学习中的重要知识点。`
        );
    }
    
    return examples.slice(0, 10);
}

function generateBiologyExamples(k) {
    const examples = [];
    const name = k.name;
    const sections = parseExplanation(k.explanation);
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    addQuestion(
        `选择题：${name}的主要功能是？ A. 正确的功能  B. 错误的功能  C. 其他器官的功能  D. 无关的功能`,
        `答案：A。解析：了解生物结构的功能是生物学学习的基础。`
    );
    
    addQuestion(
        `填空题：${name}由______组成。`,
        `答案：根据生物学知识填写。解析：掌握生物结构的组成有助于理解其功能。`
    );
    
    if (name.includes('细胞')) {
        addQuestion(
            `选择题：${name}的结构特点是？ A. 正确的特点  B. 错误的特点  C. 植物细胞的特点  D. 病毒的特点`,
            `答案：A。解析：不同类型的细胞有不同的结构特点。`
        );
    }
    
    if (name.includes('光合作用') || name.includes('呼吸作用')) {
        addQuestion(
            `选择题：${name}的原料是？ A. 正确的原料  B. 产物  C. 无关的物质  D. 错误的物质`,
            `答案：A。解析：光合作用的原料是二氧化碳和水，呼吸作用的原料是有机物和氧气。`
        );
        
        addQuestion(
            `填空题：${name}的公式是______。`,
            `答案：根据所学公式填写。解析：掌握公式有助于理解生理过程。`
        );
    }
    
    if (name.includes('生态系统') || name.includes('食物链')) {
        addQuestion(
            `选择题：在${name}中，能量流动的特点是？ A. 单向流动，逐级递减  B. 循环流动  C. 双向流动  D. 不变`,
            `答案：A。解析：生态系统中能量流动是单向的，且每经过一个营养级都会减少。`
        );
    }
    
    while (examples.length < 10) {
        addQuestion(
            `判断题：${name}是生物学的重要概念。（  ）`,
            `答案：正确。解析：${name}是生物学习中的重要知识点。`
        );
    }
    
    return examples.slice(0, 10);
}

function generateDaofaExamples(k) {
    const examples = [];
    const name = k.name;
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    addQuestion(
        `选择题：${name}的核心观点是？ A. 正确的观点  B. 错误的观点  C. 相反的观点  D. 无关的观点`,
        `答案：A。解析：${name}是道德与法治的重要知识点，需要理解其核心思想。`
    );
    
    addQuestion(
        `简答题：请简述${name}的重要意义。`,
        `答案：${name}对个人成长和社会发展都具有重要意义，包括：...`
    );
    
    if (name.includes('权利') || name.includes('义务')) {
        addQuestion(
            `选择题：下列属于公民${name}的是？ A. 正确的选项  B. 其他权利/义务  C. 不属于的  D. 错误的选项`,
            `答案：A。解析：了解公民的权利和义务是法治教育的重要内容。`
        );
    }
    
    if (name.includes('宪法') || name.includes('法律')) {
        addQuestion(
            `选择题：${name}是国家的根本大法吗？ A. 根据实际回答  B. 不是  C. 不确定  D. 可能是`,
            `答案：根据实际情况回答。解析：宪法是国家的根本大法，具有最高法律效力。`
        );
    }
    
    while (examples.length < 10) {
        addQuestion(
            `判断题：${name}对我们的生活有重要指导意义。（  ）`,
            `答案：正确。解析：${name}是道德与法治学习中的重要内容，指导我们的行为。`
        );
    }
    
    return examples.slice(0, 10);
}

function generatePhysicsExamples(k) {
    const examples = [];
    const name = k.name;
    const formula = k.formula || '';
    
    let qNum = 1;
    
    function addQuestion(question, answer) {
        examples.push({
            id: `${k.id}_ex${String(qNum).padStart(2, '0')}`,
            knowledge_id: k.id,
            question: question,
            answer: answer
        });
        qNum++;
    }
    
    if (formula) {
        const formulaText = formula.split('\n')[0].trim();
        
        addQuestion(
            `选择题：${name}的公式是？ A. ${formulaText}  B. 错误的公式  C. 其他公式  D. 没有公式`,
            `答案：A。解析：${formulaText}是${name}的核心公式，需要牢记。`
        );
        
        addQuestion(
            `填空题：${name}的公式是______。`,
            `答案：${formulaText}。解析：掌握公式是解决物理问题的基础。`
        );
    }
    
    if (name.includes('速度') || name.includes('匀速')) {
        addQuestion(
            `计算题：一辆汽车以20m/s的速度行驶，5秒内行驶的距离是______米。`,
            `答案：100。解析：根据公式s = vt，s = 20 × 5 = 100米。`
        );
    }
    
    if (name.includes('密度')) {
        addQuestion(
            `计算题：一个物体质量为10kg，体积为2m³，其密度是______kg/m³。`,
            `答案：5。解析：根据公式ρ = m/V，ρ = 10/2 = 5kg/m³。`
        );
    }
    
    if (name.includes('力') || name.includes('牛顿')) {
        addQuestion(
            `计算题：一个物体质量为5kg，受到的重力是______N（g取10N/kg）。`,
            `答案：50。解析：根据公式G = mg，G = 5 × 10 = 50N。`
        );
    }
    
    if (name.includes('压强')) {
        addQuestion(
            `计算题：一个物体对地面的压力为100N，接触面积为0.1m²，压强是______Pa。`,
            `答案：1000。解析：根据公式p = F/S，p = 100/0.1 = 1000Pa。`
        );
    }
    
    if (name.includes('功') || name.includes('功率')) {
        addQuestion(
            `计算题：用100N的力将物体移动5m，做的功是______J。`,
            `答案：500。解析：根据公式W = Fs，W = 100 × 5 = 500J。`
        );
    }
    
    if (name.includes('电路') || name.includes('电流') || name.includes('电压') || name.includes('电阻')) {
        addQuestion(
            `计算题：一个电阻为10Ω的导体，两端电压为20V，通过的电流是______A。`,
            `答案：2。解析：根据欧姆定律I = U/R，I = 20/10 = 2A。`
        );
    }
    
    while (examples.length < 10) {
        addQuestion(
            `判断题：${name}是物理学的重要概念。（  ）`,
            `答案：正确。解析：${name}是物理学习中的重要知识点。`
        );
    }
    
    return examples.slice(0, 10);
}

function generateQualityExamples(knowledge, subject) {
    switch(subject) {
        case 'math': return generateMathExamples(knowledge);
        case 'english': return generateEnglishExamples(knowledge);
        case 'chinese': return generateChineseExamples(knowledge);
        case 'history': return generateHistoryExamples(knowledge);
        case 'geography': return generateGeographyExamples(knowledge);
        case 'biology': return generateBiologyExamples(knowledge);
        case 'daofa': return generateDaofaExamples(knowledge);
        case 'physics': return generatePhysicsExamples(knowledge);
        default: return generateMathExamples(knowledge);
    }
}

function regenerateExamples(grade, subject, semester) {
    const knowledgeFile = `${grade}_${subject}_${semester}.json`;
    const knowledgePath = path.join(KNOWLEDGE_DIR, knowledgeFile);
    
    if (!fs.existsSync(knowledgePath)) {
        console.log(`❌ 知识点文件不存在: ${knowledgeFile}`);
        return 0;
    }
    
    const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    let totalGenerated = 0;
    
    knowledge.forEach((k, idx) => {
        const kid = k.id || `${grade}_${subject}_${semester === 'upper' ? 'u' : 'l'}${String(idx + 1).padStart(3, '0')}`;
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
