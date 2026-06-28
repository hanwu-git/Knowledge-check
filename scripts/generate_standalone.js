// 生成可直接打开的HTML文件（按科目分离）
const fs = require('fs');
const path = require('path');

const dataDir = 'data';
const knowledgeDir = path.join(dataDir, 'knowledge');
const examplesDir = path.join(dataDir, 'examples');

// 读取版本信息
const versionFile = 'version.json';
let versionInfo = { version: '1.0.0', lastUpdate: '' };
if (fs.existsSync(versionFile)) {
    versionInfo = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
}

// 更新版本号（补丁版本+1）和更新日期
function bumpVersion() {
    const parts = versionInfo.version.split('.');
    parts[2] = parseInt(parts[2]) + 1;
    versionInfo.version = parts.join('.');
    versionInfo.lastUpdate = new Date().toISOString().split('T')[0];
    fs.writeFileSync(versionFile, JSON.stringify(versionInfo, null, 2), 'utf8');
    console.log(`版本更新: v${versionInfo.version} (${versionInfo.lastUpdate})`);
}

bumpVersion();

// 年级配置
const grades = {
    grade1: {
        name: '初一',
        shortName: '七',
        prefix: 'g1_',
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g1_math_upper.json', 'g1_math_lower.json'] },
            english: { name: '英语', color: 'green', files: ['g1_english_upper.json', 'g1_english_lower.json'] },
            chinese: { name: '语文', color: 'red', files: ['g1_chinese_upper.json', 'g1_chinese_lower.json'] },
            chinese_recite: { name: '语文重点背诵', color: 'red', files: ['g1_chinese_recite_upper.json', 'g1_chinese_recite_lower.json'], noExamples: true },
            english_vocab: { name: '英语词汇背诵', color: 'green', files: ['g1_english_vocab_upper.json', 'g1_english_vocab_lower.json'], noExamples: true },
            history: { name: '历史', color: 'orange', files: ['g1_history_upper.json', 'g1_history_lower.json'] },
            geography: { name: '地理', color: 'yellow', files: ['g1_geography_upper.json', 'g1_geography_lower.json'] },
            biology: { name: '生物', color: 'teal', files: ['g1_biology_upper.json', 'g1_biology_lower.json'] },
            daofa: { name: '道德与法治', color: 'pink', files: ['g1_daofa_upper.json', 'g1_daofa_lower.json'] }
        }
    },
    grade2: {
        name: '初二',
        shortName: '八',
        prefix: 'g2_',
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g2_math_upper.json', 'g2_math_lower.json'] },
            physics: { name: '物理', color: 'purple', files: ['g2_physics_upper.json', 'g2_physics_lower.json'] },
            english: { name: '英语', color: 'green', files: ['g2_english_upper.json', 'g2_english_lower.json'] },
            chinese: { name: '语文', color: 'red', files: ['g2_chinese_upper.json', 'g2_chinese_lower.json'] },
            chinese_recite: { name: '语文重点背诵', color: 'red', files: ['g2_chinese_recite_upper.json', 'g2_chinese_recite_lower.json'], noExamples: true },
            english_vocab: { name: '英语词汇背诵', color: 'green', files: ['g2_english_vocab_upper.json', 'g2_english_vocab_lower.json'], noExamples: true },
            history: { name: '历史', color: 'orange', files: ['g2_history_upper.json', 'g2_history_lower.json'] },
            geography: { name: '地理', color: 'yellow', files: ['g2_geography_upper.json', 'g2_geography_lower.json'] },
            biology: { name: '生物', color: 'teal', files: ['g2_biology_upper.json', 'g2_biology_lower.json'] },
            daofa: { name: '道德与法治', color: 'pink', files: ['g2_daofa_upper.json', 'g2_daofa_lower.json'] }
        }
    }
};

// 扁平化所有科目（用于生成页面）
const allSubjects = {};
Object.entries(grades).forEach(([gradeKey, grade]) => {
    Object.entries(grade.subjects).forEach(([subjKey, subject]) => {
        const fullKey = `${gradeKey}_${subjKey}`;
        allSubjects[fullKey] = {
            ...subject,
            grade: gradeKey,
            gradeName: grade.name,
            gradePrefix: grade.prefix,
            subjectKey: subjKey
        };
    });
});

