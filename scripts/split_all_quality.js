/**
 * 拆分所有汇总例题文件为单独格式
 * 
 * 使用方式：
 *   node scripts/split_all_quality.js        # 拆分所有
 *   node scripts/split_all_quality.js g1_math_quality.json  # 只拆分指定文件
 */
const fs = require('fs');
const path = require('path');

const EXAMPLES_DIR = 'data/examples';

// 需要拆分的汇总文件列表
const qualityFiles = [
    // 初一
    'g1_math_quality.json',
    'g1_english_quality.json',
    'g1_chinese_quality.json',
    'g1_history_quality.json',
    'g1_geography_quality.json',
    'g1_biology_quality.json',
    'g1_daofa_quality.json',
    // 初二
    'g2_physics_upper_quality.json',
    'g2_physics_lower_quality.json',
    'g2_biology_quality.json',
];

let totalSplit = 0;
let totalFiles = 0;

/**
 * 拆分单个汇总文件
 * @param {string} fileName - 汇总文件名
 * @returns {number} 拆分出的文件数量
 */
function splitQualityFile(fileName) {
    const filePath = path.join(EXAMPLES_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️  文件不存在: ${fileName}`);
        return 0;
    }
    
    // 读取汇总文件
    const allExamples = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`  读取 ${fileName}: ${allExamples.length} 道题`);
    
    // 按知识点ID分组
    const grouped = {};
    allExamples.forEach(ex => {
        const kpId = ex.knowledge_id;
        if (!kpId) {
            console.log(`  ⚠️  例题缺少knowledge_id: ${ex.id}`);
            return;
        }
        if (!grouped[kpId]) {
            grouped[kpId] = [];
        }
        grouped[kpId].push(ex);
    });
    
    console.log(`  分组: ${Object.keys(grouped).length} 个知识点`);
    
    // 写入单独文件
    let count = 0;
    Object.entries(grouped).forEach(([kpId, examples]) => {
        // 生成文件名: g2_physics_029_010.json
        // 格式：前缀_知识点ID_010.json
        // 需要从knowledge_id提取学期和序号
        
        // knowledge_id 格式可能是：
        // - g2_physics_029 (无学期前缀)
        // - g2_english_u001 (有学期前缀)
        // - g1_biology_u021 (有学期前缀)
        
        let newFileName;
        
        if (kpId.match(/_u\d+$/)) {
            // 上册格式: g2_english_u001 -> g2_english_u001_010.json
            newFileName = `${kpId}_010.json`;
        } else if (kpId.match(/_l\d+$/)) {
            // 下册格式: g2_geography_l001 -> g2_geography_l001_010.json
            newFileName = `${kpId}_010.json`;
        } else {
            // 无学期前缀格式: g2_physics_029 -> g2_physics_029_010.json
            // 但需要区分上下册，这里暂时用原ID
            newFileName = `${kpId}_010.json`;
        }
        
        const newFilePath = path.join(EXAMPLES_DIR, newFileName);
        fs.writeFileSync(newFilePath, JSON.stringify(examples, null, 2), 'utf8');
        count++;
    });
    
    console.log(`  生成: ${count} 个单独文件`);
    return count;
}

/**
 * 主函数
 */
function main() {
    console.log('='.repeat(60));
    console.log('📦 例题文件拆分工具');
    console.log('='.repeat(60));
    
    // 检查命令行参数
    const args = process.argv.slice(2);
    let filesToProcess = qualityFiles;
    
    if (args.length > 0) {
        // 指定了文件
        filesToProcess = args;
        console.log(`\n只处理指定文件: ${filesToProcess.join(', ')}`);
    } else {
        console.log(`\n将拆分以下 ${filesToProcess.length} 个汇总文件:`);
        qualityFiles.forEach(f => console.log(`  - ${f}`));
    }
    
    console.log('\n开始拆分...\n');
    
    // 逐个拆分
    filesToProcess.forEach(fileName => {
        console.log(`\n处理: ${fileName}`);
        const count = splitQualityFile(fileName);
        if (count > 0) {
            totalFiles++;
            totalSplit += count;
            // 删除旧文件
            const oldPath = path.join(EXAMPLES_DIR, fileName);
            fs.unlinkSync(oldPath);
            console.log(`  ✅ 已删除旧文件: ${fileName}`);
        }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 拆分完成');
    console.log('='.repeat(60));
    console.log(`  处理文件: ${totalFiles} 个`);
    console.log(`  生成文件: ${totalSplit} 个`);
    console.log('');
}

main();