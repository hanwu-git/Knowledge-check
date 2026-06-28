const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const OUTPUT_FILE = path.join(__dirname, '..', 'quality_report.md');

const badPatterns = {
    emptyAnswer: [
        { pattern: /翻译题答案和解析/, desc: '空模板答案：翻译题答案和解析' },
        { pattern: /赏析题答案和解析/, desc: '空模板答案：赏析题答案和解析' },
        { pattern: /解答题答案和解析/, desc: '空模板答案：解答题答案和解析' },
        { pattern: /根据知识点填写/, desc: '空模板答案：根据知识点填写' },
        { pattern: '答案和解析...', desc: '空模板答案：答案和解析...' },
        { pattern: /答案：正确\s*\n解析：根据知识点/, desc: '空模板答案：答案正确+解析空洞' },
        { pattern: /答案：C\s*\n解析：根据.*定义和性质，选项C是正确的/, desc: '空模板答案：选项C+解析空洞' },
    ],
    redundancy: [
        { pattern: /的特征的主要特征/, desc: '冗余表述：的主要特征的主要特征' },
        { pattern: /请简述.*请简述/, desc: '重复表述：请简述重复' },
    ],
    incomplete: [
        { pattern: /【[^】]+】[^】]*：。\s*（/, desc: '题目不完整：冒号后无内容' },
        { pattern: /：\.\(\)/, desc: '题目不完整：冒号后只有点' },
        { pattern: /^【[^】]+】[^：]*：\.$/m, desc: '题目以句号结尾不完整' },
    ],
    irrelevant: [
        { pattern: /捡拾垃圾.*网络生活/, desc: '材料与知识点不相关：捡拾垃圾配网络生活' },
        { pattern: /捡拾垃圾.*终身学习/, desc: '材料与知识点不相关：捡拾垃圾配终身学习' },
        { pattern: /捡拾垃圾.*正确对待挫折/, desc: '材料与知识点不相关：捡拾垃圾配挫折' },
        { pattern: /细菌.*代表动物/, desc: '分类错误：细菌被称为动物' },
        { pattern: /真菌.*代表动物/, desc: '分类错误：真菌被称为动物' },
    ],
    template: [
        { pattern: '只需要死记硬背', desc: '模板化表述：只需要死记硬背' },
        { pattern: '只需要记住结论，不需要理解原理', desc: '模板化表述：只需要记住结论' },
        { pattern: '与其他知识点没有联系', desc: '错误表述：与其他知识点没有联系' },
        { pattern: /关于.*的某个说法/, desc: '模板化题目：关于...的某个说法' },
        { pattern: /错误说法[A-D]/, desc: '模板化选项：错误说法A/B/C/D' },
        { pattern: /正确说法[A-D]/, desc: '模板化选项：正确说法A/B/C/D' },
        { pattern: /请简要说明.*的主要内容和应用/, desc: '模板化题目：请简要说明...的主要内容和应用' },
        { pattern: /本题考察对.*的理解和应用能力/, desc: '模板化解析：本题考察对...的理解和应用能力' },
        { pattern: /这是.*的基本公式，需要牢记/, desc: '模板化解析：这是...的基本公式，需要牢记' },
        { pattern: /解析：根据知识点的定义和性质判断/, desc: '空模板解析：根据知识点的定义和性质判断' },
    ]
};

const gradeConfig = {
    g1: {
        name: '初一',
        subjects: [
            { key: 'math', name: '数学' },
            { key: 'chinese', name: '语文' },
            { key: 'english', name: '英语' },
            { key: 'history', name: '历史' },
            { key: 'geography', name: '地理' },
            { key: 'biology', name: '生物' },
            { key: 'daofa', name: '道德与法治' },
        ]
    },
    g2: {
        name: '初二',
        subjects: [
            { key: 'math', name: '数学' },
            { key: 'chinese', name: '语文' },
            { key: 'english', name: '英语' },
            { key: 'physics', name: '物理' },
            { key: 'history', name: '历史' },
            { key: 'geography', name: '地理' },
            { key: 'biology', name: '生物' },
            { key: 'daofa', name: '道德与法治' },
        ]
    }
};

