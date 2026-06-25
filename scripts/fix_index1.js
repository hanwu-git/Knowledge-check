const fs = require('fs');

let content = fs.readFileSync('generate_standalone.js', 'utf8');

// 找到indexHtml模板的开始位置
const indexStart = content.indexOf('const indexHtml = `');
const indexEnd = content.indexOf('`;', indexStart) + 2;

console.log('indexHtml起始位置:', indexStart);
console.log('indexHtml长度:', indexEnd - indexStart);

// 我们需要替换整个初一卡片（目前显示"暂无数据"）
// 和初二卡片里的subjects引用

// 1. 先找到初一卡片的位置
const g1CardStart = content.indexOf('<span class="w-8 h-8 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center font-bold">七</span>');
const g1CardEnd = content.indexOf('</div>\n\n            <div class="card p-6 border-2 border-primary/30">', g1CardStart);

console.log('初一卡片起始:', g1CardStart);
console.log('初一卡片结束:', g1CardEnd);

// 构建新的初一卡片内容
const g1CardNew = `<span class="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold">七</span>
                    初一
                </h2>
                <div class="space-y-3">
                    ${generateGradeSubjects('grade1')}
                </div>`;

// 等等，这样写不行，因为模板字符串在Node.js里会被解析
// 让我换一种方式 - 直接用代码生成需要替换的内容

console.log('准备更新首页模板...');

// 我们需要做两处修改：
// 1. 把初一卡片从"暂无数据"改成有科目列表
// 2. 把初二卡片里的subjects改成grades.grade2.subjects
// 3. 更新SUBJECT_COUNTS的生成

// 让我先找到所有使用subjects的地方
const subjectRefs = [];
let idx = content.indexOf('subjects', indexStart);
while (idx !== -1 && idx < indexEnd) {
    subjectRefs.push({
        pos: idx,
        text: content.slice(idx, idx + 50)
    });
    idx = content.indexOf('subjects', idx + 1);
}

console.log('首页模板中subjects的引用位置:');
subjectRefs.forEach(r => console.log('  ', r.pos, r.text.replace(/\n/g, ' ').slice(0, 60)));
