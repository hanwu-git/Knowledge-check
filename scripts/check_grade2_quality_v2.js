const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

// 低质量题目的特征模式
const badPatterns = [
    // 模板化问题
    '这是.*的正确描述',
    '与该知识点无关的错误说法',
    '完全相反的错误说法',
    '混淆概念的错误说法',
    '只需要记住结论，不需要理解原理',
    '只需要死记硬背',
    '是.*的重要概念',
    '是.*学习中的重要知识点',
    '掌握公式是解决.*问题的基础',
    '掌握.*是学习该知识点的关键',
    // 模板化选择题
    '的公式是？',
    '的公式是______',
    '的核心公式是',
    '错误选项',
    '其他公式',
    '没有公式',
    '错误的公式',
    '不存在',
    '任意值',
];

// 初二科目配置
const subjects = [
    { key: 'math', name: '数学' },
    { key: 'physics', name: '物理' },
    { key: 'english', name: '英语' },
    { key: 'chinese', name: '语文' },
    { key: 'history', name: '历史' },
    { key: 'geography', name: '地理' },
    { key: 'biology', name: '生物' },
    { key: 'daofa', name: '道德与法治' },
];

function analyzeSubjectFiles(subjectKey) {
    const allFiles = fs.readdirSync(EXAMPLE_DIR).filter(f => 
        f.startsWith(`g2_${subjectKey}_`) && f.endsWith('.json')
    );
    
    // 分类文件
    const normalFiles = [];   // 普通编号 g2_xxx_001-xxx
    const uFiles = [];        // 上册 g2_xxx_u001-xxx
    const lFiles = [];        // 下册 g2_xxx_l001-xxx
    const qualityFiles = [];  // 高质量版本
    const errorFiles = [];    // 命名错误的文件
    
    allFiles.forEach(f => {
        // 检查高质量版本
        if (f.includes('quality')) {
            qualityFiles.push(f);
            return;
        }
        
        // 检查命名错误
        if (f.includes('lg2_') || f.includes('ll') && !f.match(/_l\d+_010/)) {
            errorFiles.push(f);
            return;
        }
        
        // 提取知识点编号
        const normalMatch = f.match(new RegExp(`g2_${subjectKey}_(\\d+)_010`));
        const uMatch = f.match(new RegExp(`g2_${subjectKey}_u(\\d+)_010`));
        const lMatch = f.match(new RegExp(`g2_${subjectKey}_l(\\d+)_010`));
        
        if (uMatch) {
            uFiles.push({ file: f, num: parseInt(uMatch[1]) });
        } else if (lMatch) {
            lFiles.push({ file: f, num: parseInt(lMatch[1]) });
        } else if (normalMatch) {
            normalFiles.push({ file: f, num: parseInt(normalMatch[1]) });
        }
    });
    
    return {
        allFiles,
        normalFiles: normalFiles.sort((a,b) => a.num - b.num),
        uFiles: uFiles.sort((a,b) => a.num - b.num),
        lFiles: lFiles.sort((a,b) => a.num - b.num),
        qualityFiles,
        errorFiles,
        hasNormalDup: normalFiles.length > 0,
        hasErrorFiles: errorFiles.length > 0
    };
}

function analyzeQuestionQuality(files) {
    let total = 0;
    let bad = 0;
    let duplicate = 0;
    const questionSet = new Set();
    const badList = [];
    
    files.forEach(f => {
        try {
            const examples = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, f.file || f), 'utf8'));
            examples.forEach(ex => {
                total++;
                
                // 检查重复
                const qKey = ex.question.substring(0, 50);
                if (questionSet.has(qKey)) {
                    duplicate++;
                } else {
                    questionSet.add(qKey);
                }
                
                // 检查低质量
                let isBad = false;
                badPatterns.forEach(p => {
                    if (new RegExp(p).test(ex.question) || new RegExp(p).test(ex.answer)) {
                        isBad = true;
                    }
                });
                
                if (isBad) {
                    bad++;
                    if (badList.length < 3) {
                        badList.push({
                            file: f.file || f,
                            q: ex.question.substring(0, 60).replace(/\n/g, ' ')
                        });
                    }
                }
            });
        } catch(e) {
            console.log(`  读取文件错误: ${f.file || f}`);
        }
    });
    
    return { total, bad, duplicate, badList };
}

// 生成报告
console.log('=' .repeat(80));
console.log('📊 初二各科目题目质量检查报告');
console.log('=' .repeat(80));
console.log('检查时间:', new Date().toLocaleString('zh-CN'));
console.log('');

const report = [];

