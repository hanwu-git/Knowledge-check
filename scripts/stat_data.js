/**
 * 数据统计脚本 - 显示知识点和例题文件结构
 * 
 * 使用方式：
 *   node scripts/stat_data.js
 */
const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = 'data/knowledge';
const EXAMPLES_DIR = 'data/examples';

// 科目名称映射
const SUBJECT_NAMES = {
    'math': '数学',
    'english': '英语',
    'english_vocab': '英语词汇',
    'chinese': '语文',
    'chinese_recite': '语文背诵',
    'history': '历史',
    'geography': '地理',
    'biology': '生物',
    'daofa': '道德与法治',
    'physics': '物理'
};

// 精确的科目列表（用于避免前缀匹配问题）
const SUBJECTS = [
    'math', 'english', 'english_vocab', 'chinese', 'chinese_recite',
    'history', 'geography', 'biology', 'daofa', 'physics'
];

console.log('');
console.log('\x1b[1m\x1b[36m📁 data/\x1b[0m');
console.log('');
console.log('\x1b[33m├── knowledge/\x1b[0m                    \x1b[90m# 知识点文件\x1b[0m');
console.log('');

// 统计知识点
let totalKnowledge = 0;

['g1', 'g2'].forEach(grade => {
    const gradeName = grade === 'g1' ? '初一' : '初二';
    console.log('\x1b[36m│   ' + gradeName + ' (' + grade + '_*)\x1b[0m');
    
    let gradeCount = 0;
    SUBJECTS.forEach((subj, i) => {
        const prefix = `${grade}_${subj}`;
        const upperFile = path.join(KNOWLEDGE_DIR, `${prefix}_upper.json`);
        const lowerFile = path.join(KNOWLEDGE_DIR, `${prefix}_lower.json`);
        
        let upperCount = 0, lowerCount = 0;
        
        if (fs.existsSync(upperFile)) {
            const data = JSON.parse(fs.readFileSync(upperFile, 'utf8'));
            upperCount = data.length;
        }
        if (fs.existsSync(lowerFile)) {
            const data = JSON.parse(fs.readFileSync(lowerFile, 'utf8'));
            lowerCount = data.length;
        }
        
        if (upperCount > 0 || lowerCount > 0) {
            const total = upperCount + lowerCount;
            const name = SUBJECT_NAMES[subj] || subj;
            const isLast = i === SUBJECTS.length - 1;
            const bar = isLast ? '└──' : '├──';
            console.log('    \x1b[32m' + bar + '\x1b[0m ' + name.padEnd(18) + upperCount + ' + ' + lowerCount + ' = ' + total + '个');
            gradeCount += total;
        }
    });
    
    console.log('    \x1b[90m    共' + gradeCount + '个知识点\x1b[0m');
    totalKnowledge += gradeCount;
    if (grade === 'g1') console.log('');
});

console.log('');
console.log('\x1b[33m└── examples/\x1b[0m                    \x1b[90m# 例题文件\x1b[0m');

let totalExamples = 0;
let totalFiles = 0;

['g1', 'g2'].forEach(grade => {
    const gradeName = grade === 'g1' ? '初一' : '初二';
    console.log('');
    console.log('\x1b[36m│   ' + gradeName + ' (' + grade + '_*)\x1b[0m');
    
    let gradeFiles = 0;
    let gradeExamples = 0;
    
    SUBJECTS.forEach((subj, i) => {
        const prefix = `${grade}_${subj}`;
        let fileCount = 0;
        let exampleCount = 0;
        
        // 查找所有该科目的例题文件
        const allFiles = fs.readdirSync(EXAMPLES_DIR).filter(f => 
            f.startsWith(prefix + '_') && f.endsWith('.json')
        );
        
        allFiles.forEach(f => {
            const filePath = path.join(EXAMPLES_DIR, f);
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (Array.isArray(data)) {
                    fileCount++;
                    exampleCount += data.length;
                }
            } catch(e) {}
        });
        
        if (fileCount > 0 || exampleCount > 0) {
            const name = SUBJECT_NAMES[subj] || subj;
            const bar = '├──';
            console.log('    \x1b[32m' + bar + '\x1b[0m ' + name.padEnd(18) + fileCount + '个文件  ' + exampleCount + '题');
            gradeFiles += fileCount;
            gradeExamples += exampleCount;
        }
    });
    
    console.log('    \x1b[90m    共' + gradeFiles + '个文件  ' + gradeExamples + '题\x1b[0m');
    totalFiles += gradeFiles;
    totalExamples += gradeExamples;
});

console.log('');
console.log('\x1b[90m    文件命名: {年级}_{科目}_{学期}{序号}_010.json\x1b[0m');
console.log('\x1b[90m    示例: g1_math_u001_010.json\x1b[0m');
console.log('');
console.log('\x1b[1m📊 总体统计\x1b[0m');
console.log('='.repeat(50));
console.log('  知识点文件:  38个');
console.log('  例题文件:    ' + totalFiles + '个');
console.log('  知识点总数:  ' + totalKnowledge + '个');
console.log('  例题总数:    ' + totalExamples + '道');
console.log('');