// 加载指定文件的知识数据
function loadKnowledgeByFiles(files) {
    const allData = [];
    files.forEach((f, index) => {
        const filePath = path.join(knowledgeDir, f);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const semester = index === 0 ? 'upper' : 'lower';
            data.forEach(item => item.semester = semester);
            allData.push(...data);
        }
    });
    return allData;
}

// 加载指定科目的例题
function loadExamplesBySubject(gradePrefix, subjectKey) {
    const examples = [];
    const allFiles = fs.readdirSync(examplesDir).filter(f => f.startsWith(`${gradePrefix}${subjectKey}_`) && f.endsWith('.json'));
    
    // 检查是否有单独的例题文件（格式：g2_math_001_010.json）
    const individualPattern = new RegExp(`^${gradePrefix}${subjectKey}_\\d+_\\d+\\.json$`);
    const individualFiles = allFiles.filter(f => individualPattern.test(f));
    
    let filesToLoad = [];
    if (individualFiles.length > 0) {
        // 有单独文件，优先使用单独文件（排除汇总文件）
        filesToLoad = individualFiles;
    } else {
        // 没有单独文件，使用所有匹配的文件（包括 quality 文件）
        filesToLoad = allFiles;
    }
    
    filesToLoad.forEach(f => {
        const filePath = path.join(examplesDir, f);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
            examples.push(...data);
        }
    });
    return examples;
}

// 统计所有知识点数量
let totalKnowledge = 0;
let totalExamples = 0;
Object.entries(allSubjects).forEach(([key, subject]) => {
    const knowledge = loadKnowledgeByFiles(subject.files);
    const examples = subject.noExamples ? [] : loadExamplesBySubject(subject.gradePrefix, subject.subjectKey);
    totalKnowledge += knowledge.length;
    totalExamples += examples.length;
    subject.knowledge = knowledge;
    subject.examples = examples;
    subject.count = knowledge.length;
});

console.log(`加载知识点: ${totalKnowledge}`);
console.log(`加载例题: ${totalExamples}`);

