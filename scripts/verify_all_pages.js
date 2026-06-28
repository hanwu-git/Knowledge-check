/**
 * 全面验证脚本 - 检查所有页面的例题挂载情况
 * 
 * 检查项：
 * 1. 页面文件是否存在
 * 2. 知识点数据是否正确内嵌
 * 3. 例题数据是否正确内嵌
 * 4. 例题是否有重复
 * 5. 每个知识点是否有对应例题
 * 6. 例题数量是否符合预期
 * 7. 首页链接是否正确
 */
const fs = require('fs');
const path = require('path');
const config = require('./lib/config');
const validator = require('./lib/validator');

console.log('='.repeat(70));
console.log('📊 初中知识点系统 - 全面验证报告');
console.log('='.repeat(70));

// ==================== 步骤1：收集所有页面文件 ====================
console.log('\n📁 步骤1：收集所有页面文件...');

const allPages = [];
const expectedPages = [];

Object.entries(config.GRADES).forEach(([gradeKey, grade]) => {
    Object.entries(grade.subjects).forEach(([subjectKey, subject]) => {
        const fileName = config.getPageFileName(gradeKey, subjectKey);
        expectedPages.push({
            gradeKey,
            subjectKey,
            subjectName: subject.name,
            gradeName: grade.name,
            fileName,
            noExamples: subject.noExamples || false,
            files: subject.files
        });
    });
});

console.log(`  期望页面数: ${expectedPages.length}`);

// 检查每个页面文件是否存在
const existingPages = expectedPages.filter(p => {
    const exists = fs.existsSync(p.fileName);
    if (!exists) {
        console.log(`  ❌ 缺失: ${p.fileName}`);
    }
    return exists;
});

console.log(`  实际存在: ${existingPages.length}/${expectedPages.length}`);

if (existingPages.length !== expectedPages.length) {
    console.log(`  ⚠️  有 ${expectedPages.length - existingPages.length} 个页面文件缺失！`);
}

// ==================== 步骤2：验证每个页面的内嵌数据 ====================
console.log('\n📊 步骤2：验证页面内嵌数据...');

const results = [];

existingPages.forEach(page => {
    const content = fs.readFileSync(page.fileName, 'utf8');
    
    const result = {
        ...page,
        knowledgeCount: 0,
        exampleCount: 0,
        uniqueExampleCount: 0,
        knowledgeIds: [],
        exampleKnowledgeIds: [],
        missingExamples: [],
        orphanExamples: [],
        exampleCounts: {},
        hasDuplicates: false,
        errors: [],
        warnings: []
    };
    
    // 提取知识点数据
    const knowledgeMatch = content.match(/const DATA_KNOWLEDGE = (\[[\s\S]*?\]);/);
    if (knowledgeMatch) {
        try {
            const knowledge = JSON.parse(knowledgeMatch[1]);
            result.knowledgeCount = knowledge.length;
            result.knowledgeIds = knowledge.map(k => k.id);
            
            // 检查知识点ID是否有重复
            const uniqueIds = [...new Set(result.knowledgeIds)];
            if (uniqueIds.length !== result.knowledgeIds.length) {
                result.errors.push(`知识点ID重复: ${result.knowledgeIds.length} -> ${uniqueIds.length}`);
            }
        } catch(e) {
            result.errors.push(`知识点JSON解析失败: ${e.message}`);
        }
    } else {
        result.errors.push('未找到知识点数据 (DATA_KNOWLEDGE)');
    }
    
    // 提取例题数据
    const examplesMatch = content.match(/const DATA_EXAMPLES = (\[[\s\S]*?\]);/);
    if (examplesMatch) {
        try {
            const examples = JSON.parse(examplesMatch[1]);
            result.exampleCount = examples.length;
            
            // 检查例题ID重复
            const exampleIds = examples.map(e => e.id);
            result.uniqueExampleCount = [...new Set(exampleIds)].length;
            result.hasDuplicates = result.exampleCount !== result.uniqueExampleCount;
            
            if (result.hasDuplicates) {
                result.errors.push(`例题ID重复: ${result.exampleCount} -> ${result.uniqueExampleCount}`);
            }
            
            // 统计每个知识点的例题数
            result.exampleKnowledgeIds = [...new Set(examples.map(e => e.knowledge_id))];
            examples.forEach(ex => {
                result.exampleCounts[ex.knowledge_id] = (result.exampleCounts[ex.knowledge_id] || 0) + 1;
            });
            
            // 检查哪些知识点缺少例题
            result.missingExamples = result.knowledgeIds.filter(id => 
                !result.exampleKnowledgeIds.includes(id)
            );
            
            if (result.missingExamples.length > 0 && !page.noExamples) {
                result.warnings.push(`${result.missingExamples.length} 个知识点缺少例题`);
            }
            
            // 检查哪些例题的知识点ID不存在
            result.orphanExamples = result.exampleKnowledgeIds.filter(id => 
                !result.knowledgeIds.includes(id)
            );
            
            if (result.orphanExamples.length > 0) {
                result.warnings.push(`${result.orphanExamples.length} 道例题的知识点ID不存在`);
            }
            
            // 检查例题数量是否符合预期（10道/知识点）
            if (!page.noExamples && result.knowledgeCount > 0) {
                const expected = result.knowledgeCount * 10;
                const actual = result.uniqueExampleCount;
                if (actual !== expected) {
                    result.warnings.push(`例题数量不符合预期: ${actual}/${expected} (差 ${expected - actual})`);
                }
                
                // 统计有多少知识点刚好10道题
                const with10 = Object.values(result.exampleCounts).filter(c => c === 10).length;
                const withMore = Object.values(result.exampleCounts).filter(c => c > 10).length;
                const withLess = Object.values(result.exampleCounts).filter(c => c < 10).length;
                
                if (withLess > 0) {
                    result.warnings.push(`${withLess} 个知识点例题不足10道`);
                }
                if (withMore > 0) {
                    result.warnings.push(`${withMore} 个知识点例题超过10道`);
                }
            }
            
        } catch(e) {
            result.errors.push(`例题JSON解析失败: ${e.message}`);
        }
    } else if (!page.noExamples) {
        result.errors.push('未找到例题数据 (DATA_EXAMPLES)');
    }
    
    // 检查HAS_EXAMPLES标记
    const hasExamplesMatch = content.match(/const HAS_EXAMPLES = (true|false);/);
    if (hasExamplesMatch) {
        const hasExamples = hasExamplesMatch[1] === 'true';
        if (page.noExamples && hasExamples) {
            result.errors.push('HAS_EXAMPLES标记错误：应该为false');
        }
        if (!page.noExamples && !hasExamples) {
            result.errors.push('HAS_EXAMPLES标记错误：应该为true');
        }
    }
    
    results.push(result);
});

