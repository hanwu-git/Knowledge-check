const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');
const OUTPUT_FILE = path.join(__dirname, '..', 'quality_report.md');

// 低质量题目检测模式（精确版）
const badPatterns = {
    // 空模板答案
    emptyAnswer: [
        { pattern: /翻译题答案和解析/, desc: '空模板答案：翻译题答案和解析' },
        { pattern: /赏析题答案和解析/, desc: '空模板答案：赏析题答案和解析' },
        { pattern: /解答题答案和解析/, desc: '空模板答案：解答题答案和解析' },
        { pattern: /根据知识点填写/, desc: '空模板答案：根据知识点填写' },
        { pattern: '答案和解析...', desc: '空模板答案：答案和解析...' },
    ],
    // 冗余表述
    redundancy: [
        { pattern: /的特征的主要特征/, desc: '冗余表述：的主要特征的主要特征' },
        { pattern: /请简述.*请简述/, desc: '重复表述：请简述重复' },
    ],
    // 不完整题目
    incomplete: [
        { pattern: /【[^】]+】[^】]*：。\s*（/, desc: '题目不完整：冒号后无内容' },
        { pattern: /：\.\(\)/, desc: '题目不完整：冒号后只有点' },
        { pattern: /^【[^】]+】[^：]*：\.$/m, desc: '题目以句号结尾不完整' },
    ],
    // 无关/错误内容
    irrelevant: [
        { pattern: /捡拾垃圾.*网络生活/, desc: '材料与知识点不相关：捡拾垃圾配网络生活' },
        { pattern: /捡拾垃圾.*终身学习/, desc: '材料与知识点不相关：捡拾垃圾配终身学习' },
        { pattern: /捡拾垃圾.*正确对待挫折/, desc: '材料与知识点不相关：捡拾垃圾配挫折' },
        { pattern: /细菌.*代表动物/, desc: '分类错误：细菌被称为动物' },
        { pattern: /真菌.*代表动物/, desc: '分类错误：真菌被称为动物' },
    ],
    // 模板化表述
    template: [
        { pattern: '只需要死记硬背', desc: '模板化表述：只需要死记硬背' },
        { pattern: '只需要记住结论，不需要理解原理', desc: '模板化表述：只需要记住结论' },
        { pattern: '与其他知识点没有联系', desc: '错误表述：与其他知识点没有联系' },
    ]
};

// 科目配置
const subjects = [
    { key: 'g1', name: '初一', prefix: 'g1_' },
    { key: 'g2', name: '初二', prefix: 'g2_' },
];

function checkQuestion(question, answer, fileName, qId) {
    const issues = [];

    for (const [category, patterns] of Object.entries(badPatterns)) {
        for (const item of patterns) {
            const pattern = typeof item.pattern === 'string' ? item.pattern : item.pattern.source;
            if (question.includes(pattern) || answer.includes(pattern)) {
                issues.push({
                    category,
                    desc: item.desc,
                    question: question.substring(0, 80).replace(/\n/g, ' '),
                    answer: answer.substring(0, 80).replace(/\n/g, ' ')
                });
                break; // 同一类别只记录一次
            }
        }
    }

    return issues;
}

function analyzeFile(filePath) {
    const fileName = path.basename(filePath);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const stats = {
        total: data.length,
        issues: [],
        issueCount: 0,
        categories: {}
    };

    const questionSet = new Set();
    const duplicateQuestions = [];

    data.forEach((q, idx) => {
        const qText = q.question;
        const aText = q.answer || '';

        // 检查问题
        const issues = checkQuestion(qText, aText, fileName, q.id);

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

        // 检查重复题目
        const qKey = qText.substring(0, 50);
        if (questionSet.has(qKey)) {
            duplicateQuestions.push({
                id: q.id,
                question: qText.substring(0, 60)
            });
        } else {
            questionSet.add(qKey);
        }
    });

    if (duplicateQuestions.length > 0) {
        stats.duplicateQuestions = duplicateQuestions;
        stats.duplicateCount = duplicateQuestions.length;
    }

    return stats;
}

