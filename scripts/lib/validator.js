/**
 * 验证器 - 职责单一
 * 只负责验证生成的页面和数据是否正确
 */
const fs = require('fs');
const path = require('path');

/**
 * 验证生成的HTML页面
 * @param {string[]} generatedPages - 生成的页面文件列表
 * @param {Object} config - 配置对象
 * @returns {Object} 验证结果 {passed, errors, warnings}
 */
function validatePages(generatedPages, config) {
    const errors = [];
    const warnings = [];
    
    generatedPages.forEach(pageFile => {
        if (!fs.existsSync(pageFile)) {
            errors.push(`页面文件不存在: ${pageFile}`);
            return;
        }
        
        const content = fs.readFileSync(pageFile, 'utf8');
        
        // 1. 检查页面文件名是否带年级前缀
        if (!pageFile.match(/knowledge_g\d+_[a-z_]+\.html$/)) {
            errors.push(`页面文件名缺少年级前缀: ${pageFile}`);
        }
        
        // 2. 检查页面内的链接是否正确
        const links = content.match(/href="knowledge_[^"]+\.html"/g) || [];
        links.forEach(link => {
            // 提取链接中的文件名
            const fileNameMatch = link.match(/href="(knowledge_[^"]+\.html)"/);
            if (fileNameMatch) {
                const fileName = fileNameMatch[1];
                // 检查是否带年级前缀
                if (!fileName.match(/knowledge_g\d+_[a-z_]+\.html/)) {
                    errors.push(`${pageFile} 中的链接缺少年级前缀: ${link}`);
                }
            }
        });
        
        // 3. 检查内嵌的例题数据是否正确
        const examplesMatch = content.match(/const DATA_EXAMPLES = (\[[\s\S]*?\]);/);
        if (examplesMatch) {
            try {
                const examples = JSON.parse(examplesMatch[1]);
                
                // 检查例题重复
                const ids = examples.map(e => e.id);
                const uniqueIds = [...new Set(ids)];
                if (ids.length !== uniqueIds.length) {
                    warnings.push(`${pageFile}: 例题重复 (${ids.length} -> ${uniqueIds.length})`);
                }
                
                // 检查知识点覆盖
                const knowledgeIds = [...new Set(examples.map(e => e.knowledge_id))];
                const knowledgeMatch = content.match(/const DATA_KNOWLEDGE = (\[[\s\S]*?\]);/);
                if (knowledgeMatch) {
                    const knowledge = JSON.parse(knowledgeMatch[1]);
                    const kpIds = knowledge.map(k => k.id);
                    
                    // 检查是否有知识点缺少例题
                    const missingExamples = kpIds.filter(id => !knowledgeIds.includes(id));
                    if (missingExamples.length > 0 && !content.includes('HAS_EXAMPLES = false')) {
                        warnings.push(`${pageFile}: ${missingExamples.length} 个知识点缺少例题`);
                    }
                    
                    // 检查例题总数
                    const expectedExamples = kpIds.length * 10;
                    const actualExamples = uniqueIds.length;
                    if (actualExamples !== expectedExamples && !content.includes('HAS_EXAMPLES = false')) {
                        warnings.push(`${pageFile}: 例题数不符合预期 (${actualExamples} vs ${expectedExamples})`);
                    }
                }
            } catch(e) {
                errors.push(`${pageFile}: 例题JSON解析失败 - ${e.message}`);
            }
        }
    });
    
    return {
        passed: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * 验证首页链接
 * @param {string} indexFile - 首页文件路径
 * @param {Object} gradesConfig - 年级配置对象（GRADES）
 * @returns {Object} 验证结果
 */
function validateIndexLinks(indexFile, gradesConfig) {
    const errors = [];
    const warnings = [];
    
    if (!fs.existsSync(indexFile)) {
        errors.push(`首页文件不存在: ${indexFile}`);
        return { passed: false, errors, warnings };
    }
    
    const content = fs.readFileSync(indexFile, 'utf8');
    
    // 检查所有科目的链接是否正确
    Object.entries(gradesConfig).forEach(([gradeKey, grade]) => {
        // 只检查 subjects 对象中的科目
        if (!grade.subjects) return;
        
        Object.entries(grade.subjects).forEach(([subjectKey, subject]) => {
            const gradePrefix = gradeKey.replace('grade', 'g');
            const expectedLink = `knowledge_${gradePrefix}_${subjectKey}.html`;
            
            // 检查上册链接
            const upperPattern = new RegExp(`href="${expectedLink}\\?semester=upper"`);
            if (!upperPattern.test(content)) {
                errors.push(`首页缺少链接: ${expectedLink}?semester=upper`);
            }
            
            // 检查下册链接
            const lowerPattern = new RegExp(`href="${expectedLink}\\?semester=lower"`);
            if (!lowerPattern.test(content)) {
                errors.push(`首页缺少链接: ${expectedLink}?semester=lower`);
            }
        });
    });
    
    // 检查是否有错误格式的链接（不带年级前缀）
    const badLinks = content.match(/href="knowledge_[a-z_]+\.html/g) || [];
    badLinks.forEach(link => {
        if (!link.match(/knowledge_g\d+_[a-z_]+\.html/)) {
            errors.push(`首页有错误格式的链接: ${link}`);
        }
    });
    
    // 检查继续学习按钮的链接生成逻辑
    const continueStudyPattern = /const url = 'knowledge_' + lastStudy\./;
    if (continueStudyPattern.test(content)) {
        // 检查是否包含 grade
        if (!content.includes('lastStudy.grade') && content.includes('lastStudy.subject')) {
            errors.push(`首页"继续学习"链接生成缺少年级前缀`);
        }
    }
    
    return {
        passed: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * 打印验证结果
 * @param {Object} result - 验证结果
 */
function printValidationResult(result) {
    if (result.passed) {
        console.log('✅ 验证通过');
    } else {
        console.log('❌ 验证失败');
    }
    
    if (result.errors.length > 0) {
        console.log('\n错误:');
        result.errors.forEach(err => console.log(`  ❌ ${err}`));
    }
    
    if (result.warnings.length > 0) {
        console.log('\n警告:');
        result.warnings.forEach(warn => console.log(`  ⚠️  ${warn}`));
    }
    
    return result.passed;
}

module.exports = {
    validatePages,
    validateIndexLinks,
    printValidationResult
};