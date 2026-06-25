const fs = require('fs');
const path = require('path');

const upperData = require('./data/knowledge/g2_daofa_upper.json');
const lowerData = require('./data/knowledge/g2_daofa_lower.json');
const outputDir = './data/examples/';

function generateQuestions(knowledge, index, type) {
  const questions = [];
  const prefix = type === 'u' ? 'u' : 'l';
  const num = String(index).padStart(3, '0');
  const kid = `g2_daofa_${prefix}${num}`;
  const name = knowledge.name;
  const formula = knowledge.formula;
  const explanation = knowledge.explanation;

  let qIndex = 1;

  // 选择题 3道
  for (let i = 0; i < 3; i++) {
    questions.push(generateChoice(kid, name, formula, explanation, qIndex++));
  }

  // 判断题 3道
  for (let i = 0; i < 3; i++) {
    questions.push(generateJudge(kid, name, formula, explanation, qIndex++));
  }

  // 简答题 2道
  for (let i = 0; i < 2; i++) {
    questions.push(generateShortAnswer(kid, name, formula, explanation, qIndex++));
  }

  // 案例分析题 2道
  for (let i = 0; i < 2; i++) {
    questions.push(generateCaseStudy(kid, name, formula, explanation, qIndex++));
  }

  return questions;
}

function generateChoice(kid, name, formula, explanation, idx) {
  const id = `${kid}_ex${String(idx).padStart(2, '0')}`;

  const templates = [
    {
      question: `【选择题】以下关于"${name}"的说法，正确的是：\nA. ${formula}\nB. ${name}对个人发展没有意义\nC. ${name}与社会生活无关\nD. 只有成年人需要了解${name}`,
      answer: `正确答案：A\n解析：${explanation}`
    },
    {
      question: `【选择题】"${name}"主要体现了什么道理？\nA. ${formula}\nB. 可以完全忽视社会规则\nC. 个人不需要承担任何责任\nD. 社会生活与个人无关`,
      answer: `正确答案：A\n解析：${explanation}`
    },
    {
      question: `【选择题】下列对"${name}"的理解，错误的是：\nA. ${formula}\nB. 这是现代公民应有的素质\nC. 与日常生活没有关系\nD. 有助于社会的和谐发展`,
      answer: `正确答案：C\n解析：${explanation}\n选项C是错误的，${name}与我们的日常生活密切相关。`
    },
    {
      question: `【选择题】在学习"${name}"时，我们应该：\nA. ${formula}\nB. 不以为然，觉得无所谓\nC. 只在考试时关注\nD. 认为这只是理论，没有实际意义`,
      answer: `正确答案：A\n解析：${explanation}`
    },
    {
      question: `【选择题】"${name}"告诉我们的核心道理是：\nA. ${formula}\nB. 人可以脱离社会独立存在\nC. 规则是不重要的\nD. 不需要考虑他人感受`,
      answer: `正确答案：A\n解析：${explanation}`
    }
  ];

  const t = templates[idx % templates.length];
  return { id, knowledge_id: kid, question: t.question, answer: t.answer };
}

function generateJudge(kid, name, formula, explanation, idx) {
  const id = `${kid}_ex${String(idx).padStart(2, '0')}`;
  const isCorrect = idx % 2 === 1;

  let statement, answer;
  if (isCorrect) {
    statement = `【判断题】${formula}。（）`;
    answer = `正确\n解析：${explanation}`;
  } else {
    statement = `【判断题】${name}与我们的生活无关，可以不必在意。（）`;
    answer = `错误\n解析：${explanation}`;
  }

  return { id, knowledge_id: kid, question: statement, answer };
}

function generateShortAnswer(kid, name, formula, explanation, idx) {
  const id = `${kid}_ex${String(idx).padStart(2, '0')}`;

  const templates = [
    {
      question: `【简答题】请简要说明什么是${name}。`,
      answer: `${formula}\n\n${explanation}`
    },
    {
      question: `【简答题】${name}在日常生活中有什么重要意义？请结合实际说明。`,
      answer: `${formula}\n\n${explanation}\n\n${name}对于我们的健康成长和社会和谐都具有重要作用，我们应该在生活中积极践行。`
    },
    {
      question: `【简答题】作为中学生，我们应如何在生活中体现${name}？`,
      answer: `${formula}\n\n${explanation}\n\n在日常生活中，我们应从身边小事做起，以实际行动体现这一品质。`
    },
    {
      question: `【简答题】为什么说${name}是每个公民都应该具备的素质？`,
      answer: `${formula}\n\n${explanation}\n\n这关系到个人的成长进步，也关系到社会的和谐发展。`
    }
  ];

  const t = templates[idx % templates.length];
  return { id, knowledge_id: kid, question: t.question, answer: t.answer };
}

function generateCaseStudy(kid, name, formula, explanation, idx) {
  const id = `${kid}_ex${String(idx).padStart(2, '0')}`;

  const cases = [
    {
      question: `【案例分析题】材料：小明在课间发现有同学摔倒了，他主动上前搀扶并帮助联系校医。\n请结合"${name}"的知识，分析小明的行为。`,
      answer: `（1）小明的行为体现了${name}。\n（2）${formula}\n（3）${explanation}\n（4）启示：在日常生活中，我们也应该积极践行${name}，从帮助身边的人做起。`
    },
    {
      question: `【案例分析题】材料：某校初二学生在社会实践中发现，部分同学在公共场所大声喧哗、不遵守秩序。\n请运用"${name}"的知识，分析说明我们应该怎样做。`,
      answer: `（1）${formula}\n（2）${explanation}\n（3）作为中学生，我们应该从身边小事做起，自觉践行${name}，为构建和谐社会贡献力量。`
    },
    {
      question: `【案例分析题】材料：王同学在小区里主动捡拾垃圾，并带动其他居民一起保护环境。\n请结合"${name}"的知识，评价王同学的行为。`,
      answer: `（1）王同学的行为体现了${name}。\n（2）${formula}\n（3）${explanation}\n（4）我们应该向王同学学习，积极参与社会公益活动，服务社会，奉献社会。`
    },
    {
      question: `【案例分析题】材料：在网络时代，青少年小明经常在网上发表不当言论，忽视了自身素养的培养。\n请结合"${name}"的知识，谈谈你的看法。`,
      answer: `（1）${formula}\n（2）${explanation}\n（3）我们应该增强${name}意识，在网络生活中同样要遵守规则，文明上网，依法上网。`
    }
  ];

  const c = cases[idx % cases.length];
  return { id, knowledge_id: kid, question: c.question, answer: c.answer };
}

function generateAll() {
  // 上册 u001-u030
  upperData.forEach((k, i) => {
    const num = String(i + 1).padStart(3, '0');
    const filename = `g2_daofa_u${num}_010.json`;
    const filepath = path.join(outputDir, filename);
    const questions = generateQuestions(k, i + 1, 'u');
    fs.writeFileSync(filepath, JSON.stringify(questions, null, 2), 'utf8');
  });

  // 下册 l001-l030
  lowerData.forEach((k, i) => {
    const num = String(i + 1).padStart(3, '0');
    const filename = `g2_daofa_l${num}_010.json`;
    const filepath = path.join(outputDir, filename);
    const questions = generateQuestions(k, i + 1, 'l');
    fs.writeFileSync(filepath, JSON.stringify(questions, null, 2), 'utf8');
  });

  console.log('All 60 files generated successfully!');
}

generateAll();
