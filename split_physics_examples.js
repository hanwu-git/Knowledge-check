const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, 'data', 'examples');

function splitQualityFile(filename) {
    const filePath = path.join(EXAMPLE_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`❌ 文件不存在: ${filename}`);
        return 0;
    }
    
    const allExamples = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const grouped = {};
    allExamples.forEach(ex => {
        if (!ex.knowledge_id) return;
        if (!grouped[ex.knowledge_id]) {
            grouped[ex.knowledge_id] = [];
        }
        grouped[ex.knowledge_id].push(ex);
    });
    
    let count = 0;
    Object.entries(grouped).forEach(([kpId, examples]) => {
        const fileName = `${kpId}_010.json`;
        fs.writeFileSync(
            path.join(EXAMPLE_DIR, fileName),
            JSON.stringify(examples, null, 2)
        );
        count++;
    });
    
    console.log(`✅ ${filename}: 拆分为 ${count} 个文件`);
    return count;
}

console.log('='.repeat(60));
console.log('🔧 拆分初二物理高质量例题');
console.log('='.repeat(60));

splitQualityFile('g2_physics_upper_quality.json');
splitQualityFile('g2_physics_lower_quality.json');

console.log('\n拆分完成！');
