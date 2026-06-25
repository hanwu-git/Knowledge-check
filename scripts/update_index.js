const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 一年级科目配置
const grade1Subjects = [
    { key: 'math', name: '数学', icon: '📐', count: 60 },
    { key: 'english', name: '英语', icon: '🔤', count: 60 },
    { key: 'chinese', name: '语文', icon: '📖', count: 60 },
    { key: 'chinese_recite', name: '语文重点背诵', icon: '📝', count: 30 },
    { key: 'english_vocab', name: '英语词汇背诵', icon: '📚', count: 30 },
    { key: 'history', name: '历史', icon: '🏛️', count: 60 },
    { key: 'geography', name: '地理', icon: '🌍', count: 60 },
    { key: 'biology', name: '生物', icon: '🧬', count: 60 },
    { key: 'daofa', name: '道德与法治', icon: '⚖️', count: 60 }
];

// 生成科目卡片HTML
const subjectCards = grade1Subjects.map(s => `
                    <div class="border border-gray-200 rounded-lg p-3" data-subject="grade1_${s.key}">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-medium text-gray-700">${s.icon} ${s.name}</span>
                            <span class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded subject-progress-text">0/${s.count}</span>
                        </div>
                        <div class="progress-bar mb-2">
                            <div class="progress-bar-fill subject-progress-bar" style="width: 0%"></div>
                        </div>
                        <div class="flex gap-2">
                            <a href="g1_${s.key}.html?semester=upper" class="flex-1 text-center px-3 py-1.5 bg-secondary text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors">上册</a>
                            <a href="g1_${s.key}.html?semester=lower" class="flex-1 text-center px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">下册</a>
                        </div>
                    </div>`).join('');

// 旧的初一卡片内容
const oldCard = `            <div class="card p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="w-8 h-8 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center font-bold">七</span>
                    初一
                </h2>
                <div class="text-gray-500 text-sm">暂无数据</div>
            </div>`;

// 新的初一卡片内容
const newCard = `            <div class="card p-6 border-2 border-primary/30">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold">七</span>
                    初一
                </h2>
                <div class="space-y-3">
                    ${subjectCards}
                </div>
            </div>`;

if (content.includes(oldCard)) {
    content = content.replace(oldCard, newCard);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('✅ 首页已更新，添加了一年级科目入口');
    console.log(`   共 ${grade1Subjects.length} 个科目`);
} else {
    console.log('❌ 未找到旧的初一卡片');
    console.log('尝试查找...');
    const idx = content.indexOf('初一');
    if (idx !== -1) {
        console.log('找到"初一"在位置:', idx);
        console.log('附近内容:');
        console.log(content.slice(idx - 100, idx + 200));
    }
}