subjects.forEach(s => {
    const fileAnalysis = analyzeSubjectFiles(s.key);
    
    // 分析各版本题目质量
    const normalQuality = analyzeQuestionQuality(fileAnalysis.normalFiles);
    const uQuality = analyzeQuestionQuality(fileAnalysis.uFiles);
    const lQuality = analyzeQuestionQuality(fileAnalysis.lFiles);
    const qualityQuality = analyzeQuestionQuality(fileAnalysis.qualityFiles);
    
    // 判断问题
    const problems = [];
    if (fileAnalysis.hasNormalDup) {
        problems.push(`有普通编号文件(${fileAnalysis.normalFiles.length}个)与u/l前缀文件重复`);
    }
    if (fileAnalysis.hasErrorFiles) {
        problems.push(`有命名错误的文件(${fileAnalysis.errorFiles.length}个)`);
    }
    if (normalQuality.bad > 0) {
        problems.push(`普通编号文件有${normalQuality.bad}道低质量题目`);
    }
    if (uQuality.bad > 0) {
        problems.push(`上册文件有${uQuality.bad}道低质量题目`);
    }
    if (lQuality.bad > 0) {
        problems.push(`下册文件有${lQuality.bad}道低质量题目`);
    }
    
    const result = {
        subject: s,
        fileAnalysis,
        normalQuality,
        uQuality,
        lQuality,
        qualityQuality,
        problems,
        needFix: problems.length > 0
    };
    report.push(result);
    
    // 输出详细信息
    console.log('\n' + '='.repeat(80));
    console.log(`📚 ${s.name} (g2_${s.key}_)`);
    console.log('=' .repeat(80));
    
    console.log('\n📁 文件统计:');
    console.log(`   总文件数: ${fileAnalysis.allFiles.length}`);
    console.log(`   普通编号: ${fileAnalysis.normalFiles.length} 个 ${fileAnalysis.normalFiles.length > 0 ? '(⚠️ 可能重复)' : ''}`);
    console.log(`   上册(u): ${fileAnalysis.uFiles.length} 个`);
    console.log(`   下册(l): ${fileAnalysis.lFiles.length} 个`);
    console.log(`   高质量版: ${fileAnalysis.qualityFiles.length} 个`);
    console.log(`   命名错误: ${fileAnalysis.errorFiles.length} 个 ${fileAnalysis.errorFiles.length > 0 ? '(⚠️ 需删除)' : ''}`);
    
    if (fileAnalysis.normalFiles.length > 0) {
        console.log(`   普通编号范围: ${fileAnalysis.normalFiles[0].num}-${fileAnalysis.normalFiles[fileAnalysis.normalFiles.length-1].num}`);
    }
    if (fileAnalysis.uFiles.length > 0) {
        console.log(`   上册编号范围: u${fileAnalysis.uFiles[0].num}-u${fileAnalysis.uFiles[fileAnalysis.uFiles.length-1].num}`);
    }
    if (fileAnalysis.lFiles.length > 0) {
        console.log(`   下册编号范围: l${fileAnalysis.lFiles[0].num}-l${fileAnalysis.lFiles[fileAnalysis.lFiles.length-1].num}`);
    }
    
    console.log('\n📊 题目质量:');
    if (normalQuality.total > 0) {
        const pct = (normalQuality.bad / normalQuality.total * 100).toFixed(1);
        console.log(`   普通编号: ${normalQuality.total}题, 低质量${normalQuality.bad}题 (${pct}%) ${normalQuality.bad > 0 ? '❌' : '✅'}`);
    }
    if (uQuality.total > 0) {
        const pct = (uQuality.bad / uQuality.total * 100).toFixed(1);
        console.log(`   上册(u): ${uQuality.total}题, 低质量${uQuality.bad}题 (${pct}%) ${uQuality.bad > 0 ? '❌' : '✅'}`);
    }
    if (lQuality.total > 0) {
        const pct = (lQuality.bad / lQuality.total * 100).toFixed(1);
        console.log(`   下册(l): ${lQuality.total}题, 低质量${lQuality.bad}题 (${pct}%) ${lQuality.bad > 0 ? '❌' : '✅'}`);
    }
    if (qualityQuality.total > 0) {
        const pct = (qualityQuality.bad / qualityQuality.total * 100).toFixed(1);
        console.log(`   高质量版: ${qualityQuality.total}题, 低质量${qualityQuality.bad}题 (${pct}%) ✅`);
    }
    
    if (problems.length > 0) {
        console.log('\n⚠️  问题:');
        problems.forEach(p => console.log(`   - ${p}`));
    } else {
        console.log('\n✅ 无问题');
    }
});

