// 生成初二地理例题JSON文件
// 用法：node generate_geography.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'examples');

// 加载所有数据文件
const dataFiles = [
  'geography_upper_1.js',
  'geography_upper_2.js',
  'geography_upper_3.js',
  'geography_upper_4.js',
  'geography_upper_5.js',
  'geography_upper_6.js',
  'geography_lower_1.js',
  'geography_lower_2.js',
  'geography_lower_3.js',
  'geography_lower_4.js'
];

// 合并所有数据
const allData = {};
dataFiles.forEach(file => {
  const filePath = path.join(DATA_DIR, file);
  if (fs.existsSync(filePath)) {
    const data = require(filePath);
    Object.keys(data).forEach(key => {
      allData[key] = data[key];
    });
  } else {
    console.warn('文件不存在: ' + file);
  }
});

// 检查所有85个知识点
const expectedIds = [];
for (let i = 1; i <= 50; i++) {
  const num = String(i).padStart(3, '0');
  expectedIds.push('g2_geography_u' + num);
}
for (let i = 1; i <= 35; i++) {
  const num = String(i).padStart(3, '0');
  expectedIds.push('g2_geography_l' + num);
}

console.log('总共期望知识点: ' + expectedIds.length);
console.log('已加载知识点: ' + Object.keys(allData).length);

// 检查缺失的知识点
const missing = expectedIds.filter(id => !allData[id]);
if (missing.length > 0) {
  console.error('缺失的知识点: ' + missing.join(', '));
  process.exit(1);
}

// 检查每个知识点的题目数量
const wrongCount = [];
expectedIds.forEach(id => {
  if (allData[id].length !== 10) {
    wrongCount.push(id + ' 有 ' + allData[id].length + ' 道题');
  }
});
if (wrongCount.length > 0) {
  console.error('题目数量错误的知识点:');
  wrongCount.forEach(msg => console.error('  ' + msg));
}

// 生成JSON文件
let successCount = 0;
let failCount = 0;

expectedIds.forEach(id => {
  const questions = allData[id];
  const examples = questions.map((q, index) => {
    return {
      id: id + '_ex' + String(index + 1).padStart(2, '0'),
      knowledge_id: id,
      question: q.q,
      answer: q.a
    };
  });

  const fileName = id + '_010.json';
  const filePath = path.join(OUTPUT_DIR, fileName);

  try {
    const content = JSON.stringify(examples, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    successCount++;
  } catch (err) {
    console.error('生成文件失败: ' + fileName + ', 错误: ' + err.message);
    failCount++;
  }
});

console.log('\n生成完成:');
console.log('  成功: ' + successCount);
console.log('  失败: ' + failCount);
console.log('  输出目录: ' + OUTPUT_DIR);
