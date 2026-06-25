const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, 'data', 'knowledge');
const EXAMPLES_DIR = path.join(__dirname, 'data', 'examples');

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function addChoice(question, correctOption, wrongOptions, explanation) {
  const options = shuffleArray([correctOption, ...wrongOptions]);
  const labels = ['A', 'B', 'C', 'D'];
  let correctLabel = '';
  const optionStr = options.map((opt, i) => {
    if (opt === correctOption) correctLabel = labels[i];
    return `${labels[i]}. ${opt}`;
  }).join('  ');
  return {
    question: `${question} ${optionStr}`,
    answer: `答案：${correctLabel}. ${correctOption}。解析：${explanation}`
  };
}

const mathUpperKnowledge = [
  {
    chapter: '第一章 有理数',
    name: '正数与负数',
    formula: '正数 > 0 > 负数\n0既不是正数也不是负数',
    explanation: '【正数】大于0的数叫做正数。正数前面可以加"+"号，也可以省略不写。\n\n【负数】小于0的数叫做负数。负数前面必须加"-"号。\n\n【0的特殊性】0既不是正数，也不是负数。0是正数和负数的分界。\n\n【应用】用正负数表示具有相反意义的量：\n- 向东走3米记作+3米，向西走2米记作-2米\n- 收入500元记作+500元，支出300元记作-300元\n- 零上5℃记作+5℃，零下3℃记作-3℃'
  },
  {
    chapter: '第一章 有理数',
    name: '