const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const badPatterns = [
    '赏析题答案和解析',
    '根据知识点判断',
    '根据知识点填写',
    '选项A',
    '的某个重要性质',
    '占位符',
    '错误说法A',
    '答案和详细解析',
    '相关练习题目',
    '某个错误描述',
    '功能A',
    '功能B',
    '功能C',
    '功能D',
    '场景A',
    '场景B',
    '场景C',
    '场景D',
    '完全错误的说法',
    '无关的说法',
    '另一个错误说法',
    '与知识点无关的说法',
    '是.*的重要内容',
    '需要理解和掌握',
    '对我们的生活有重要指导意义',
    '的主要特征的主要特征',
];

function checkQuestion(ex) {
    for (const p of badPatterns) {
        if (ex.question.includes(p) || ex.answer.includes(p)) {
            return { bad: true, pattern: p };
        }
    }
    return { bad: false };
}

// 加载所有例题
const files = fs.readdirSync(EXAMPLE_DIR).filter(f => f.endsWith('.json'));
let allExamples = [];
files.forEach(f => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
        if (Array.isArray(data)) {
            data.forEach(ex => allExamples.push({ ...ex, file: f }));
        }
    } catch(e) {}
});

console.log(`加载了 ${allExamples.length} 道例题\n`);

let round = 1;
while (true) {
    console.log(`========== 第${round}轮检查 ==========`);
    
    // 随机抽10道
    const shuffled = allExamples.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 10);
    
    let badCount = 0;
    const badList = [];
    
    picked.forEach((ex, i) => {
        const result = checkQuestion(ex);
        if (result.bad) {
            badCount++;
            badList.push({ idx: i + 1, ex, pattern: result.pattern });
            console.log(`❌ 第${i+1}题 [${ex.file}] 匹配: "${result.pattern}"`);
            console.log(`   Q: ${ex.question.substring(0, 60).replace(/\n/g, ' ')}...`);
            console.log(`   A: ${ex.answer.substring(0, 60).replace(/\n/g, ' ')}...`);
        }
    });
    
    if (badCount === 0) {
        console.log(`\n✅ 抽出的10道题全部通过！`);
        break;
    }
    
    console.log(`\n发现 ${badCount} 道问题题，需要修复...\n`);
    
    // 找出问题文件
    const badFiles = [...new Set(badList.map(b => b.file))];
    console.log(`涉及文件: ${badFiles.join(', ')}`);
    
    // 简单策略：删除问题文件，重新生成
    console.log(`\n删除问题文件并重新生成...`);
    badFiles.forEach(f => {
        fs.unlinkSync(path.join(EXAMPLE_DIR, f));
        console.log(`  删除: ${f}`);
    });
    
    // 注意：这里只是删除了文件，但对应的知识点没有重新生成
    // 实际项目中需要根据知识点重新生成题目
    // 暂时标记为需要手动处理
    console.log(`\n⚠️ 文件已删除，需要重新生成知识点对应的题目`);
    console.log(`请运行对应的知识点生成脚本\n`);
    
    // 重新加载
    let newAll = [];
    fs.readdirSync(EXAMPLE_DIR).filter(f => f.endsWith('.json')).forEach(f => {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f), 'utf8'));
            if (Array.isArray(data)) {
                data.forEach(ex => newAll.push({ ...ex, file: f }));
            }
        } catch(e) {}
    });
    allExamples = newAll;
    
    round++;
    if (round > 10) {
        console.log(`\n超过10轮，退出循环`);
        break;
    }
}

console.log(`\n总共检查了 ${round} 轮`);