// 汇总表格
console.log('\n\n' + '='.repeat(80));
console.log('📋 汇总表格');
console.log('=' .repeat(80));

console.log('\n| 科目 | 普通编号 | 上册(u) | 下册(l) | 高质量版 | 错误文件 | 需处理 |');
console.log('|------|----------|---------|---------|----------|----------|--------|');

report.forEach(r => {
    const normalStatus = r.normalQuality.bad > 0 || r.fileAnalysis.normalFiles.length > 0 ? '❌' : '-';
    const uStatus = r.uQuality.bad > 0 ? '❌' : (r.uQuality.total > 0 ? '✅' : '-');
    const lStatus = r.lQuality.bad > 0 ? '❌' : (r.lQuality.total > 0 ? '✅' : '-');
    const qStatus = r.qualityQuality.total > 0 ? '✅' : '-';
    const eStatus = r.fileAnalysis.errorFiles.length > 0 ? '❌' : '-';
    
    console.log(`| ${r.subject.name} | ${r.fileAnalysis.normalFiles.length > 0 ? r.fileAnalysis.normalFiles.length + '个' + normalStatus : '-'} | ${r.uFiles.length > 0 ? r.uFiles.length + '个' + uStatus : '-'} | ${r.lFiles.length > 0 ? r.lFiles.length + '个' + lStatus : '-'} | ${r.qualityQuality.total > 0 ? r.qualityQuality.total + '题' + qStatus : '-'} | ${r.fileAnalysis.errorFiles.length > 0 ? r.fileAnalysis.errorFiles.length + '个' + eStatus : '-'} | ${r.needFix ? '是' : '否'} |`);
});

// 待处理清单
console.log('\n\n' + '='.repeat(80));
console.log('📌 待处理科目清单');
console.log('=' .repeat(80));

const needFixList = report.filter(r => r.needFix);

if (needFixList.length === 0) {
    console.log('\n✅ 所有科目题目质量合格，无需处理！');
} else {
    needFixList.forEach(r => {
        console.log(`\n📚 ${r.subject.name}:`);
        
        if (r.fileAnalysis.normalFiles.length > 0) {
            console.log(`   ❌ 有普通编号文件 ${r.fileAnalysis.normalFiles.length} 个，需删除`);
            console.log(`      文件: ${r.fileAnalysis.normalFiles.slice(0, 5).map(f => f.file).join(', ')}...`);
        }
        
        if (r.fileAnalysis.errorFiles.length > 0) {
            console.log(`   ❌ 有命名错误文件 ${r.fileAnalysis.errorFiles.length} 个，需删除`);
            console.log(`      文件: ${r.fileAnalysis.errorFiles.slice(0, 5).join(', ')}...`);
        }
        
        if (r.normalQuality.bad > 0) {
            console.log(`   ❌ 普通编号文件有 ${r.normalQuality.bad} 道低质量题目 (${(r.normalQuality.bad/r.normalQuality.total*100).toFixed(1)}%)`);
        }
        
        if (r.uQuality.bad > 0) {
            console.log(`   ❌ 上册文件有 ${r.uQuality.bad} 道低质量题目 (${(r.uQuality.bad/r.uQuality.total*100).toFixed(1)}%)`);
        }
        
        if (r.lQuality.bad > 0) {
            console.log(`   ❌ 下册文件有 ${r.lQuality.bad} 道低质量题目 (${(r.lQuality.bad/r.lQuality.total*100).toFixed(1)}%)`);
        }
        
        if (r.qualityQuality.total > 0) {
            console.log(`   ✅ 已有高质量版本: ${r.qualityQuality.total} 题`);
        }
    });
    
    // 处理建议
    console.log('\n\n' + '='.repeat(80));
    console.log('💡 处理建议');
    console.log('=' .repeat(80));
    
    needFixList.forEach(r => {
        console.log(`\n${r.subject.name}:`);
        
        if (r.fileAnalysis.normalFiles.length > 0) {
            console.log(`  1. 删除普通编号文件 ${r.fileAnalysis.normalFiles.length} 个`);
        }
        
        if (r.fileAnalysis.errorFiles.length > 0) {
            console.log(`  2. 删除命名错误文件 ${r.fileAnalysis.errorFiles.length} 个`);
        }
        
        if (r.qualityQuality.total > 0) {
            console.log(`  ✅ 已有高质量版本，删除旧版后即可`);
        } else if (r.uQuality.bad > 0 || r.lQuality.bad > 0) {
            console.log(`  ⚠️  需重新生成高质量题目`);
        }
    });
}