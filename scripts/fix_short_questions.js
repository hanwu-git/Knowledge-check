const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'g3_history_019_010.json',
    id: 'g3_history_019_ex04',
    newQ: '简答题：结合所学历史知识，你如何评价巴黎公社这一历史事件？请从性质、意义和失败教训等方面分析。'
  },
  {
    file: 'g3_politics_004_010.json',
    id: 'g3_politics_004_ex09',
    newQ: '简答题：建设创新型国家是我国的重要战略目标。结合所学知识，说说我国应该怎样建设创新型国家？'
  },
  {
    file: 'g3_politics_008_010.json',
    id: 'g3_politics_008_ex09',
    newQ: '简答题：法治是现代政治文明的核心。结合所学知识，说说法治的要求是什么？'
  },
  {
    file: 'g3_politics_009_010.json',
    id: 'g3_politics_009_ex04',
    newQ: '简答题：法治政府建设是全面依法治国的重要环节。结合所学知识，说说怎样建设法治政府？'
  },
  {
    file: 'g3_politics_016_010.json',
    id: 'g3_politics_016_ex04',
    newQ: '简答题：维护国家统一是每个公民的责任。结合所学知识，说说我们为什么要反对分裂？'
  },
  {
    file: 'g3_politics_033_010.json',
    id: 'g3_politics_033_ex07',
    newQ: '简答题：面向未来，我们需要对人生有美好的憧憬。结合所学知识，说说如何正确畅想未来？'
  },
  {
    file: 'g3_politics_035_010.json',
    id: 'g3_politics_035_ex07',
    newQ: '简答题：初中毕业之际，我们需要对未来进行规划。结合所学知识，说说如何进行人生规划？'
  }
];

for (const fix of fixes) {
  const filePath = path.join('data', 'examples', fix.file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  for (const item of data) {
    if (item.id === fix.id) {
      item.question = fix.newQ;
      console.log(`已修复 ${fix.file} ${fix.id}`);
      break;
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

console.log('\n全部修复完成！');
