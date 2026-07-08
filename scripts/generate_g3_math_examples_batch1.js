const fs = require('fs');
const path = require('path');

const EX_DIR = 'data/examples';
const KP_DIR = 'data/knowledge';

const upperKP = JSON.parse(fs.readFileSync(path.join(KP_DIR, 'g3_math_upper.json'), 'utf8'));
const lowerKP = JSON.parse(fs.readFileSync(path.join(KP_DIR, 'g3_math_lower.json'), 'utf8'));
const allKP = [...upperKP, ...lowerKP];

const kpById = {};
allKP.forEach(kp => { kpById[kp.id] = kp; });

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMCQ(question, options, correctIndex, explanation) {
  const labels = ['A', 'B', 'C', 'D'];
  const qText = '选择题：' + question + '（  ）\n' +
    options.map((opt, i) => labels[i] + '. ' + opt).join('\n');
  const ans = '答案：' + labels[correctIndex] + '\n解析：' + explanation;
  return { question: qText, answer: ans };
}

function generateExamplesForKP(kp) {
  const examples = [];
  const id = kp.id;
  const name = kp.name;

  switch (id) {
    case 'g3_math_001':
      examples.push(makeMCQ('下列方程中，属于一元二次方程的是',
        ['2x + 3 = 0', 'x² + 2x - 3 = 0', 'x + 1/x = 2', 'x³ + x = 1'],
        1,
        '选项A是一元一次方程；选项B符合一元二次方程定义：只含一个未知数x，最高次数是2，是整式方程；选项C分母含未知数，是分式方程；选项D最高次数是3，是三次方程。'));
      examples.push({
        question: '填空题：一元二次方程 2x² - 3x + 1 = 0 的二次项系数是______，一次项系数是______，常数项是______。',
        answer: '答案：2，-3，1\n解析：一元二次方程一般形式为ax²+bx+c=0，其中a=2是二次项系数，b=-3是一次项系数，c=1是常数项。注意系数要带符号。'
      });
      examples.push(makeMCQ('关于x的方程 (m-2)x² + 3x - 1 = 0 是一元二次方程，则m的取值范围是',
        ['m ≠ 0', 'm ≠ 2', 'm > 2', 'm为任意实数'],
        1,
        '一元二次方程要求二次项系数不为0，即m-2 ≠ 0，所以m ≠ 2。'));
      examples.push({
        question: '判断题：方程 x² + 3x = x² + 2 是一元二次方程。',
        answer: '答案：错误\n解析：化简后方程变为 3x = 2，即 3x - 2 = 0，是一元一次方程，不是一元二次方程。判断时要先化简再判断。'
      });
      examples.push(makeMCQ('下列方程化为一般形式后，二次项系数为3的是',
        ['3x = x² + 2', 'x(x - 3) = 0', '3x² + 1 = 0', 'x² + 3x = 1'],
        2,
        '选项A化为x²-3x+2=0，二次项系数为1；选项B化为x²-3x=0，二次项系数为1；选项C就是一般形式，二次项系数为3；选项D化为x²+3x-1=0，二次项系数为1。'));
      examples.push({
        question: '填空题：把方程 (x+2)(x-1) = 4 化为一般形式为______。',
        answer: '答案：x² + x - 6 = 0\n解析：左边展开：(x+2)(x-1) = x² + 2x - x - 2 = x² + x - 2\n移项得：x² + x - 2 = 4\n即：x² + x - 6 = 0'
      });
      examples.push(makeMCQ('若 ax² + bx + c = 0 是一元二次方程，则下列说法正确的是',
        ['a、b、c都不能为0', 'a不能为0，b和c可以为0', 'b不能为0，a和c可以为0', 'c不能为0，a和b可以为0'],
        1,
        '一元二次方程只要求二次项系数a≠0，一次项系数b和常数项c都可以为0。比如x²=0就是一元二次方程，此时b=0，c=0。'));
      examples.push({
        question: '判断题：一元二次方程最多有两个实数根。',
        answer: '答案：正确\n解析：一元二次方程在实数范围内最多有两个根，可以是两个不等实根、两个相等实根，或者没有实根，所以最多有两个实数根。'
      });
      examples.push({
        question: '解答题：已知关于x的方程 (m-1)x^(|m|+1) + 2x - 3 = 0 是一元二次方程，求m的值。',
        answer: '答案：m = -1\n解析：\n因为方程是一元二次方程，所以需要满足两个条件：\n1. 二次项系数不为0：m - 1 ≠ 0，即 m ≠ 1\n2. x的最高次数为2：|m| + 1 = 2，即 |m| = 1，m = ±1\n综合两个条件，m ≠ 1且m = ±1，所以 m = -1'
      });
      examples.push(makeMCQ('下列说法中，正确的是',
        ['含有x²的方程一定是一元二次方程', '一元二次方程的二次项系数不能为0', '一元二次方程的一次项系数不能为0', '一元二次方程的常数项不能为0'],
        1,
        '选项A错误，必须化简后判断；选项B正确，a=0就不是二次方程了；选项C错误，b可以为0，如x²+1=0；选项D错误，c可以为0，如x²+2x=0。'));
      break;

    case 'g3_math_002':
      examples.push({
        question: '填空题：方程 x² = 9 的解是______。',
        answer: '答案：x₁ = 3，x₂ = -3\n解析：直接开平方，x = ±√9 = ±3，所以x₁ = 3，x₂ = -3。注意一元二次方程一般有两个根，不要漏掉负根。'
      });
      examples.push(makeMCQ('方程 (x - 1)² = 4 的解是',
        ['x = 3', 'x = -1', 'x₁ = 3，x₂ = -1', 'x₁ = 1，x₂ = -3'],
        2,
        '直接开平方：x - 1 = ±2\n当x - 1 = 2时，x = 3\n当x - 1 = -2时，x = -1\n所以x₁ = 3，x₂ = -1'));
      examples.push({
        question: '判断题：方程 x² = -4 的解是 x = ±2。',
        answer: '答案：错误\n解析：因为任何实数的平方都是非负数，所以x² = -4没有实数根。直接开平方法的前提是右边是非负数。'
      });
      examples.push(makeMCQ('方程 2x² - 8 = 0 的解是',
        ['x = 2', 'x = -2', 'x₁ = 2，x₂ = -2', 'x₁ = 4，x₂ = -4'],
        2,
        '2x² - 8 = 0 → 2x² = 8 → x² = 4 → x = ±2\n所以x₁ = 2，x₂ = -2'));
      examples.push({
        question: '填空题：方程 (2x + 1)² = 9 的解是______。',
        answer: '答案：x₁ = 1，x₂ = -2\n解析：\n直接开平方：2x + 1 = ±3\n当2x + 1 = 3时，2x = 2，x = 1\n当2x + 1 = -3时，2x = -4，x = -2\n所以x₁ = 1，x₂ = -2'
      });
      examples.push(makeMCQ('用直接开平方法解一元二次方程，正确的是',
        ['x² = a，解为x = √a', '(x+2)² = 5，解为x = ±√5 - 2', 'x² = -1，解为x = ±1', '(x-3)² = 0，解为x = 3（只有一个解）'],
        1,
        '选项A错误，x²=a当a<0时无实根，a≥0时x=±√a；选项B正确，x+2=±√5，所以x=±√5-2；选项C错误，负数没有实数平方根；选项D错误，有两个相等的实根x₁=x₂=3。'));
      examples.push({
        question: '解答题：用直接开平方法解方程 3(x - 2)² - 12 = 0',
        answer: '答案：x₁ = 4，x₂ = 0\n解析：\n3(x - 2)² - 12 = 0\n移项：3(x - 2)² = 12\n两边除以3：(x - 2)² = 4\n直接开平方：x - 2 = ±2\n当x - 2 = 2时，x = 4\n当x - 2 = -2时，x = 0\n所以x₁ = 4，x₂ = 0'
      });
      examples.push(makeMCQ('方程 x² = 0 的根的情况是',
        ['没有实数根', '有一个实数根x = 0', '有两个相等的实数根x₁ = x₂ = 0', '有两个不相等的实数根'],
        2,
        'x² = 0 开平方得 x = ±0，即x₁ = x₂ = 0，这是两个相等的实数根。一元二次方程有两个根，相等时叫重根。'));
      examples.push({
        question: '填空题：若 (x + 1)² = (2x - 3)²，则x的值为______。',
        answer: '答案：x₁ = 4，x₂ = 2/3\n解析：\n两边开平方：x + 1 = ±(2x - 3)\n\n情况1：x + 1 = 2x - 3\n-x = -4，x = 4\n\n情况2：x + 1 = -(2x - 3)\nx + 1 = -2x + 3\n3x = 2，x = 2/3\n\n所以x₁ = 4，x₂ = 2/3'
      });
      examples.push({
        question: '判断题：用直接开平方法解方程时，方程右边必须是非负数，否则方程没有实数根。',
        answer: '答案：正确\n解析：因为任何实数的平方都是非负数，所以如果方程右边是负数，方程就没有实数根。这是直接开平方法的前提条件。'
      });
      break;

    case 'g3_math_003':
      examples.push({
        question: '填空题：用配方法解方程 x² + 4x - 5 = 0 时，两边应同时加上______。',
        answer: '答案：4\n解析：配方法配方时，两边同时加上一次项系数一半的平方。一次项系数是4，一半是2，平方是4。所以两边同时加4。'
      });
      examples.push(makeMCQ('用配方法解 x² - 6x + 5 = 0，配方正确的是',
        ['(x - 3)² = 4', '(x + 3)² = 4', '(x - 3)² = 14', '(x - 6)² = 31'],
        0,
        'x² - 6x + 5 = 0\n移项：x² - 6x = -5\n配方：两边加(6/2)²=9\nx² - 6x + 9 = -5 + 9\n(x - 3)² = 4'));
      examples.push({
        question: '解答题：用配方法解方程 x² + 2x - 3 = 0',
        answer: '答案：x₁ = 1，x₂ = -3\n解析：\nx² + 2x - 3 = 0\n移项：x² + 2x = 3\n配方：两边加1（一次项系数一半的平方）\nx² + 2x + 1 = 3 + 1\n(x + 1)² = 4\n开平方：x + 1 = ±2\nx + 1 = 2 时，x = 1\nx + 1 = -2 时，x = -3\n所以x₁ = 1，x₂ = -3'
      });
      examples.push(makeMCQ('用配方法解 2x² - 4x - 6 = 0，第一步应该',
        ['两边同时加4', '两边同时除以2', '移项得 2x² - 4x = 6', '直接用求根公式'],
        1,
        '配方法的第一步是把二次项系数化为1，所以应该两边同时除以2，得到x² - 2x - 3 = 0，这样配方更方便。'));
      examples.push({
        question: '填空题：代数式 x² - 8x + m 是完全平方式，则 m = ______。',
        answer: '答案：16\n解析：完全平方式形式为(x - a)² = x² - 2ax + a²。对比x² - 8x + m，有2a = 8，即a = 4，所以m = a² = 16。'
      });
      examples.push(makeMCQ('方程 x² + 6x + 5 = 0 配方后得到',
        ['(x + 3)² = -4', '(x + 3)² = 4', '(x - 3)² = 4', '(x + 6)² = 31'],
        1,
        'x² + 6x + 5 = 0\n移项：x² + 6x = -5\n配方：加9\nx² + 6x + 9 = -5 + 9\n(x + 3)² = 4'));
      examples.push({
        question: '解答题：用配方法解方程 2x² + 4x - 1 = 0',
        answer: '答案：x₁ = -1 + √6/2，x₂ = -1 - √6/2\n解析：\n2x² + 4x - 1 = 0\n二次项系数化为1：x² + 2x - 1/2 = 0\n移项：x² + 2x = 1/2\n配方：加1\nx² + 2x + 1 = 1/2 + 1\n(x + 1)² = 3/2\n开平方：x + 1 = ±√(3/2) = ±√6/2\nx = -1 ± √6/2\n所以x₁ = -1 + √6/2，x₂ = -1 - √6/2'
      });
      examples.push(makeMCQ('用配方法证明代数式 x² - 4x + 5 的值恒大于0，配方正确的是',
        ['(x + 2)² + 1', '(x - 2)² + 1', '(x + 2)² - 1', '(x - 2)² - 1'],
        1,
        'x² - 4x + 5 = (x² - 4x + 4) + 1 = (x - 2)² + 1\n因为(x - 2)² ≥ 0，所以(x - 2)² + 1 ≥ 1 > 0，值恒正。'));
      examples.push({
        question: '判断题：用配方法解方程时，配方的关键是方程两边同时加上一次项系数的平方。',
        answer: '答案：错误\n解析：不是加上一次项系数的平方，而是加上一次项系数一半的平方。这是配方法最容易出错的地方。'
      });
      examples.push(makeMCQ('一元二次方程 x² + px + q = 0 配方后为 (x + m)² = n，则',
        ['p = 2m，q = m² - n', 'p = m，q = n', 'p = m²，q = n', 'p = -2m，q = m² + n'],
        0,
        '(x + m)² = n → x² + 2mx + m² = n → x² + 2mx + (m² - n) = 0\n与 x² + px + q = 0 比较，得 p = 2m，q = m² - n。'));
      break;

    case 'g3_math_004':
      examples.push(makeMCQ('一元二次方程 x² - 3x + 2 = 0 的两个根是',
        ['x₁ = 1，x₂ = 2', 'x₁ = -1，x₂ = -2', 'x₁ = 1，x₂ = -2', 'x₁ = -1，x₂ = 2'],
        0,
        'a = 1，b = -3，c = 2\nΔ = b² - 4ac = 9 - 8 = 1\nx = (3 ± √1) / 2 = (3 ± 1) / 2\nx₁ = (3 + 1)/2 = 2，x₂ = (3 - 1)/2 = 1'));
      examples.push({
        question: '填空题：求根公式是 x = ______。',
        answer: '答案：(-b ± √(b² - 4ac)) / 2a （前提：b² - 4ac ≥ 0）\n解析：对于一元二次方程ax²+bx+c=0(a≠0)，当Δ=b²-4ac≥0时，x = (-b ± √Δ) / 2a = (-b ± √(b²-4ac)) / 2a。\n这是公式法解一元二次方程的核心公式。'
      });
      examples.push({
        question: '解答题：用公式法解方程 x² - 5x + 6 = 0',
        answer: '答案：x₁ = 3，x₂ = 2\n解析：\na = 1，b = -5，c = 6\nΔ = b² - 4ac = 25 - 24 = 1 > 0\nx = (-b ± √Δ) / 2a = (5 ± 1) / 2\nx₁ = (5 + 1)/2 = 3\nx₂ = (5 - 1)/2 = 2\n所以x₁ = 3，x₂ = 2'
      });
      examples.push(makeMCQ('方程 2x² + 3x - 2 = 0 的根是',
        ['x₁ = 1/2，x₂ = -2', 'x₁ = -1/2，x₂ = 2', 'x₁ = 1，x₂ = -2', 'x₁ = 1/2，x₂ = 2'],
        0,
        'a = 2，b = 3，c = -2\nΔ = 9 + 16 = 25\nx = (-3 ± 5) / 4\nx₁ = (-3 + 5)/4 = 2/4 = 1/2\nx₂ = (-3 - 5)/4 = -8/4 = -2'));
      examples.push({
        question: '判断题：公式法是解一元二次方程的通用方法，对所有一元二次方程都适用。',
        answer: '答案：正确\n解析：公式法是从配方法推导出来的，是解一元二次方程的通用方法。只要先计算判别式，Δ≥0时代入求根公式即可，Δ<0时直接判断无实根。'
      });
      examples.push(makeMCQ('方程 x² - 4x + 4 = 0 的根的情况是',
        ['没有实数根', '有两个不相等的实数根', '有两个相等的实数根', '只有一个实数根'],
        2,
        'a = 1，b = -4，c = 4\nΔ = 16 - 16 = 0\n因为Δ = 0，所以方程有两个相等的实数根。\n（注意：不是"只有一个根"，而是两个相等的根）'));
      examples.push({
        question: '填空题：方程 x² - 3x - 1 = 0 的两根为______。',
        answer: '答案：x₁ = (3 + √13)/2，x₂ = (3 - √13)/2\n解析：\na = 1，b = -3，c = -1\nΔ = 9 + 4 = 13 > 0\nx = (3 ± √13) / 2\n所以x₁ = (3 + √13)/2，x₂ = (3 - √13)/2'
      });
      examples.push(makeMCQ('关于求根公式，下列说法错误的是',
        ['求根公式是由配方法推导出来的', '使用公式法前要先把方程化为一般形式', '只要Δ ≥ 0，就可以用求根公式求根', '所有一元二次方程都有两个实数根，可以用求根公式求出'],
        3,
        '选项D错误，因为当Δ < 0时，方程没有实数根，求根公式不适用。不是所有一元二次方程都有实根。'));
      examples.push({
        question: '解答题：用公式法解方程 3x² - 5x + 2 = 0',
        answer: '答案：x₁ = 1，x₂ = 2/3\n解析：\na = 3，b = -5，c = 2\nΔ = b² - 4ac = 25 - 24 = 1 > 0\nx = (-b ± √Δ) / 2a = (5 ± 1) / 6\nx₁ = (5 + 1)/6 = 6/6 = 1\nx₂ = (5 - 1)/6 = 4/6 = 2/3\n所以x₁ = 1，x₂ = 2/3'
      });
      examples.push(makeMCQ('方程 ax² + bx + c = 0 的求根公式中，分母是 2a，分子是',
        ['b ± √(b²-4ac)', '-b ± √(b²-4ac)', 'b + √(b²-4ac)', '-b - √(b²-4ac)'],
        1,
        '求根公式是 x = (-b ± √(b²-4ac)) / 2a，分子是 -b ± √(b²-4ac)，注意有负号和±。'
      ));
      break;

    default:
      for (let i = 1; i <= 10; i++) {
        examples.push({
          id: id + '_ex' + String(i).padStart(2, '0'),
          knowledge_id: id,
          question: `题目${i}：关于${name}的例题（待补充）`,
          answer: `答案：待补充\n解析：待补充`
        });
      }
      break;
  }

  return examples.map((ex, i) => ({
    id: id + '_ex' + String(i+1).padStart(2, '0'),
    knowledge_id: id,
    question: ex.question,
    answer: ex.answer
  }));
}

const targetKP = allKP.filter(kp => ['g3_math_001', 'g3_math_002', 'g3_math_003', 'g3_math_004'].includes(kp.id));

console.log(`正在生成 ${targetKP.length} 个知识点的高质量例题...`);

let totalExamples = 0;
targetKP.forEach(kp => {
  const examples = generateExamplesForKP(kp);
  const fileName = kp.id + '_010.json';
  fs.writeFileSync(path.join(EX_DIR, fileName), JSON.stringify(examples, null, 2), 'utf8');
  totalExamples += examples.length;
  console.log(`  ${fileName}: ${examples.length} 道题`);
});

console.log(`\n完成！共生成 ${totalExamples} 道例题`);