function checkQuestion(question, answer) {
    const issues = [];
    const q = question || '';
    const a = answer || '';

    for (const [category, patterns] of Object.entries(badPatterns)) {
        for (const item of patterns) {
            const regex = typeof item.pattern === 'string' ? new RegExp(item.pattern) : item.pattern;
            if (regex.test(q) || regex.test(a)) {
                issues.push({
                    category,
                    desc: item.desc,
                    question: q.substring(0, 80).replace(/\n/g, ' '),
                    answer: a.substring(0, 80).replace(/\n/g, ' ')
                });
                break;
            }
        }
    }

    return issues;
}

function analyzeFile(filePath) {
    const fileName = path.basename(filePath);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const stats = {
        fileName,
        total: data.length,
        issues: [],
        issueCount: 0,
        categories: {},
        duplicateQuestions: [],
        duplicateCount: 0
    };

    const questionSet = new Set();

    data.forEach((q, idx) => {
        const qText = q.question || '';
        const aText = q.answer || '';

        const issues = checkQuestion(qText, aText);

        if (issues.length > 0) {
            stats.issues.push({
                id: q.id,
                index: idx + 1,
                issues
            });
            stats.issueCount += issues.length;

            issues.forEach(iss => {
                if (!stats.categories[iss.category]) {
                    stats.categories[iss.category] = 0;
                }
                stats.categories[iss.category]++;
            });
        }

        const qKey = qText.substring(0, 50);
        if (questionSet.has(qKey)) {
            stats.duplicateQuestions.push({
                id: q.id,
                question: qText.substring(0, 60)
            });
        } else {
            questionSet.add(qKey);
        }
    });

    stats.duplicateCount = stats.duplicateQuestions.length;

    return stats;
}

function getKnowledgeIds(gradeKey, subjectKey, semester) {
    const fileName = `${gradeKey}_${subjectKey}_${semester}.json`;
    const filePath = path.join(KNOWLEDGE_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
        return [];
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data.map(item => item.id);
    } catch (e) {
        return [];
    }
}

function analyzeSemester(gradeKey, subjectKey, semester) {
    const knowledgeIds = getKnowledgeIds(gradeKey, subjectKey, semester);
    
    const files = [];
    knowledgeIds.forEach(kid => {
        const fileName = `${kid}_010.json`;
        const filePath = path.join(EXAMPLE_DIR, fileName);
        if (fs.existsSync(filePath)) {
            files.push(fileName);
        }
    });

    const fileResults = [];
    let totalQuestions = 0;
    let totalIssues = 0;
    const allCategories = {};

    files.forEach(fileName => {
        const filePath = path.join(EXAMPLE_DIR, fileName);
        const stats = analyzeFile(filePath);
        totalQuestions += stats.total;
        totalIssues += stats.issueCount;

        Object.entries(stats.categories).forEach(([cat, count]) => {
            allCategories[cat] = (allCategories[cat] || 0) + count;
        });

        fileResults.push(stats);
    });

    return {
        semester,
        semesterName: semester === 'upper' ? '上册' : '下册',
        knowledgeCount: knowledgeIds.length,
        fileCount: files.length,
        missingFiles: knowledgeIds.length - files.length,
        totalQuestions,
        totalIssues,
        passRate: totalQuestions > 0 ? ((1 - totalIssues / totalQuestions) * 100).toFixed(2) : 100,
        categories: allCategories,
        problemFiles: fileResults.filter(f => f.issueCount > 0)
    };
}

function analyzeSubject(gradeKey, subjectKey, subjectName) {
    const upperResult = analyzeSemester(gradeKey, subjectKey, 'upper');
    const lowerResult = analyzeSemester(gradeKey, subjectKey, 'lower');
    
    return {
        subjectKey,
        subjectName,
        upper: upperResult,
        lower: lowerResult,
        totalKnowledge: upperResult.knowledgeCount + lowerResult.knowledgeCount,
        totalFiles: upperResult.fileCount + lowerResult.fileCount,
        totalMissing: upperResult.missingFiles + lowerResult.missingFiles,
        totalQuestions: upperResult.totalQuestions + lowerResult.totalQuestions,
        totalIssues: upperResult.totalIssues + lowerResult.totalIssues,
        passRate: (upperResult.totalQuestions + lowerResult.totalQuestions) > 0
            ? ((1 - (upperResult.totalIssues + lowerResult.totalIssues) / (upperResult.totalQuestions + lowerResult.totalQuestions)) * 100).toFixed(2)
            : 100
    };
}

