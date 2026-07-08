const fs = require('fs');
const path = require('path');

const EX_DIR = 'data/examples';

const badPatterns = [
  { pattern: /错误说法[ABCD]/, desc: '模板化选项：错误说法A/B/C/D' },
  { pattern: /正确说法[ABCD]/, desc: '模板化选项：正确说法A/B/C/D' },
  { pattern: /选项[ABCD]错误说法/, desc: '模板化选项：选项X错误说法' },
  { pattern: /关于.*的某个说法/, desc: '模板化题目：关于...的某个说法' },
  { pattern: /根据知识点填写/, desc: '空模板答案：根据知识点填写' },
  { pattern: /答案和解析\.\.\./, desc: '空模板答案：答案和解析...' },
  { pattern: /根据.*定义和性质判断/, desc: '空模板解析：根据...定义和性质判断' },
  { pattern: /本题考察对.*的理解/, desc: '模板化解析：本题考察对...的理解' },
  { pattern: /这是.*的基本公式/, desc: '模板化解析：这是...的基本公式' },
  { pattern: /待补充/, desc: '未完成：待补充' },
  { pattern: /题目\d+：关于/, desc: '占位符题目' },
];

function checkDuplicateOptions(question) {
  if (!question.includes('选择题')) return null;
  
  const optionMatch = question.match(/[ABCD]\.\s*([^\n]+)/g);
  if (!optionMatch || optionMatch.length < 4) return null;
  
  const options = optionMatch.map(o => o.replace(/[ABCD]\.\s*/, '').trim());
  const seen = {};
  for (let i = 0; i < options.length; i++) {
    if (seen[options[i]]) {
      return `选项${seen[options[i]]}和选项${['A','B','C','D'][i]}重复`;
    }
    seen[options[i]] = ['A','B','C','D'][i];
  }
  return null;
}

function checkShortQuestion(question) {
  if (question.length < 20) {
    return '题目过短（少于20字符）';
  }
  return null;
}

console.log('正在检查初三化学例题质量...\n');

const files = fs.readdirSync(EX_DIR).filter(f => f.startsWith('g3_chemistry_') && f.endsWith('.json'));

let totalQuestions = 0;
let totalProblems = 0;
const problems = [];

for (const file of files) {
  const examples = JSON.parse(fs.readFileSync(path.join(EX_DIR, file), 'utf8'));
  
  for (const ex of examples) {
    totalQuestions++;
    
    for (const { pattern, desc } of badPatterns) {
      if (pattern.test(ex.question) || pattern.test(ex.answer)) {
        totalProblems++;
        problems.push({ file, id: ex.id, type: desc });
      }
    }
    
    const dupResult = checkDuplicateOptions(ex.question);
    if (dupResult) {
      totalProblems++;
      problems.push({ file, id: ex.id, type: dupResult });
    }
    
    const shortResult = checkShortQuestion(ex.question);
    if (shortResult) {
      totalProblems++;
      problems.push({ file, id: ex.id, type: shortResult });
    }
  }
}

console.log(`检查完成！\n`);
console.log(`检查范围：${files.length} 个文件，${totalQuestions} 道例题`);
console.log(`发现问题：${totalProblems} 个`);

if (totalProblems > 0) {
  console.log('\n问题详情：');
  problems.forEach(p => {
    console.log(`  ${p.file} ${p.id}: ${p.type}`);
  });
} else {
  console.log('\n✅ 所有例题质量合格！');
}