function analyzeSubject(prefix, subjectName) {
    const files = fs.readdirSync(EXAMPLE_DIR)
        .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
        .map(f => path.join(EXAMPLE_DIR, f));

    const fileResults = [];
    let totalQuestions = 0;
    let totalIssues = 0;
    const allCategories = {};

    files.forEach(filePath => {
        const stats = analyzeFile(filePath);
        totalQuestions += stats.total;
        totalIssues += stats.issueCount;

        Object.entries(stats.categories).forEach(([cat, count]) => {
            allCategories[cat] = (allCategories[cat] || 0) + count;
        });

        fileResults.push({
            file: path.basename(filePath),
            stats
        });
    });

    return {
        subjectName,
        prefix,
        totalFiles: files.length,
        totalQuestions,
        totalIssues,
        passRate: totalQuestions > 0 ? ((1 - totalIssues / totalQuestions) * 100).toFixed(2) : 100,
        categories: allCategories,
        files: fileResults.filter(f => f.stats.issueCount > 0)
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
| template | 模板化表述 |

---

## 总体概况

`;

    let grandTotal = 0;
    let grandIssues = 0;
    const allResults = [];

    subjects.forEach(s => {
        const result = analyzeSubject(s.prefix, s.name);
        allResults.push(result);
        grandTotal += result.totalQuestions;
        grandIssues += result.totalIssues;
    });

    const overallPassRate = grandTotal > 0 ? ((1 - grandIssues / grandTotal) * 100).toFixed(2) : 100;

    md += `| 年级 | 文件数 | 题目总数 | 问题数 | 通过率 |
|------|--------|----------|--------|--------|
`;

    allResults.forEach(r => {
        md += `| ${r.subjectName} | ${r.totalFiles} | ${r.totalQuestions} | ${r.totalIssues} | ${r.passRate}% |
`;
    });

    md += `| **总计** | **${allResults.reduce((s, r) => s + r.totalFiles, 0)}** | **${grandTotal}** | **${grandIssues}** | **${overallPassRate}%** |
`;

    md += `\n---\n\n## 问题分类统计\n\n`;

    // 合并所有类别
    const totalCategories = {};
    allResults.forEach(r => {
        Object.entries(r.categories).forEach(([cat, count]) => {
            totalCategories[cat] = (totalCategories[cat] || 0) + count;
        });
    });

    md += `| 问题类别 | 数量 |
|----------|------|
`;
    for (const [cat, count] of Object.entries(totalCategories).sort((a, b) => b[1] - a[1])) {
        md += `| ${cat} | ${count} |
`;
    }

    // 按科目详细报告
    allResults.forEach(r => {
        md += `\n---\n\n## ${r.subjectName} 详细报告\n\n`;

        if (r.files.length === 0) {
            md += `✅ 所有文件质量合格，无问题！
`;
        } else {
            md += `⚠️ 发现 ${r.files.length} 个文件存在问题：
\n`;

            r.files.forEach(f => {
                md += `### ${f.file}\n\n`;
                md += `- 题目总数: ${f.stats.total}\n`;
                md += `- 问题数: ${f.stats.issueCount}\n`;
                md += `- 问题分类: ${Object.entries(f.stats.categories).map(([k, v]) => `${k}:${v}`).join(', ')}\n`;

                if (f.stats.duplicateCount > 0) {
                    md += `- 重复题目: ${f.stats.duplicateCount}道\n`;
                }

                md += `\n**问题详情:**\n\n`;
                md += `| 题号 | 问题描述 | 题目内容 |
|------|----------|----------|
`;

                f.stats.issues.forEach(iss => {
                    const issueDescs = iss.issues.map(i => i.desc).join('; ');
                    const qText = iss.question || '';
                    md += `| ${iss.id} | ${issueDescs} | ${qText.substring(0, 40)}... |
`;
                });

                if (f.stats.duplicateQuestions) {
                    md += `\n**重复题目:**\n`;
                    f.stats.duplicateQuestions.forEach(dq => {
                        md += `- ${dq.id}: ${dq.question}...\n`;
                    });
                }

                md += `\n`;
            });
        }
    });

    md += `\n---\n\n## 修复建议\n\n`;

    if (grandIssues === 0) {
        md += `✅ 所有例题质量合格，无需修复！
`;
    } else {
        md += `待修复问题总数: **${grandIssues}**\n\n`;

        // 按类别提供修复建议
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

        for (const [cat, count] of Object.entries(totalCategories).sort((a, b) => b[1] - a[1])) {
            md += `### ${cat} (${count}处)\n`;
            md += `${categorySuggestions[cat] || '需要检查修复'}\n\n`;
        }
    }

    md += `\n---\n\n**报告生成完毕**
`;

    return md;
}

// 执行检查并生成报告
console.log('开始校验例题质量...\n');

let report = generateMarkdownReport();
fs.writeFileSync(OUTPUT_FILE, report, 'utf8');

console.log(`报告已生成: ${OUTPUT_FILE}`);
console.log('\n按文件统计:');