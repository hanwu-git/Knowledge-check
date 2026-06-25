const fs = require('fs');

function extractStructure(html) {
    const structure = [];
    const classRegex = /class="([^"]+)"/g;
    let match;
    const classes = new Set();
    while ((match = classRegex.exec(html)) !== null) {
        match[1].split(' ').forEach(c => {
            if (c && !c.includes('{')) classes.add(c);
        });
    }
    
    const idRegex = /id="([^"]+)"/g;
    const ids = new Set();
    while ((match = idRegex.exec(html)) !== null) {
        ids.add(match[1]);
    }
    
    const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    const tags = new Set();
    while ((match = tagRegex.exec(html)) !== null) {
        tags.add(match[1]);
    }
    
    return { classes: Array.from(classes).sort(), ids: Array.from(ids).sort(), tags: Array.from(tags).sort() };
}

console.log('='.repeat(60));
console.log('🔍 对比一年级 vs 二年级页面结构');
console.log('='.repeat(60));

const grade2 = extractStructure(fs.readFileSync('knowledge_math.html', 'utf8'));
const grade1 = extractStructure(fs.readFileSync('g1_math.html', 'utf8'));

// 对比ID
console.log('\n📌 ID对比:');
console.log(`  二年级: ${grade2.ids.length} 个ID`);
console.log(`  一年级: ${grade1.ids.length} 个ID`);
const g2OnlyIds = grade2.ids.filter(id => !grade1.ids.includes(id));
const g1OnlyIds = grade1.ids.filter(id => !grade2.ids.includes(id));
if (g2OnlyIds.length > 0) console.log(`  仅二年级有: ${g2OnlyIds.join(', ')}`);
if (g1OnlyIds.length > 0) console.log(`  仅一年级有: ${g1OnlyIds.join(', ')}`);
if (g2OnlyIds.length === 0 && g1OnlyIds.length === 0) console.log('  ✅ ID完全一致');

// 对比主要CSS类
const keyClasses = ['card', 'knowledge-card', 'knowledge-header', 'expand-icon', 
    'nav-bar', 'nav-back-btn', 'page-header', 'page-title', 'page-subtitle',
    'modal-overlay', 'modal-content', 'answer-box', 'tag',
    'btn', 'btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-gray',
    'input', 'progress-bar', 'progress-bar-fill',
    'formula-box', 'empty-state', 'empty-state-icon', 'empty-state-text'];

console.log('\n🎨 关键样式类对比:');
let classMatchCount = 0;
const missing = [];
const extra = [];
keyClasses.forEach(cls => {
    const g2has = grade2.classes.includes(cls);
    const g1has = grade1.classes.includes(cls);
    if (g2has && g1has) {
        console.log(`  ✅ ${cls}`);
        classMatchCount++;
    } else if (g2has && !g1has) {
        console.log(`  ❌ ${cls} - 一年级缺少`);
        missing.push(cls);
    } else if (!g2has && g1has) {
        console.log(`  ⚠️  ${cls} - 仅一年级有`);
        extra.push(cls);
    } else {
        classMatchCount++;
    }
});
console.log(`  匹配度: ${classMatchCount}/${keyClasses.length}`);
if (missing.length > 0) console.log(`  ❌ 一年级缺少: ${missing.join(', ')}`);
if (extra.length > 0) console.log(`  ⚠️  仅一年级有: ${extra.join(', ')}`);

// 对比主要HTML结构标签
console.log('\n🏗️  主要结构元素:');
const g2HasNav = fs.readFileSync('knowledge_math.html', 'utf8').includes('nav-bar');
const g1HasNav = fs.readFileSync('g1_math.html', 'utf8').includes('nav-bar');
console.log(`  顶部导航栏: 二年级${g2HasNav ? '✅' : '❌'} 一年级${g1HasNav ? '✅' : '❌'}`);

const g2HasModal = fs.readFileSync('knowledge_math.html', 'utf8').includes('modal-overlay');
const g1HasModal = fs.readFileSync('g1_math.html', 'utf8').includes('modal-overlay');
console.log(`  例题模态框: 二年级${g2HasModal ? '✅' : '❌'} 一年级${g1HasModal ? '✅' : '❌'}`);

const g2HasFormula = fs.readFileSync('knowledge_math.html', 'utf8').includes('formula-box');
const g1HasFormula = fs.readFileSync('g1_math.html', 'utf8').includes('formula-box');
console.log(`  公式框样式: 二年级${g2HasFormula ? '✅' : '❌'} 一年级${g1HasFormula ? '✅' : '❌'}`);

const g2HasExpand = fs.readFileSync('knowledge_math.html', 'utf8').includes('expand-icon');
const g1HasExpand = fs.readFileSync('g1_math.html', 'utf8').includes('expand-icon');
console.log(`  展开图标: 二年级${g2HasExpand ? '✅' : '❌'} 一年级${g1HasExpand ? '✅' : '❌'}`);

console.log('\n' + '='.repeat(60));
if (classMatchCount === keyClasses.length) {
    console.log('🎉 样式结构完全一致！');
} else {
    console.log('⚠️  存在差异，请检查');
}