// ==================== 生成 index.html ====================
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>初中知识点背诵系统</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#3B82F6',
                        secondary: '#6366F1',
                        accent: '#F59E0B',
                        success: '#10B981',
                        danger: '#EF4444',
                        warning: '#F97316',
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="page-container">
        <header class="page-header">
            <h1 class="page-title">📚 初中知识点背诵系统</h1>
            <p class="page-subtitle">选择年级和科目，开始学习之旅</p>
        </header>

        <div class="flex justify-center mb-8">
            <a href="wrongbook.html" class="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span class="font-medium">我的错题本</span>
                <span id="wrongbook-count" class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">0</span>
            </a>
        </div>

        <div id="continue-study" class="card p-6 mb-6 hidden">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-2xl">
                        📖
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">继续学习</h3>
                        <p id="last-study-info" class="text-gray-500 text-sm mt-1"></p>
                    </div>
                </div>
                <button id="btn-continue" class="btn btn-primary px-6 py-2">继续学习</button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="card p-6 border-2 border-primary/30">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold">七</span>
                    初一
                </h2>
                <div class="space-y-3">
                    ${Object.entries(grades.grade1.subjects).map(([key, subject]) => `
                    <div class="border border-gray-200 rounded-lg p-3" data-subject="g1_${key}">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-medium text-gray-700">${subject.icon || '📖'} ${subject.name}</span>
                            <span class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded subject-progress-text">0/${allSubjects['grade1_'+key].count}</span>
                        </div>
                        <div class="progress-bar mb-2">
                            <div class="progress-bar-fill subject-progress-bar" style="width: 0%"></div>
                        </div>
                        <div class="flex gap-2">
                            <a href="knowledge_g1_${key}.html?semester=upper" class="flex-1 text-center px-3 py-1.5 bg-secondary text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors">上册</a>
                            <a href="knowledge_g1_${key}.html?semester=lower" class="flex-1 text-center px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">下册</a>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>

            <div class="card p-6 border-2 border-primary/30">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold">八</span>
                    初二
                </h2>
                <div class="space-y-3">
                    ${Object.entries(grades.grade2.subjects).map(([key, subject]) => `
                    <div class="border border-gray-200 rounded-lg p-3" data-subject="g2_${key}">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-medium text-gray-700">${subject.icon || '📖'} ${subject.name}</span>
                            <span class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded subject-progress-text">0/${allSubjects['grade2_'+key].count}</span>
                        </div>
                        <div class="progress-bar mb-2">
                            <div class="progress-bar-fill subject-progress-bar" style="width: 0%"></div>
                        </div>
                        <div class="flex gap-2">
                            <a href="knowledge_g2_${key}.html?semester=upper" class="flex-1 text-center px-3 py-1.5 bg-secondary text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors">上册</a>
                            <a href="knowledge_g2_${key}.html?semester=lower" class="flex-1 text-center px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">下册</a>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>

            <div class="card p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="w-8 h-8 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center font-bold">九</span>
                    初三
                </h2>
                <div class="text-gray-500 text-sm">暂无数据</div>
            </div>
        </div>

        <div class="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 class="font-bold text-gray-700 mb-4">📊 当前数据统计</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-3xl font-bold text-primary">${totalKnowledge}</div>
                    <div class="text-sm text-gray-500">知识点</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-secondary">${totalExamples}</div>
                    <div class="text-sm text-gray-500">例题</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-danger" id="stat-wrong">-</div>
                    <div class="text-sm text-gray-500">错题数</div>
                </div>
            </div>
        </div>

        <div class="card p-6 mt-6">
            <h3 class="font-bold text-gray-700 mb-4">💡 使用说明</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div class="flex items-start gap-3">
                    <span class="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                    <p>选择年级和科目，点击"上册"或"下册"进入学习</p>
                </div>
                <div class="flex items-start gap-3">
                    <span class="w-6 h-6 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                    <p>点击知识点卡片展开查看公式和详细解释</p>
                </div>
                <div class="flex items-start gap-3">
                    <span class="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                    <p>做例题并加入错题本，方便复习巩固</p>
                </div>
            </div>
        </div>

        <footer class="text-center text-gray-400 text-sm mt-8">
            <p>初中知识点背诵系统 · 北京人教版</p>
            <p class="mt-1">v${versionInfo.version} · 更新于 ${versionInfo.lastUpdate}</p>
        </footer>
    </div>

    <script>
        const WrongBookManager = {
            STORAGE_KEY_PREFIX: 'wrongbook_',
            getAllWrongBookKeys() {
                const keys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
                        const data = JSON.parse(localStorage.getItem(key) || '[]');
                        keys.push({ count: data.length });
                    }
                }
                return keys;
            }
        };

        const ProgressManager = {
            STORAGE_KEY: 'study_progress',
            getProgress() {
                try {
                    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
                } catch(e) {
                    return {};
                }
            },
            getLastStudy() {
                const progress = this.getProgress();
                return progress.lastStudy || null;
            },
            getSubjectProgress(subject) {
                const progress = this.getProgress();
                if (!progress.learnedKnowledge) return { learned: 0 };
                const prefix = subject + '_';
                const learned = Object.keys(progress.learnedKnowledge).filter(k => k.startsWith(prefix)).length;
                return { learned };
            }
        };

        const SUBJECT_COUNTS = {
            ${Object.entries(grades.grade1.subjects).map(([key, subject]) => `'g1_${key}': ${allSubjects['grade1_'+key].count}`).join(',\n            ')},
            ${Object.entries(grades.grade2.subjects).map(([key, subject]) => `'g2_${key}': ${allSubjects['grade2_'+key].count}`).join(',\n            ')}
        };

        function formatTimeAgo(timestamp) {
            const now = new Date();
            const then = new Date(timestamp);
            const diffMs = now - then;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return '刚刚';
            if (diffMins < 60) return diffMins + '分钟前';
            if (diffHours < 24) return diffHours + '小时前';
            if (diffDays < 7) return diffDays + '天前';
            return then.toLocaleDateString('zh-CN');
        }

        document.addEventListener('DOMContentLoaded', () => {
            const allWrongBooks = WrongBookManager.getAllWrongBookKeys();
            const totalCount = allWrongBooks.reduce((sum, item) => sum + item.count, 0);
            document.getElementById('wrongbook-count').textContent = totalCount;
            document.getElementById('stat-wrong').textContent = totalCount;

            const lastStudy = ProgressManager.getLastStudy();
            if (lastStudy) {
                const continueStudyDiv = document.getElementById('continue-study');
                const lastStudyInfo = document.getElementById('last-study-info');
                const btnContinue = document.getElementById('btn-continue');
                
                const timeAgo = formatTimeAgo(lastStudy.timestamp);
                lastStudyInfo.textContent = lastStudy.subjectName + ' · ' + lastStudy.semesterName + ' · ' + lastStudy.knowledgeName + '（' + timeAgo + '）';
                continueStudyDiv.classList.remove('hidden');
                
                btnContinue.addEventListener('click', () => {
                    const url = 'knowledge_' + lastStudy.grade + '_' + lastStudy.subject + '.html?semester=' + lastStudy.semester + '#' + lastStudy.knowledgeId;
                    window.location.href = url;
                });
            }

            Object.keys(SUBJECT_COUNTS).forEach(subjectKey => {
                const progress = ProgressManager.getSubjectProgress(subjectKey);
                const total = SUBJECT_COUNTS[subjectKey];
                const percent = total > 0 ? Math.round((progress.learned / total) * 100) : 0;
                
                const subjectCard = document.querySelector('[data-subject="' + subjectKey + '"]');
                if (subjectCard) {
                    const progressText = subjectCard.querySelector('.subject-progress-text');
                    const progressBar = subjectCard.querySelector('.subject-progress-bar');
                    if (progressText) progressText.textContent = progress.learned + '/' + total;
                    if (progressBar) progressBar.style.width = percent + '%';
                }
            });
        });
    </script>