function analyzeGrade(gradeKey) {
    const config = gradeConfig[gradeKey];
    const subjects = [];
    
    config.subjects.forEach(subj => {
        const result = analyzeSubject(gradeKey, subj.key, subj.name);
        subjects.push(result);
    });
    
    const totalKnowledge = subjects.reduce((s, r) => s + r.totalKnowledge, 0);
    const totalFiles = subjects.reduce((s, r) => s + r.totalFiles, 0);
    const totalMissing = subjects.reduce((s, r) => s + r.totalMissing, 0);
    const totalQuestions = subjects.reduce((s, r) => s + r.totalQuestions, 0);
    const totalIssues = subjects.reduce((s, r) => s + r.totalIssues, 0);
    
    return {
        gradeKey,
        gradeName: config.name,
        subjects,
        totalKnowledge,
        totalFiles,
        totalMissing,
        totalQuestions,
        totalIssues,
        passRate: totalQuestions > 0 ? ((1 - totalIssues / totalQuestions) * 100).toFixed(2) : 100
    };
}

function generateMarkdownReport() {
    let md = `# 例题质量校验报告

生成时间: ${new Date().toLocaleString('zh-CN')}

## 校验说明

本报告对所有例题进行低质量检测，包括以下检查项：

| 检查类别 | 说明 |
|----------|------|
| emptyAnswer | 空模板答案（如"答案和解析..."） |
| redundancy | 冗余表述（如"的主要特征的主要特征"） |
| incomplete | 不完整题目 |
| irrelevant | 材料与知识点不相关或分类错误 |
| template | 模板化表述（如"关于...的某个说法"） |

---

## 总体概况

`;

    const gradeResults = [];
    let grandTotalKnowledge = 0;
    let grandTotalFiles = 0;
    let grandTotalMissing = 0;
    let grandTotalQuestions = 0;
    let grandTotalIssues = 0;
    const grandCategories = {};

    Object.keys(gradeConfig).forEach(gradeKey => {
        const result = analyzeGrade(gradeKey);
        gradeResults.push(result);
        grandTotalKnowledge += result.totalKnowledge;
        grandTotalFiles += result.totalFiles;
        grandTotalMissing += result.totalMissing;
        grandTotalQuestions += result.totalQuestions;
        grandTotalIssues += result.totalIssues;
        
        result.subjects.forEach(subj => {
            [subj.upper.categories, subj.lower.categories].forEach(cats => {
                Object.entries(cats).forEach(([cat, count]) => {
                    grandCategories[cat] = (grandCategories[cat] || 0) + count;
                });
            });
        });
    });

    const overallPassRate = grandTotalQuestions > 0 
        ? ((1 - grandTotalIssues / grandTotalQuestions) * 100).toFixed(2) 
        : 100;

    md += `| 年级 | 知识点数 | 例题文件 | 缺失 | 题目总数 | 问题数 | 通过率 |
|------|----------|----------|------|----------|--------|--------|
`;

    gradeResults.forEach(r => {
        md += `| ${r.gradeName} | ${r.totalKnowledge} | ${r.totalFiles} | ${r.totalMissing} | ${r.totalQuestions} | ${r.totalIssues} | ${r.passRate}% |
`;
    });

    md += `| **总计** | **${grandTotalKnowledge}** | **${grandTotalFiles}** | **${grandTotalMissing}** | **${grandTotalQuestions}** | **${grandTotalIssues}** | **${overallPassRate}%** |

---

## 问题分类统计

| 问题类别 | 数量 |
|----------|------|
`;

    for (const [cat, count] of Object.entries(grandCategories).sort((a, b) => b[1] - a[1])) {
        md += `| ${cat} | ${count} |
`;
    }

    gradeResults.forEach(grade => {
        md += `\n---\n\n## ${grade.gradeName} 详细报告\n\n`;

        md += `### ${grade.gradeName}各科目统计\n\n`;
        md += `| 科目 | 上册知识点 | 上册文件 | 上册题数 | 上册问题 | 上册通过率 | 下册知识点 | 下册文件 | 下册题数 | 下册问题 | 下册通过率 | 合计问题 | 总通过率 |\n`;
        md += `|------|------------|----------|----------|----------|------------|------------|----------|----------|----------|------------|----------|----------|\n`;
        
        grade.subjects.forEach(subj => {
            md += `| ${subj.subjectName} | ${subj.upper.knowledgeCount} | ${subj.upper.fileCount} | ${subj.upper.totalQuestions} | ${subj.upper.totalIssues} | ${subj.upper.passRate}% | ${subj.lower.knowledgeCount} | ${subj.lower.fileCount} | ${subj.lower.totalQuestions} | ${subj.lower.totalIssues} | ${subj.lower.passRate}% | ${subj.totalIssues} | ${subj.passRate}% |\n`;
        });

        grade.subjects.forEach(subj => {
            const allProblemFiles = [...subj.upper.problemFiles, ...subj.lower.problemFiles];
            if (allProblemFiles.length === 0) return;

            md += `\n### ${grade.gradeName}${subj.subjectName} 问题详情\n\n`;

            [subj.upper, subj.lower].forEach(sem => {
                if (sem.problemFiles.length === 0) return;
                md += `\n#### ${sem.semesterName}\n\n`;
                md += `⚠️ 发现 ${sem.problemFiles.length} 个文件存在问题：\n\n`;

                sem.problemFiles.forEach(f => {
                    md += `##### ${f.fileName}\n\n`;
                    md += `- 题目总数: ${f.total}\n`;
                    md += `- 问题数: ${f.issueCount}\n`;
                    md += `- 问题分类: ${Object.entries(f.categories).map(([k, v]) => `${k}:${v}`).join(', ')}\n`;

                    if (f.duplicateCount > 0) {
                        md += `- 重复题目: ${f.duplicateCount}道\n`;
                    }

                    md += `\n**问题详情:**\n\n`;
                    md += `| 题号 | 问题描述 | 题目内容 |\n`;
                    md += `|------|----------|----------|\n`;

                    f.issues.forEach(iss => {
                        const issueDescs = iss.issues.map(i => i.desc).join('; ');
                        const qText = iss.question || '';
                        md += `| ${iss.id} | ${issueDescs} | ${qText.substring(0, 40)}... |\n`;
                    });

                    if (f.duplicateQuestions && f.duplicateQuestions.length > 0) {
                        md += `\n**重复题目:**\n`;
                        f.duplicateQuestions.forEach(dq => {
                            md += `- ${dq.id}: ${dq.question}...\n`;
                        });
                    }

                    md += `\n`;
                });
            });
        });

        const allPassed = grade.subjects.every(s => s.totalIssues === 0);
        if (allPassed) {
            md += `\n✅ ${grade.gradeName}所有科目例题质量合格，无问题！\n`;
        }
    });

    md += `\n---\n\n## 修复建议\n\n`;

    if (grandTotalIssues === 0) {
        md += `✅ 所有例题质量合格，无需修复！\n`;
    } else {
        md += `待修复问题总数: **${grandTotalIssues}**\n\n`;

        const categorySuggestions = {
            template: '模板化表述问题：需要重新生成题目，使用更具体的描述',
            emptyAnswer: '空模板答案问题：需要填充具体答案内容或删除空模板题',
            answerLeak: '答案泄露问题：题目中不应包含答案或解析提示',
            wrongCategory: '分类错误问题：需要修正知识点归属，如细菌真菌不是动物',
            redundancy: '冗余表述问题：需要删除重复的词汇',
            incomplete: '不完整题目：需要补充完整题目内容',
            irrelevant: '无关内容问题：需要更换为与知识点相关的材料',
            choiceOption: '选择题选项问题：需要完善选项或修正格式'
        };

        for (const [cat, count] of Object.entries(grandCategories).sort((a, b) => b[1] - a[1])) {
            md += `### ${cat} (${count}处)\n`;
            md += `${categorySuggestions[cat] || '需要检查修复'}\n\n`;
        }
    }

    md += `\n---\n\n**报告生成完毕**\n`;

    return md;
}

console.log('开始校验例题质量...\n');

const report = generateMarkdownReport();
fs.writeFileSync(OUTPUT_FILE, report, 'utf8');

console.log(`报告已生成: ${OUTPUT_FILE}`);

const gradeResults = [];
Object.keys(gradeConfig).forEach(gradeKey => {
    gradeResults.push(analyzeGrade(gradeKey));
});

console.log('\n各年级统计:');
gradeResults.forEach(r => {
    console.log(`  ${r.gradeName}: ${r.totalKnowledge}个知识点, ${r.totalFiles}个例题文件, ${r.totalMissing}个缺失, ${r.totalQuestions}道题, ${r.totalIssues}个问题, 通过率${r.passRate}%`);
});

const totalIssues = gradeResults.reduce((s, r) => s + r.totalIssues, 0);
console.log(`\n总计: ${totalIssues}个问题`);
