/**
 * 数据加载器 - 职责单一
 * 只负责从文件加载知识点和例题数据
 */
const fs = require('fs');
const path = require('path');
const { KNOWLEDGE_DIR, EXAMPLES_DIR } = require('./config');

/**
 * 加载知识点数据
 * @param {string[]} files - 知识点文件列表
 * @returns {Object[]} 知识点数组，已添加semester字段
 */
function loadKnowledge(files) {
    const allData = [];
    
    files.forEach((fileName, index) => {
        const filePath = path.join(KNOWLEDGE_DIR, fileName);
        
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  知识点文件不存在: ${fileName}`);
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const semester = index === 0 ? 'upper' : 'lower';
        
        // 为每个知识点添加semester字段
        data.forEach(item => {
            item.semester = semester;
        });
        
        allData.push(...data);
    });
    
    return allData;
}

/**
 * 加载例题数据
 * 自动识别单独文件格式和汇总文件格式，避免重复加载
 * @param {string} gradePrefix - 年级前缀 (g1_, g2_)
 * @param {string} subjectKey - 科目key (math, physics...)
 * @returns {Object[]} 例题数组
 */
function loadExamples(gradePrefix, subjectKey) {
    const examples = [];
    const subjectFilePrefix = `${gradePrefix}${subjectKey}_`;
    
    // 获取所有匹配的文件
    const allFiles = fs.readdirSync(EXAMPLES_DIR).filter(f => 
        f.startsWith(subjectFilePrefix) && f.endsWith('.json')
    );
    
    // 检测是否有单独的例题文件（格式：g2_math_001_010.json）
    // 单独文件格式：前缀 + 数字 + _ + 数字 + .json
    const individualPattern = new RegExp(`^${subjectFilePrefix}\\d+_\\d+\\.json$`);
    const individualFiles = allFiles.filter(f => individualPattern.test(f));
    
    let filesToLoad = [];
    
    if (individualFiles.length > 0) {
        // 有单独文件，只使用单独文件（避免重复）
        filesToLoad = individualFiles;
    } else {
        // 没有单独文件，使用所有匹配文件（汇总文件）
        filesToLoad = allFiles;
    }
    
    // 加载文件数据
    filesToLoad.forEach(fileName => {
        const filePath = path.join(EXAMPLES_DIR, fileName);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (Array.isArray(data)) {
                examples.push(...data);
            }
        } catch(e) {
            console.warn(`⚠️  例题文件解析失败: ${fileName} - ${e.message}`);
        }
    });
    
    // 去重（以id为唯一标识）
    const uniqueExamples = [];
    const seenIds = new Set();
    
    examples.forEach(ex => {
        if (ex.id && !seenIds.has(ex.id)) {
            seenIds.add(ex.id);
            uniqueExamples.push(ex);
        }
    });
    
    if (examples.length !== uniqueExamples.length) {
        console.warn(`⚠️  例题去重: ${examples.length} -> ${uniqueExamples.length}`);
    }
    
    return uniqueExamples;
}

/**
 * 验证知识点和例题的对应关系
 * @param {Object[]} knowledge - 知识点数组
 * @param {Object[]} examples - 例题数组
 * @param {string} subjectName - 科目名称（用于日志）
 * @returns {Object} 验证结果 {valid, missing, stats}
 */
function validateKnowledgeExamplesMapping(knowledge, examples, subjectName) {
    const knowledgeIds = new Set(knowledge.map(k => k.id));
    const exampleKnowledgeIds = new Set(examples.map(e => e.knowledge_id));
    
    // 检查每个知识点是否有例题
    const missingExamples = [];
    knowledgeIds.forEach(id => {
        if (!exampleKnowledgeIds.has(id)) {
            missingExamples.push(id);
        }
    });
    
    // 检查例题的知识点ID是否存在于知识点列表中
    const orphanExamples = [];
    exampleKnowledgeIds.forEach(id => {
        if (!knowledgeIds.has(id)) {
            orphanExamples.push(id);
        }
    });
    
    // 统计每个知识点的例题数量
    const exampleCounts = {};
    examples.forEach(ex => {
        exampleCounts[ex.knowledge_id] = (exampleCounts[ex.knowledge_id] || 0) + 1;
    });
    
    const stats = {
        knowledgeCount: knowledge.length,
        exampleCount: examples.length,
        avgExamplesPerKnowledge: examples.length / knowledge.length || 0,
        knowledgeWithNoExamples: missingExamples.length,
        knowledgeWith10Examples: Object.values(exampleCounts).filter(c => c === 10).length,
        knowledgeWithMoreThan10: Object.values(exampleCounts).filter(c => c > 10).length
    };
    
    return {
        valid: missingExamples.length === 0 && orphanExamples.length === 0,
        missingExamples,
        orphanExamples,
        stats
    };
}

module.exports = {
    loadKnowledge,
    loadExamples,
    validateKnowledgeExamplesMapping
};