// ==================== 步骤3：按年级分组输出结果 ====================
console.log('\n📋 步骤3：详细结果...\n');

let totalKnowledge = 0;
let totalExamples = 0;
let totalErrors = 0;
let totalWarnings = 0;

Object.entries(config.GRADES).forEach(([gradeKey, grade]) => {
    console.log(`【${grade.name}】`);
    console.log('-'.repeat(60));
    
    const gradeResults = results.filter(r => r.gradeKey === gradeKey);
    
    console.log(`${'科目'.padEnd(12)} ${'知识点'.padStart(6)} ${'例题'.padStart(6)} ${'唯一例题'.padStart(8)} ${'状态'.padStart(8)}`);
    console.log('-'.repeat(60));
    
    gradeResults.forEach(r => {
        const status = r.errors.length > 0 ? '❌ 错误' : (r.warnings.length > 0 ? '⚠️ 警告' : '✅ 正常');
        console.log(`${r.subjectName.padEnd(12)} ${String(r.knowledgeCount).padStart(6)} ${String(r.exampleCount).padStart(6)} ${String(r.uniqueExampleCount).padStart(8)} ${status.padStart(8)}`);
        
        totalKnowledge += r.knowledgeCount;
        totalExamples += r.uniqueExampleCount;
        totalErrors += r.errors.length;
        totalWarnings += r.warnings.length;
        
        // 输出详细错误和警告
        r.errors.forEach(err => {
            console.log(`     ❌ ${err}`);
        });
        r.warnings.forEach(warn => {
            console.log(`     ⚠️  ${warn}`);
        });
        
        // 如果有缺少例题的知识点，列出前5个
        if (r.missingExamples.length > 0 && !r.noExamples) {
            const showCount = Math.min(5, r.missingExamples.length);
            console.log(`        缺少例题的知识点 (前${showCount}个): ${r.missingExamples.slice(0, showCount).join(', ')}`);
            if (r.missingExamples.length > 5) {
                console.log(`        ... 还有 ${r.missingExamples.length - 5} 个`);
            }
        }
    });
    
    console.log('');
});

// ==================== 步骤4：验证首页链接 ====================
console.log('🔗 步骤4：验证首页链接...\n');

const indexValidation = validator.validateIndexLinks('index.html', config.GRADES);

if (indexValidation.passed) {
    console.log('  ✅ 首页链接全部正确');
} else {
    console.log('  ❌ 首页链接有错误:');
    indexValidation.errors.forEach(err => console.log(`     ❌ ${err}`));
    totalErrors += indexValidation.errors.length;
}

indexValidation.warnings.forEach(warn => {
    console.log(`     ⚠️  ${warn}`);
    totalWarnings += indexValidation.warnings.length;
});

// ==================== 步骤5：总体统计 ====================
console.log('\n' + '='.repeat(70));
console.log('📈 总体统计');
console.log('='.repeat(70));
console.log(`  页面总数:     ${results.length}/${expectedPages.length}`);
console.log(`  知识点总数:   ${totalKnowledge}`);
console.log(`  例题总数:     ${totalExamples}`);
console.log(`  错误总数:     ${totalErrors}`);
console.log(`  警告总数:     ${totalWarnings}`);

// 按严重程度分类统计
const errorPages = results.filter(r => r.errors.length > 0).length;
const warningPages = results.filter(r => r.errors.length === 0 && r.warnings.length > 0).length;
const okPages = results.filter(r => r.errors.length === 0 && r.warnings.length === 0).length;

console.log(`\n  完全正常:     ${okPages} 个页面`);
console.log(`  有警告:       ${warningPages} 个页面`);
console.log(`  有错误:       ${errorPages} 个页面`);

if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n🎉 完美！所有验证全部通过！');
} else if (totalErrors === 0) {
    console.log('\n⚠️  没有错误，但有警告，建议检查');
} else {
    console.log('\n❌ 有错误需要修复！');
}

console.log('='.repeat(70));

// 导出结果供其他脚本使用
module.exports = { results, totalErrors, totalWarnings };