</body>
</html>`;

fs.writeFileSync('index.html', indexHtml, 'utf-8');
console.log('已生成 index.html');

// ==================== 生成各科目 knowledge_xxx.html ====================
// 生成科目页面的函数
function generateSubjectPage(gradeKey, key, subject, subjectData) {
    const knowledgeHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject.name}知识点学习</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#3B82F6',
                        secondary: '#6366F1',
                        accent: '#F59E0B',
                        success: '#10B981',
                        danger: '#EF4444',
                        warning: '#F97316',
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="page-container">
        <nav class="nav-bar">
            <a href="index.html" class="nav-back-btn">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                返回首页
            </a>
            <div class="flex-1"></div>
            <a href="wrongbook.html" class="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                错题本
            </a>
        </nav>

        <header class="page-header">
            <h1 id="page-title" class="page-title">${subject.name}</h1>
            <p id="page-subtitle" class="page-subtitle">点击卡片展开查看详细内容</p>
        </header>

        <div class="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div class="flex flex-wrap gap-4 items-center justify-between">
                <div class="flex gap-2">
                    <button id="btn-expand-all" class="btn btn-primary">全部展示</button>
                    <button id="btn-collapse-all" class="btn btn-gray">全部收起</button>
                </div>
                <div id="progress-stat" class="text-sm text-gray-600 flex items-center gap-3">
                    <span>学习进度：<span id="progress-learned" class="font-bold text-green-600">0</span> / <span id="progress-total">0</span> 个知识点</span>
                    <button id="btn-clear-progress" class="text-xs px-2 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors" title="清除当前科目学习进度">
                        清除进度
                    </button>
                </div>
                <div class="flex gap-2">
                    <a href="knowledge_${gradeKey}_${key}.html?semester=upper" class="btn btn-secondary">上册</a>
                    <a href="knowledge_${gradeKey}_${key}.html?semester=lower" class="btn btn-primary">下册</a>
                </div>
                <div class="flex-1 max-w-md">
                    <div class="relative">
                        <input id="search-input" type="text" placeholder="搜索知识点名称..." class="input w-full pl-10"/>
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <div id="search-results-info" class="hidden mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-yellow-800 text-sm">🔍 搜索结果：找到 <span id="search-count" class="font-bold">0</span> 个匹配的知识点</p>
        </div>

        <div id="knowledge-list" class="space-y-4"></div>
        <div id="empty-state" class="hidden empty-state">
            <div class="empty-state-icon">📭</div>
            <p class="empty-state-text">暂无知识点数据</p>
        </div>
    </div>

    <div id="example-modal" class="hidden modal-overlay">
        <div class="modal-content p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800">例题练习</h3>
                <button id="close-example" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div id="example-content">
                <div class="mb-4">
                    <span class="tag mb-2" id="example-knowledge-name"></span>
                    <p id="example-question" class="text-gray-800 text-lg mb-4"></p>
                </div>
                <div id="example-answer-section" class="hidden mb-4">
                    <div class="answer-box">
                        <p id="example-answer" class="text-gray-700 whitespace-pre-wrap"></p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button id="btn-show-answer" class="btn btn-success">展示答案</button>
                    <button id="btn-next-example" class="btn btn-secondary">换一题</button>
                    <button id="btn-add-wrong" class="btn btn-danger">加入错题本</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // ==================== 内嵌知识点数据 ====================
        const DATA_KNOWLEDGE = ${JSON.stringify(subjectData.knowledge)};

        // ==================== 内嵌例题数据 ====================
        const DATA_EXAMPLES = ${JSON.stringify(subjectData.examples)};
        const HAS_EXAMPLES = ${subject.noExamples ? 'false' : 'true'};

        // 错题本管理器
        const WrongBookManager = {
            STORAGE_KEY_PREFIX: 'wrongbook_',
            getWrongBook(grade, subject) {
                const key = this.STORAGE_KEY_PREFIX + grade + '_' + subject;
                return JSON.parse(localStorage.getItem(key) || '[]');
            },
            addWrongBook(item) {
                const key = this.STORAGE_KEY_PREFIX + item.grade + '_' + item.subject;
                let wrongBook = this.getWrongBook(item.grade, item.subject);
                const exists = wrongBook.some(w => w.question === item.question);
                if (exists) return false;
                wrongBook.push({...item, id: item.knowledgeId + '_' + Date.now(), addedAt: new Date().toISOString()});
                localStorage.setItem(key, JSON.stringify(wrongBook));
                return true;
            }
        };

        // 学习进度管理器
        const ProgressManager = {
            STORAGE_KEY: 'study_progress',
            
            getProgress() {
                try {
                    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
                } catch(e) {
                    return {};
                }
            },
            
            saveProgress(progress) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
            },
            
            recordStudy(grade, subject, subjectName, semester, semesterName, knowledgeId, knowledgeName) {
                const progress = this.getProgress();
                const now = new Date().toISOString();
                const today = new Date().toISOString().split('T')[0];
                
                if (!progress.learnedKnowledge) progress.learnedKnowledge = {};
                if (!progress.dailyStats) progress.dailyStats = {};
                if (!progress.dailyStats[today]) {
                    progress.dailyStats[today] = { learnedCount: 0, subjects: [] };
                }
                
                const isNew = !progress.learnedKnowledge[knowledgeId];
                progress.learnedKnowledge[knowledgeId] = { learnedAt: now };
                
                if (isNew) {
                    progress.dailyStats[today].learnedCount++;
                    if (!progress.dailyStats[today].subjects.includes(subject)) {
                        progress.dailyStats[today].subjects.push(subject);
                    }
                }
                
                progress.lastStudy = {
                    grade, subject, subjectName, semester, semesterName,
                    knowledgeId, knowledgeName, timestamp: now
                };
                
                this.saveProgress(progress);
            },
            
            isLearned(knowledgeId) {
                const progress = this.getProgress();
                return !!(progress.learnedKnowledge && progress.learnedKnowledge[knowledgeId]);
            },
            
            getLastStudy() {
                const progress = this.getProgress();
                return progress.lastStudy || null;
            },
            
            getSubjectProgress(grade, subject) {
                const progress = this.getProgress();
                if (!progress.learnedKnowledge) return { learned: 0, total: 0, percent: 0 };
                const prefix = grade + '_' + subject + '_';
                const learned = Object.keys(progress.learnedKnowledge).filter(k => k.startsWith(prefix)).length;
                const total = DATA_KNOWLEDGE.length;
                const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
                return { learned, total, percent };
            },
            
            clearSubjectProgress(grade, subject) {
                const progress = this.getProgress();
                const prefix = grade + '_' + subject + '_';
                
                if (progress.learnedKnowledge) {
                    Object.keys(progress.learnedKnowledge).forEach(k => {
                        if (k.startsWith(prefix)) {
                            delete progress.learnedKnowledge[k];
                        }
                    });
                }
                
                if (progress.lastStudy && progress.lastStudy.grade === grade && progress.lastStudy.subject === subject) {
                    delete progress.lastStudy;
                }
                
                this.saveProgress(progress);
                return true;
            }
        };

        // URL参数解析
        function getUrlParams() {
            const params = new URLSearchParams(window.location.search);
            return {
                grade: '${gradeKey}',
                subject: '${key}',
                semester: params.get('semester') || 'upper'
            };
        }

        const gradeNames = {'g1':'初一','g2':'初二','g3':'初三'};
        const subjectNames = {'${key}':'${subject.name}'};
        const semesterNames = {'upper':'上册','lower':'下册'};

        let currentParams = getUrlParams();
        let knowledgeList = [];
        let expandedIds = new Set();
        let currentExample = null;

        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');
        const knowledgeListEl = document.getElementById('knowledge-list');
        const emptyStateEl = document.getElementById('empty-state');
        const searchResultsInfo = document.getElementById('search-results-info');
        const searchCountEl = document.getElementById('search-count');
        const searchInput = document.getElementById('search-input');

        function initPage() {
            const {grade, subject, semester} = currentParams;
            pageTitle.textContent = gradeNames[grade] + ' · ' + subjectNames[subject] + ' · ' + semesterNames[semester];
            loadKnowledge();
            updateProgressStat();
            
            const hash = window.location.hash.replace('#', '');
            if (hash && knowledgeList.some(k => k.id === hash)) {
                setTimeout(() => {
                    toggleExpand(hash);
                    const card = document.querySelector('[data-id="' + hash + '"]');
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        }

        function updateProgressStat() {
            const {grade, subject} = currentParams;
            const learnedInSemester = knowledgeList.filter(k => ProgressManager.isLearned(k.id)).length;
            document.getElementById('progress-learned').textContent = learnedInSemester;
            document.getElementById('progress-total').textContent = knowledgeList.length;
        }

        function loadKnowledge() {
            const {grade, subject, semester} = currentParams;
            knowledgeList = DATA_KNOWLEDGE.filter(k => {
                return k.semester === semester;
            });
            renderKnowledgeList();
        }

        function renderKnowledgeList(items = knowledgeList) {
            if (items.length === 0) {
                knowledgeListEl.innerHTML = '';
                emptyStateEl.classList.remove('hidden');
                return;
            }
            emptyStateEl.classList.add('hidden');
            knowledgeListEl.innerHTML = items.map(item => {
                const isExpanded = expandedIds.has(item.id);
                const isLearned = ProgressManager.isLearned(item.id);
                return '<div class="card knowledge-card ' + (isLearned ? 'learned' : '') + '" data-id="' + item.id + '">' +
                    '<div class="knowledge-header p-4 flex items-center justify-between" onclick="toggleExpand(\\'' + item.id + '\\')">' +
                        '<div class="flex items-center gap-3 flex-1 min-w-0">' +
                            '<div class="expand-icon ' + (isExpanded ? 'expanded' : 'collapsed') + '">' + (isExpanded ? '−' : '+') + '</div>' +
                            '<div class="flex-1 min-w-0">' +
                                '<h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">' + escapeHtml(item.name) + (isLearned ? '<span class="text-green-500 text-sm">✓ 已学习</span>' : '') + '</h3>' +
                                '<p class="text-xs text-gray-500 mt-1">' + escapeHtml(item.chapter) + '</p>' +
                            '</div>' +
                        '</div>' +
                        (HAS_EXAMPLES ? '<button class="btn btn-secondary text-sm px-3 py-1" onclick="event.stopPropagation(); showExample(\\'' + item.id + '\\', \\'' + escapeHtml(item.name) + '\\')">例题</button>' : '') +
                    '</div>' +
                    '<div id="content-' + item.id + '" class="px-6 pb-4 ' + (isExpanded ? '' : 'hidden') + '">' +
                        (item.formula ? '<div class="mb-4"><h4 class="text-sm font-medium text-gray-500 mb-2">📐 公式</h4><p class="formula-box text-gray-800 text-lg bg-gray-50 p-3 rounded-lg">' + escapeHtml(item.formula) + '</p></div>' : '') +
                        (item.explanation ? '<div><h4 class="text-sm font-medium text-gray-500 mb-2">📝 解释</h4><p class="text-gray-700 leading-relaxed whitespace-pre-wrap">' + escapeHtml(item.explanation) + '</p></div>' : '') +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function toggleExpand(id) {
            const isNewLearn = !expandedIds.has(id) && !ProgressManager.isLearned(id);
            if (expandedIds.has(id)) {
                expandedIds.delete(id);
            } else {
                expandedIds.add(id);
                const {grade, subject, semester} = currentParams;
                const item = knowledgeList.find(k => k.id === id);
                if (item) {
                    ProgressManager.recordStudy(
                        grade, subject, subjectNames[subject],
                        semester, semesterNames[semester],
                        id, item.name
                    );
                }
            }
            const card = document.querySelector('[data-id="' + id + '"]');
            const content = document.getElementById('content-' + id);
            const icon = card.querySelector('.expand-icon');
            const header = card.querySelector('.knowledge-header');
            const title = card.querySelector('h3');
            if (expandedIds.has(id)) {
                content.classList.remove('hidden');
                icon.classList.remove('collapsed');
                icon.classList.add('expanded');
                icon.textContent = '−';
                header.classList.add('expanded');
            } else {
                content.classList.add('hidden');
                icon.classList.remove('expanded');
                icon.classList.add('collapsed');
                icon.textContent = '+';
                header.classList.remove('expanded');
            }
            if (isNewLearn) {
                card.classList.add('learned');
                if (!title.querySelector('.text-green-500')) {
                    title.innerHTML += '<span class="text-green-500 text-sm">✓ 已学习</span>';
                }
                updateProgressStat();
            }
        }

        function expandAll() {
            knowledgeList.forEach(item => expandedIds.add(item.id));
            renderKnowledgeList();
        }

        function collapseAll() {
            expandedIds.clear();
            renderKnowledgeList();
        }

        function searchKnowledge(keyword, list) {
            if (!keyword) return [];
            const lower = keyword.toLowerCase();
            return list.filter(k =>
                k.name.toLowerCase().includes(lower) ||
                k.chapter.toLowerCase().includes(lower)
            );
        }

        function performSearch() {
            const keyword = searchInput.value.trim();
            if (!keyword) {
                searchResultsInfo.classList.add('hidden');
                renderKnowledgeList();
                return;
            }
            const results = searchKnowledge(keyword, knowledgeList);
            searchCountEl.textContent = results.length;
            searchResultsInfo.classList.remove('hidden');
            renderKnowledgeList(results);
        }

        function showExample(knowledgeId, knowledgeName) {
            const examples = DATA_EXAMPLES.filter(e => e.knowledge_id === knowledgeId);
            if (examples.length === 0) {
                alert('暂无例题');
                return;
            }
            const example = examples[Math.floor(Math.random() * examples.length)];
            currentExample = {...example, knowledgeId, knowledgeName, ...currentParams};
            document.getElementById('example-knowledge-name').textContent = knowledgeName;
            document.getElementById('example-question').textContent = example.question;
            document.getElementById('example-answer').textContent = example.answer;
            document.getElementById('example-answer-section').classList.add('hidden');
            document.getElementById('btn-show-answer').classList.remove('hidden');
            document.getElementById('example-modal').classList.remove('hidden');
        }

        function nextExample() {
            if (!currentExample) return;
            const examples = DATA_EXAMPLES.filter(e => e.knowledge_id === currentExample.knowledgeId);
            const otherExamples = examples.filter(e => e !== currentExample);
            if (otherExamples.length === 0) {
                alert('没有更多例题了');
                return;
            }
            const example = otherExamples[Math.floor(Math.random() * otherExamples.length)];
            currentExample = {...example, knowledgeId: currentExample.knowledgeId, knowledgeName: currentExample.knowledgeName, ...currentParams};
            document.getElementById('example-question').textContent = example.question;
            document.getElementById('example-answer').textContent = example.answer;
            document.getElementById('example-answer-section').classList.add('hidden');
            document.getElementById('btn-show-answer').classList.remove('hidden');
        }

        function addToWrongBook() {
            if (!currentExample) return;
            const item = {
                knowledgeId: currentExample.knowledgeId,
                knowledgeName: currentExample.knowledgeName,
                question: currentExample.question,
                answer: currentExample.answer,
                grade: currentParams.grade,
                subject: currentParams.subject
            };
            if (WrongBookManager.addWrongBook(item)) {
                alert('已加入错题本！');
            } else {
                alert('该题目已在错题本中');
            }
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function clearProgress() {
            const {grade, subject} = currentParams;
            const subjectName = subjectNames[subject];
            var msg = '确定要清除【' + subjectName + '】科目的所有学习进度吗？';
            msg += '\\n\\n';
            msg += '此操作将清除该科目所有已学习标记，且不可恢复。';
            if (!confirm(msg)) {
                return;
            }
            ProgressManager.clearSubjectProgress(grade, subject);
            updateProgressStat();
            renderKnowledgeList();
            alert('学习进度已清除');
        }

        document.getElementById('btn-expand-all').addEventListener('click', expandAll);
        document.getElementById('btn-collapse-all').addEventListener('click', collapseAll);
        document.getElementById('btn-clear-progress').addEventListener('click', clearProgress);
        searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') performSearch(); });
        searchInput.addEventListener('input', () => { if (!searchInput.value) { searchResultsInfo.classList.add('hidden'); renderKnowledgeList(); }});
        document.getElementById('close-example').addEventListener('click', () => document.getElementById('example-modal').classList.add('hidden'));
        document.getElementById('btn-show-answer').addEventListener('click', () => {
            document.getElementById('example-answer-section').classList.remove('hidden');
            document.getElementById('btn-show-answer').classList.add('hidden');
        });
        document.getElementById('btn-next-example').addEventListener('click', nextExample);
        document.getElementById('btn-add-wrong').addEventListener('click', addToWrongBook);
        document.getElementById('example-modal').addEventListener('click', e => { if (e.target.id === 'example-modal') document.getElementById('example-modal').classList.add('hidden'); });

        initPage();
    </script>
</body>
</html>`;

    fs.writeFileSync(`knowledge_${gradeKey}_${key}.html`, knowledgeHtml, 'utf-8');
    console.log(`已生成 knowledge_${gradeKey}_${key}.html (${subjectData.count}知识点, ${subjectData.examples.length}例题)`);
}

// 生成初一科目页面
Object.entries(grades.grade1.subjects).forEach(([key, subject]) => {
    const subjectData = allSubjects['grade1_'+key];
    generateSubjectPage('g1', key, subject, subjectData);
});

// 生成初二科目页面
Object.entries(grades.grade2.subjects).forEach(([key, subject]) => {
    const subjectData = allSubjects['grade2_'+key];
    generateSubjectPage('g2', key, subject, subjectData);
});

console.log('wrongbook.html 已存在，无需修改');
console.log('\n生成完成！现在可以直接双击打开 index.html');
